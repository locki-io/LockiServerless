import { APIGatewayProxyEvent } from 'aws-lambda';
import { DynamoDBRepository } from '../awsServiceRepository';
import { NativeAuthClient } from '../nativeAuth';

const dbClient = new DynamoDBRepository(process.env.LOCKI_USERS_TABLE || '');

export const getNativeAuthTokenService = async (event: APIGatewayProxyEvent) => {
  const { apiKey } = event?.queryStringParameters || {};
  const items = await dbClient.queryByIndexCommand('apiKey_ix', 'apiKey', apiKey);

  if (items.length > 0) {
    const item = items[0];

    const client = new NativeAuthClient();
    const init = await client.initialize({
      origin: item?.origin,
      apiUrl: 'https://devnet-api.multiversx.com',
      blockHashShard: 0,
      expirySeconds: 86400,
    });
    const accessToken = client.getToken(item?.address, init, item?.signature);
    return { nativeAuthToken: accessToken, expiry: new Date().getTime() + 86400 * 1000 };
  } else {
    throw new Error('apiKey is not valid');
  }
};
