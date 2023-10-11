import { APIGatewayProxyEvent } from 'aws-lambda';
import { DataNftRepository, NativeAuthRepository } from '../repository';
import { NftType } from '@multiversx/sdk-dapp/types/tokens.types';
import { DataNftMetadataType } from '../types/dataNftTypes';
import { DynamoDBRepository } from '../awsServiceRepository';

const dbClient = new DynamoDBRepository(process.env.LOCKI_USERS_TABLE || '');

export const validateNativeAuthTokenService = async (event: APIGatewayProxyEvent) => {
  const { nativeAuthTokenService } = event?.queryStringParameters || {};
};
