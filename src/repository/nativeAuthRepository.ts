import { DynamoDBRepository } from '../awsServiceRepository';
import { NativeAuthClient } from '../nativeAuth';
import { NativeAuthServerConfig, NativeAuthServer } from '@multiversx/sdk-native-auth-server';

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

export async function validateNativeAuthToken(nativeAuthToken: string) {
  try {
    const defaultConfig: NativeAuthServerConfig = {
      acceptedOrigins: [
        'https://test.explorer.itheum.io',
        'https://devnet-api.multiversx.com',
        'localhost',
        'http://localhost:3000',
        'https://app.locki.io',
      ],
      maxExpirySeconds: 86400,
      apiUrl: process.env.MUTLIVERSEX_API_URL,
    };

    const server = new NativeAuthServer(defaultConfig);

    const validateResult = await server.validate(nativeAuthToken);
    console.log('validateResult', validateResult);

    return { valid: true, address: validateResult?.address, expires: validateResult?.expires };
  } catch (error) {
    console.error('error', error);
    return { valid: false };
  }
}
