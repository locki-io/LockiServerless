import { DynamoDBRepository } from '../awsServiceRepository';
import { NativeAuthClient } from '../nativeAuth';

export async function getNativeAuthFromApiKey(apiKey: string, dbClient: DynamoDBRepository) {
  const items = await dbClient.queryByIndexCommand('apiKey_ix', 'apiKey', apiKey);

  if (items.length > 0) {
    const item = items[0];

    const client = new NativeAuthClient();
    const init = await client.initialize({
      origin: item?.origin,
      apiUrl: process.env.MUTLIVERSEX_API_URL,
      blockHashShard: 0,
      expirySeconds: 86400,
    });
    const accessToken = client.getToken(item?.address || '', init, item?.signature);

    return { nativeAuthToken: accessToken, expiry: new Date().getTime() + 86400 * 1000 };
  } else {
    throw new Error('apiKey is not valid');
  }
}
