import { SQSEvent } from 'aws-lambda';
import { scriptsProcessorService } from './services/scriptsProcessorService';

export const lambdaHandler = async (event: SQSEvent): Promise<void> => {
  try {
    await scriptsProcessorService(event);
  } catch (error) {
    console.error('error', error);
  }
};
