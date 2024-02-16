import { SQSEvent, SQSRecord } from 'aws-lambda';
import { blenderScriptsProcessor } from './repository/blenderScriptRepository';

export const lambdaHandler = async (event: SQSEvent): Promise<void> => {
  try {
    const message: SQSRecord | Record<string, never> =
      event.Records && Array.isArray(event.Records) && event.Records.length > 0 ? event.Records[0] : {};
    let messageBody = { filename: '' };
    if (message?.body && typeof message.body === 'string') {
      messageBody = JSON.parse(message.body);
    }
    await blenderScriptsProcessor(messageBody?.filename || '');
  } catch (error) {
    console.log('error', JSON.stringify(error));
  }
};
