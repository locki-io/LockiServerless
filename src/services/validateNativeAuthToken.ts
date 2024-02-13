import { APIGatewayProxyEvent } from 'aws-lambda';
import { NativeAuthServerConfig, NativeAuthServer } from '../nativeAuth';

export const validateNativeAuthTokenService = async (event: APIGatewayProxyEvent) => {
  const { headers } = event;
  const nativeAuthToken = headers.Authorization;
  console.log('nativeAuthToken', nativeAuthToken);

  if (nativeAuthToken) {
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

    const validateResult = await server.validate(nativeAuthToken);

    return { valid: true, address: validateResult?.address, expires: validateResult?.expires };
  } else {
    return { valid: false, address: null };
  }
};
