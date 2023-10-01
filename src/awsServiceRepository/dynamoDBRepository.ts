import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

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

  async putCommand(item: any, options?: any) {
    const params = {
      TableName: this.tableName,
      Item: item,
      ...options,
    };

    await this.ddbDocClient.send(new PutCommand(params));
  }
}
