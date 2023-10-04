import { APIGatewayProxyEvent } from 'aws-lambda';

export const getNativeAuthTokenService = async (event: APIGatewayProxyEvent) => {
  // get api key from query params
  return { nativeAuthToken: 'sfsfdsfsf', expiry: 60 };
};
