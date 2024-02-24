import { SQSEvent } from 'aws-lambda';
import { scriptsProcessorService } from './services';

export const lambdaHandler = async (event: SQSEvent): Promise<void> => {
  try {
    await scriptsProcessorService(event);
  } catch (error) {
    console.log('error', JSON.stringify(error));
  }
};
