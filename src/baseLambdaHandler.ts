import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const baseLambdaHandler = async (
  lambdaHandler: (event: APIGatewayProxyEvent) => any,
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const response = await lambdaHandler(event);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*', // Allow from anywhere
        'Access-Control-Allow-Methods': '*', // Allow only GET request
      },
      body: JSON.stringify(response),
    };
  } catch (err: any) {
    console.log('err', JSON.stringify(err));
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*', // Allow from anywhere
        'Access-Control-Allow-Methods': '*', // Allow only GET request
      },
      body: JSON.stringify({
        error: err?.message || 'some error happened',
      }),
    };
  }
};
