import { APIGatewayProxyEvent } from 'aws-lambda';
import generateApiKey from 'generate-api-key';

import { NativeAuthServer, NativeAuthServerConfig } from '../nativeAuth';
import { DynamoDBRepository } from '../awsServiceRepository';

const dbClient = new DynamoDBRepository(process.env.LOCKI_USERS_TABLE || '');

export const getExistingItem = async (ddbRepository: DynamoDBRepository, address: string, origin: string) => {
  const item = await ddbRepository.sendCommand({ address, origin }, {});

  return item?.Items;
};

export const getApiTokenService = async (event: APIGatewayProxyEvent) => {
  const { headers } = event;
  const nativeAuthToken = headers.Authorization;

  if (nativeAuthToken) {
    try {
      const defaultConfig: NativeAuthServerConfig = {
        acceptedOrigins: [
          'https://test.explorer.itheum.io',
          'https://devnet-api.multiversx.com',
          'localhost',
          'http://localhost:3000',
          'https://app.locki.io',
          'https://app-nextjs-6tvy5nqnu-satish-nvrns-projects.vercel.app',
        ],
        maxExpirySeconds: 86400,
        apiUrl: process.env.MUTLIVERSEX_API_URL,
      };

      const server = new NativeAuthServer(defaultConfig);

      await server.validate(nativeAuthToken);

      const result = server.decode(nativeAuthToken);

      const existingUser = await getExistingItem(dbClient, result.address, result.origin);

      if (existingUser) {
        return { apiKey: existingUser?.apiKey || '' };
      } else {
        const newApiKey = generateApiKey();
        await dbClient.putCommand({
          address: result?.address,
          origin: result?.origin,
          signature: result?.signature,
          apiKey: newApiKey,
        });

        return { apiKey: newApiKey };
      }
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  } else {
    throw new Error('Invalid Auth Token');
  }
};
