import { APIGatewayProxyEvent } from 'aws-lambda';
import { mintAsDataNft } from './services';
import { baseLambdaHandler } from './baseLambdaHandler';

const mintDataNftHandler = async (event: APIGatewayProxyEvent): Promise<any> => {
  return await mintAsDataNft(event);
};

export const lambdaHandler = baseLambdaHandler.bind(null, mintDataNftHandler);
