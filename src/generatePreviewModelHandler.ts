import { APIGatewayProxyEvent } from 'aws-lambda';
import { generatePreviewScripts } from './services';
import { baseLambdaHandler } from './baseLambdaHandler';

const generatePreviewModelHandler = async (event: APIGatewayProxyEvent): Promise<any> => {
  return await generatePreviewScripts(event);
};

export const lambdaHandler = baseLambdaHandler.bind(null, generatePreviewModelHandler);
