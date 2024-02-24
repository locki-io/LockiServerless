import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument, GetCommand, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

export class DynamoDBRepository {
  public readonly tableName: string;
  private readonly ddbDocClient;

  constructor(tableName: string) {
    this.tableName = tableName;

    this.ddbDocClient = DynamoDBDocument.from(new DynamoDB({}), {
      marshallOptions: {
        convertEmptyValues: true,
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
      },
    });
  }

  async sendCommand(key: any, options?: any) {
    const params = {
      TableName: this.tableName,
      Key: key,
      key,
      ...options,
    };

    const data = await this.ddbDocClient.send(new GetCommand(params));
    return data.Item;
  }

  async queryByIndexCommand(indexName: string, indexKey: string, indexValue: any) {
    const params = {
      TableName: this.tableName,
      IndexName: indexName,
      KeyConditionExpression: `${indexKey} = :${indexKey}`,
      ExpressionAttributeValues: {
        [`:${indexKey}`]: indexValue,
      },
    };

    const data = await this.ddbDocClient.send(new QueryCommand(params));
    return data?.Items || [];
  }

  async putCommand(item: any, options?: any) {
    const params = {
      TableName: this.tableName,
      Item: item,
      ...options,
    };

    await this.ddbDocClient.send(new PutCommand(params));
  }

  async updateItem(key: any, options: any) {
    console.log('key', key);
    const params = {
      TableName: this.tableName,
      Key: key,
      ...options,
      ReturnValues: 'ALL_NEW',
    };

    await this.ddbDocClient.send(new UpdateCommand(params));
  }
}
