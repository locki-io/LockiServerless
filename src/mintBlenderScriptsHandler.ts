import { APIGatewayProxyEvent } from 'aws-lambda';
import { mintBlenderScripts } from './services';
import { baseLambdaHandler } from './baseLambdaHandler';

const mintBlenderScriptsHandler = async (event: APIGatewayProxyEvent): Promise<any> => {
  return await mintBlenderScripts(event);
};

export const lambdaHandler = baseLambdaHandler.bind(null, mintBlenderScriptsHandler);
