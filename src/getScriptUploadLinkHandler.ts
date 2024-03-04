import { getScriptUploadLinkService } from './services/getScriptUploadLinkService';
import { baseLambdaHandler } from './baseLambdaHandler';
import { APIGatewayProxyEvent } from 'aws-lambda';

const getScriptUploadLinkHandler = async (event: APIGatewayProxyEvent): Promise<any> => {
  return await getScriptUploadLinkService(event);
};

export const lambdaHandler = baseLambdaHandler.bind(null, getScriptUploadLinkHandler);
