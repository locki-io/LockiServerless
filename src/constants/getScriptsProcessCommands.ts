import { replaceFilenameExtension } from '../utils/common';
import { INPUT_OPTIONS } from './scriptProcessingConstants';

export const getScriptsProcessCommands = (
  type: string,
  exportOption: string,
  filename: string,
  processedId: number,
) => {
  const allCommands: any = {
    [INPUT_OPTIONS.blenderPyInput]: {
      glb: [
        `#!/bin/bash`,
        `sudo -u ec2-user -i <<'EOF'`,
        `cd ~`,
        `cd blender-3.6.7-linux-x64`,
        `export AWS_ACCESS_KEY_ID=${process.env.AWS_ACCESS_KEY_ID}`,
        `export AWS_SECRET_ACCESS_KEY=${process.env.AWS_SECRET_ACCESS_KEY}`,
        `export AWS_DEFAULT_REGION=${process.env.AWS_DEFAULT_REGION || 'eu-west-3'}`,
        `export AWS_SESSION_TOKEN=${process.env.AWS_SESSION_TOKEN}`,
        `aws s3api get-object --bucket dataassets.locki.io --key processData/${processedId}/${filename} ${filename}`,
        `mkdir preview`,
        `./blender -b --python ${filename} --python-expr "import bpy; bpy.ops.wm.save_as_mainfile(filepath='preview/${replaceFilenameExtension(
          filename,
          'blend',
        )}')"`,
        `./blender -b preview/${replaceFilenameExtension(
          filename,
          'blend',
        )} --python-expr "import bpy; bpy.ops.export_scene.gltf(filepath='preview/${replaceFilenameExtension(
          filename,
          'gltf',
        )}')"`,
        `aws s3 sync preview s3://dataassets.locki.io/processData/${processedId}`,
        `rm -rf ${filename} preview`,
        `aws sqs send-message --queue-url ${
          process.env.SCRIPTS_PROCESSING_QUEUE
        } --message-body '{"previewUrl":"https://s3.eu-central-1.amazonaws.com/dataassets.locki.io/processData/${processedId}/${replaceFilenameExtension(
          filename,
          'glb',
        )}","processedId":${processedId},"type":"${type}","finishProcess": true}'`,
        `EOF`,
      ],
    },
  };

  return allCommands[type][exportOption];
};
