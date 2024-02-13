import { APIGatewayProxyEvent } from 'aws-lambda';
import { validateNativeAuthTokenService } from './services';
import { baseLambdaHandler } from './baseLambdaHandler';

const getNativeAuthTokenHandler = async (event: APIGatewayProxyEvent): Promise<any> => {
  return await validateNativeAuthTokenService(event);
};

export const lambdaHandler = baseLambdaHandler.bind(null, getNativeAuthTokenHandler);
