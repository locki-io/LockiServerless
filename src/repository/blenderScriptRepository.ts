import { Ec2Repository } from '../awsServiceRepository/ec2Repository';

const ec2Repository = new Ec2Repository(
  process.env.BLENDER_PROCESSOR_INSTANCE_IMAGE_ID || '',
  'blender-processor',
  'eu-west-3',
);

export async function blenderScriptsProcessor() {
  console.log('process.env', JSON.stringify(process.env));
  const commands = [
    `#!/bin/bash`,
    `sudo -u ec2-user -i <<'EOF'`,
    `cd ~`,
    // `wget https://ftp.nluug.nl/pub/graphics/blender//release/Blender3.6/blender-3.6.8-linux-x64.tar.xz`,
    // `ls`,
    // `tar -xf blender-3.6.8-linux-x64.tar.xz`,
    // `ls`,
    // `cd blender-3.6.8-linux-x64/`,
    `cd blender-3.6.7-linux-x64`,
    `export AWS_ACCESS_KEY_ID=${process.env.AWS_ACCESS_KEY_ID}`,
    `export AWS_SECRET_ACCESS_KEY=${process.env.AWS_SECRET_ACCESS_KEY}`,
    `export AWS_DEFAULT_REGION=${process.env.AWS_DEFAULT_REGION}`,
    `aws s3api get-object --bucket blender-scripts --key stackedCubes2.py stackedCubes2.py`,
    `./blender -b --python stackedCubes2.py --python-expr "import bpy; bpy.ops.wm.save_as_mainfile(filepath='latestOutput.blend')"`,
    `mkdir preview`,
    `./blender -b latestOutput.blend --python-expr "import bpy; bpy.ops.export_scene.gltf(filepath='preview/stackedCubes2.gltf')"`,
    `aws s3 sync preview s3://blender-scripts/preview`,
    `rm -rf stackedCubes2.py stackedCubes2.glb latestOutput.blend`,
    `EOF`,
  ];
  const newInstanceResponse = await ec2Repository.createInstanceWithUserData({
    UserData: commands.join('\n'),
    SecurityGroupIds: [process.env.BLENDER_PROCESSOR_INSTANCE_SG || ''],
  });
  console.log('newInstanceResponse', newInstanceResponse?.Instances?.[0]?.InstanceId);
}
