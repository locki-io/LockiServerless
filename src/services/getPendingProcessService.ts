import { APIGatewayProxyEvent } from 'aws-lambda';
import { NativeAuthRepository } from '../repository';
import { DynamoDBRepository } from '../awsServiceRepository/dynamoDBRepository';

const dbClient = new DynamoDBRepository(process.env.SCRIPTS_PROCESSING_HISTORY_TABLE || '');

export const getPendingProcessService = async (event: APIGatewayProxyEvent) => {
  const nativeAuthToken = event?.headers?.Authorization || '';
  const nativeAuthTokenValidityResponse = await NativeAuthRepository.validateNativeAuthToken(nativeAuthToken);

  if (nativeAuthTokenValidityResponse.valid) {
    const creatorAddress = nativeAuthTokenValidityResponse.address;
    console.log('creatorAddress', creatorAddress);
    const pendingProcessQueryResponse = await dbClient.queryByIndexCommand(
      'creatorAddress_processingStatus_ix',
      'creatorAddress',
      creatorAddress,
      'processingStatus',
      'Processing',
      'begins_with(processingStatus, :processingStatus)',
    );

    return {
      products: pendingProcessQueryResponse,
    };
  } else {
    return {
      error: 'Invalid auth token',
      products: [],
    };
  }
};
