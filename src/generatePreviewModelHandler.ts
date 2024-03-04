import { APIGatewayProxyEvent } from 'aws-lambda';
import { generateBlenderPythonScriptPreviewService } from './services';
import { baseLambdaHandler } from './baseLambdaHandler';
import { INPUT_OPTIONS } from './constants/scriptProcessingConstants';

const generatePreviewModelHandler = async (event: APIGatewayProxyEvent): Promise<any> => {
  switch (event?.queryStringParameters?.inputOption) {
    case INPUT_OPTIONS.blenderPyInput:
    case INPUT_OPTIONS.blenderPyFile:
    case INPUT_OPTIONS.blendFile:
      return await generateBlenderPythonScriptPreviewService(event);
      break;

    default:
      break;
  }
};

export const lambdaHandler = baseLambdaHandler.bind(null, generatePreviewModelHandler);
