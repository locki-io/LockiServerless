import { Ec2Repository } from '../awsServiceRepository/ec2Repository';

const ec2Repository = new Ec2Repository('ami-0231dcc78fb6cb6f8', 'blender-processor', 'eu-west-3');

export async function blenderScriptsProcessor() {
  const userData = `cd blender-3.6.7-linux-x64/
  aws s3api get-object --bucket blender-scripts --key stackedCubes2.py stackedCubes2.py
  ./blender -b --python stackedCubes2.py --python-expr "import bpy; bpy.ops.wm.save_as_mainfile(filepath='latestOutput.blend')"
  ./blender -b latestOutput.blend --python-expr "import bpy; bpy.ops.export_scene.gltf(filepath='preview/stackedCubes2.gltf')"
  aws s3 sync preview s3://blender-scripts/preview
  rm -rf stackedCubes2.py stackedCubes2.glb latestOutput.blend`;
  const newInstanceResponse = await ec2Repository.createInstanceWithUserData({ UserData: userData });
  console.log('newInstanceResponse', JSON.stringify(newInstanceResponse));
}
