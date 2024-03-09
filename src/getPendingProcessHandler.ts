import { APIGatewayProxyEvent } from 'aws-lambda';
import { baseLambdaHandler } from './baseLambdaHandler';
import { getPendingProcessService } from './services/getPendingProcessService';

const getPendingProcessHandler = async (event: APIGatewayProxyEvent): Promise<any> => {
  return await getPendingProcessService(event);
};

export const lambdaHandler = baseLambdaHandler.bind(null, getPendingProcessHandler);
