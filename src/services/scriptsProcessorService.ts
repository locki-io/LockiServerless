import { SQSEvent, SQSRecord } from 'aws-lambda';
import { BlenderScriptsProcessingRepository } from '../repository';
import { DynamoDBRepository } from '../awsServiceRepository';
import { sendMessageToConnection } from './sendMessageToConnection';

const dbClient = new DynamoDBRepository(process.env.SCRIPTS_PROCESSING_HISTORY_TABLE || '');

export const scriptsProcessorService = async (event: SQSEvent) => {
  const message: SQSRecord | Record<string, never> =
    event.Records && Array.isArray(event.Records) && event.Records.length > 0 ? event.Records[0] : {};
  let messageBody = { filename: '', type: 'blenderPythonScript', processedId: 0 };
  if (message?.body && typeof message.body === 'string') {
    messageBody = JSON.parse(message.body);
  }

  await dbClient.updateItem(
    { id: messageBody.processedId, type: 'blenderPythonScript' },
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
    case 'blenderPythonScript':
      await BlenderScriptsProcessingRepository.blenderScriptsProcessor(
        messageBody?.filename || '',
        messageBody.processedId,
      );
      break;

    default:
      break;
  }
};
