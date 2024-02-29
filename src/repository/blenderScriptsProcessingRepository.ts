import { DynamoDBRepository } from '../awsServiceRepository';
import { Ec2Repository } from '../awsServiceRepository/ec2Repository';
import { sendMessageToConnection } from '../services/sendMessageToConnection';
import { replaceFilenameExtension } from '../utils/common';

const ec2Repository = new Ec2Repository(
  process.env.BLENDER_PROCESSOR_INSTANCE_IMAGE_ID || '',
  'blender-processor',
  'eu-west-3',
);
const dbClient = new DynamoDBRepository(process.env.SCRIPTS_PROCESSING_HISTORY_TABLE || '');

export async function blenderScriptsProcessor(filename: string, processedId: number) {
  const commands = [
    `#!/bin/bash`,
    `sudo -u ec2-user -i <<'EOF'`,
    `cd ~`,
    `cd blender-3.6.7-linux-x64`,
    `export AWS_ACCESS_KEY_ID=${process.env.AWS_ACCESS_KEY_ID}`,
    `export AWS_SECRET_ACCESS_KEY=${process.env.AWS_SECRET_ACCESS_KEY}`,
    `export AWS_DEFAULT_REGION=${process.env.AWS_DEFAULT_REGION || 'eu-west-3'}`,
    `export AWS_SESSION_TOKEN=${process.env.AWS_SESSION_TOKEN}`,
    `aws s3api get-object --bucket dataassets.locki.io --key dataStreams/${filename} ${filename}`,
    `./blender -b --python ${filename} --python-expr "import bpy; bpy.ops.wm.save_as_mainfile(filepath='latestOutput.blend')"`,
    `mkdir preview`,
    `./blender -b latestOutput.blend --python-expr "import bpy; bpy.ops.export_scene.gltf(filepath='preview/${replaceFilenameExtension(
      filename,
      'gltf',
    )}')"`,
    `aws s3 sync preview s3://dataassets.locki.io/dataPreviews`,
    `rm -rf ${filename} ${replaceFilenameExtension(filename, 'glb')} latestOutput.blend`,
    `aws sqs send-message --queue-url ${
      process.env.SCRIPTS_PROCESSING_QUEUE
    } --message-body '{"previewUrl":"https://s3.eu-central-1.amazonaws.com/dataassets.locki.io/dataPreviews/${replaceFilenameExtension(
      filename,
      'glb',
    )}","processedId":${processedId},"type":"finishBlenderPythonScript"}'`,
    `EOF`,
  ];

  const newInstanceResponse = await ec2Repository.createInstanceWithUserData({
    UserData: commands.join('\n'),
    SecurityGroupIds: [process.env.BLENDER_PROCESSOR_INSTANCE_SG || ''],
  });

  await dbClient.updateItem(
    { id: processedId, type: 'blenderPythonScript' },
    {
      UpdateExpression: 'set processingStatus = :processingStatus, updatedAt = :updatedAt, instanceId = :instanceId',
      ExpressionAttributeValues: {
        ':processingStatus': 'Processing',
        ':updatedAt': new Date().toISOString(),
        ':instanceId': newInstanceResponse?.Instances?.[0]?.InstanceId,
      },
    },
  );

  await sendMessageToConnection(JSON.stringify({ processedId, processingStatus: 'Processing' }));
}

export async function finishBlenderScriptProcessor(processedId: number, previewUrl: string) {
  const latestProcessingData = await dbClient.updateItem(
    { id: processedId, type: 'blenderPythonScript' },
    {
      UpdateExpression: 'set processingStatus = :processingStatus, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':processingStatus': 'Success',
        ':updatedAt': new Date().toISOString(),
      },
    },
  );

  await sendMessageToConnection(JSON.stringify({ processedId, processingStatus: 'Success', previewUrl }));

  if (latestProcessingData?.Attributes?.instanceId) {
    await ec2Repository.terminateInstance([latestProcessingData.Attributes.instanceId]);
  }
}
