import { APIGatewayProxyEvent } from 'aws-lambda';
import { DynamoDBRepository } from '../awsServiceRepository/dynamoDBRepository';
import { NativeAuthRepository } from '../repository/';

const dbClient = new DynamoDBRepository(process.env.SCRIPTS_PROCESSING_HISTORY_TABLE || '');

export const updateProcessStatusService = async (event: APIGatewayProxyEvent) => {
  const { processedId, type, status } = JSON.parse(event.body || '{}');
  const nativeAuthToken = event?.headers?.Authorization || '';
  const nativeAuthTokenValidityResponse = await NativeAuthRepository.validateNativeAuthToken(nativeAuthToken);

  if (nativeAuthTokenValidityResponse.valid) {
    const newProcessingItem = await dbClient.updateItem(
      { id: processedId, type: type },
      {
        UpdateExpression: 'set processingStatus = :processingStatus, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':processingStatus': status,
          ':updatedAt': new Date().toISOString(),
        },
      },
    );

    return {
      status: 'Success',
      ...newProcessingItem,
    };
  } else {
    return {
      error: 'Invalid auth token',
      status: 'Fail',
    };
  }
};
