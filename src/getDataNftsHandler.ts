import { APIGatewayProxyEvent } from 'aws-lambda';
import { getDataNftsService } from './services';
import { baseLambdaHandler } from './baseLambdaHandler';

const getDataNftsHandler = async (event: APIGatewayProxyEvent): Promise<any> => {
  return await getDataNftsService(event);
};

export const lambdaHandler = baseLambdaHandler.bind(null, getDataNftsHandler);
