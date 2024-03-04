import { SQSEvent, SQSRecord } from 'aws-lambda';
import { BlenderScriptsProcessingRepository } from '../repository';
import { DynamoDBRepository } from '../awsServiceRepository';
import { sendMessageToConnection } from './sendMessageToConnection';
import { INPUT_OPTIONS } from '../constants/scriptProcessingConstants';
import { Ec2Repository } from '../awsServiceRepository/ec2Repository';

interface ScriptsMessageBody {
  filename: string;
  type: string;
  processedId: number;
  previewUrl: string;
  exportOption: string;
  finishProcess?: boolean;
}

const dbClient = new DynamoDBRepository(process.env.SCRIPTS_PROCESSING_HISTORY_TABLE || '');
const ec2Repository = new Ec2Repository(
  process.env.BLENDER_PROCESSOR_INSTANCE_IMAGE_ID || '',
  'blender-processor',
  'eu-west-3',
);

async function finishBlenderScriptProcessor(processedId: number, previewUrl: string, type: string) {
  const latestProcessingData = await dbClient.updateItem(
    { id: processedId, type },
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

export const scriptsProcessorService = async (event: SQSEvent) => {
  console.log('processing messages', event.Records);
  const message: SQSRecord | Record<string, never> =
    event.Records && Array.isArray(event.Records) && event.Records.length > 0 ? event.Records[0] : {};
  let messageBody: ScriptsMessageBody = {
    filename: '',
    type: INPUT_OPTIONS.blenderPyInput,
    processedId: 0,
    previewUrl: '',
    exportOption: 'glb',
  };
  if (message?.body && typeof message.body === 'string') {
    messageBody = JSON.parse(message.body);
  }

  if (messageBody?.finishProcess) {
    await finishBlenderScriptProcessor(messageBody.processedId, messageBody.previewUrl, messageBody.type);
    return;
  }

  await dbClient.updateItem(
    { id: messageBody.processedId, type: messageBody.type },
    {
      UpdateExpression: 'set processingStatus = :processingStatus, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':processingStatus': 'Pending',
        ':updatedAt': new Date().toISOString(),
      },
    },
  );

  await sendMessageToConnection(JSON.stringify({ processedId: messageBody.processedId, processingStatus: 'Pending' }));

  switch (messageBody.type) {
    case INPUT_OPTIONS.blenderPyInput:
    case INPUT_OPTIONS.blenderPyFile:
    case INPUT_OPTIONS.blendFile:
      await BlenderScriptsProcessingRepository.blenderScriptsProcessor(
        messageBody?.filename || '',
        messageBody.processedId,
        messageBody.type,
        messageBody.exportOption,
      );
      break;

    default:
      break;
  }
};
