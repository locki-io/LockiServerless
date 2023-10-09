import { APIGatewayProxyEvent } from 'aws-lambda';
import { DynamoDBRepository } from '../awsServiceRepository';
import { NativeAuthRepository } from '../repository';

const dbClient = new DynamoDBRepository(process.env.LOCKI_USERS_TABLE || '');

export const getNativeAuthTokenService = async (event: APIGatewayProxyEvent) => {
  const { apiKey } = event?.queryStringParameters || {};
  const nativeAuth = await NativeAuthRepository.getNativeAuthFromApiKey(apiKey || '', dbClient);

  return nativeAuth;
};
