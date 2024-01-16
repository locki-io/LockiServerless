import { SQSEvent, Context } from 'aws-lambda';

export const lambdaHandler = async (event: SQSEvent, context: Context): Promise<void> => {
  console.log('event', JSON.stringify(event));
  const message = event.Records && Array.isArray(event.Records) && event.Records.length > 0 ? event.Records[0] : {};
  console.log('message', message);
};
