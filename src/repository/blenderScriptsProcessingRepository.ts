import { DynamoDBRepository } from '../awsServiceRepository';
import { Ec2Repository } from '../awsServiceRepository/ec2Repository';
import { getScriptsProcessCommands } from '../constants/getScriptsProcessCommands';
import { sendMessageToConnection } from '../services/sendMessageToConnection';

const ec2Repository = new Ec2Repository(
  process.env.BLENDER_PROCESSOR_INSTANCE_IMAGE_ID || '',
  'blender-processor',
  'eu-west-3',
);
const dbClient = new DynamoDBRepository(process.env.SCRIPTS_PROCESSING_HISTORY_TABLE || '');

export async function blenderScriptsProcessor(
  filename: string,
  processedId: number,
  type: string,
  exportOption: string,
) {
  const commands: string[] = getScriptsProcessCommands(type, exportOption, filename, processedId);

  const newInstanceResponse = await ec2Repository.createInstanceWithUserData({
    UserData: commands.join('\n'),
    SecurityGroupIds: [process.env.BLENDER_PROCESSOR_INSTANCE_SG || ''],
  });

  await dbClient.updateItem(
    { id: processedId, type },
    {
      UpdateExpression: 'set processingStatus = :processingStatus, updatedAt = :updatedAt, instanceId = :instanceId',
      ExpressionAttributeValues: {
        ':processingStatus': 'ProcessingProcessing',
        ':updatedAt': new Date().toISOString(),
        ':instanceId': newInstanceResponse?.Instances?.[0]?.InstanceId,
      },
    },
  );

  await sendMessageToConnection(JSON.stringify({ processedId, processingStatus: 'ProcessingProcessing' }));
}
