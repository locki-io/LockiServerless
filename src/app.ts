import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getApiTokenService } from './services';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.info('event', JSON.stringify(event));
  try {
    const apiKey = await getApiTokenService(event);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*', // Allow from anywhere
        'Access-Control-Allow-Methods': 'GET', // Allow only GET request
      },
      body: JSON.stringify({
        apiKey,
      }),
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
