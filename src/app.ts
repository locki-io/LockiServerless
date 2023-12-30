import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { validateNativeAuthTokenService, getDataNftsService, mintBlenderScripts } from './services';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.info('event', JSON.stringify(event));
  try {
    let response = {};
    switch (event?.path) {
      case '/identity':
        response = await validateNativeAuthTokenService(event);
        break;
      case '/datanfts':
        response = await getDataNftsService(event);
        break;
      case '/mintBlenderScripts':
        response = await mintBlenderScripts(event);
        break;
      default:
        break;
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*', // Allow from anywhere
        'Access-Control-Allow-Methods': 'GET', // Allow only GET request
      },
      body: JSON.stringify(response),
    };
  } catch (err: any) {
    console.log('err', JSON.stringify(err));
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*', // Allow from anywhere
        'Access-Control-Allow-Methods': 'GET', // Allow only GET request
      },
      body: JSON.stringify({
        error: err?.message || 'some error happened',
      }),
    };
  }
};
