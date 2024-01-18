import { SQSEvent } from 'aws-lambda';
import { blenderScriptsProcessor } from './repository/blenderScriptRepository';

export const lambdaHandler = async (event: SQSEvent): Promise<void> => {
  try {
    const message = event.Records && Array.isArray(event.Records) && event.Records.length > 0 ? event.Records[0] : {};
    console.log('message', JSON.stringify(message));
    await blenderScriptsProcessor();
  } catch (error) {
    console.log('error', JSON.stringify(error));
  }
};
