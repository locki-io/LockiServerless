import { ApiGatewayManagementApi } from 'aws-sdk';
import { DynamoDBRepository } from '../awsServiceRepository/dynamoDBRepository';

const dbClient = new DynamoDBRepository(process.env.CONNECTION_TABLE_NAME || '');

export const sendMessageToConnection = async (postData: string) => {
  try {
    const connectionData = await dbClient.scanCommand();
    const connectionDataItems = connectionData.Items || [];

    const apigwManagementApi = new ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: process.env.WEBSOCKET_ENDPOINT,
    });

    const postCalls = connectionDataItems.map(async ({ connectionId }) => {
      await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: postData }).promise();
    });

    await Promise.allSettled(postCalls);
  } catch (error) {
    console.error('websocket error', error);
  }
};
