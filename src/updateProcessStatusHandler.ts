import { APIGatewayProxyEvent } from 'aws-lambda';
import { baseLambdaHandler } from './baseLambdaHandler';
import { updateProcessStatusService } from './services/updateProcessStatusService';

const updateProcessStatusHandler = async (event: APIGatewayProxyEvent): Promise<any> => {
  return await updateProcessStatusService(event);
};

export const lambdaHandler = baseLambdaHandler.bind(null, updateProcessStatusHandler);
