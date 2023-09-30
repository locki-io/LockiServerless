import { APIGatewayProxyEvent } from 'aws-lambda';
import { NativeAuthServer, NativeAuthServerConfig } from '../nativeAuth';

export const getApiTokenService = async (event: APIGatewayProxyEvent) => {
    const { headers } = event;
    const nativeAuthToken = headers.Authorization;

    if (nativeAuthToken) {
        const defaultConfig: NativeAuthServerConfig = {
            acceptedOrigins: ['https://test.explorer.itheum.io', 'https://devnet-api.multiversx.com'],
            maxExpirySeconds: 86400,
            apiUrl: 'https://devnet-api.multiversx.com',
        };

        const server = new NativeAuthServer(defaultConfig);

        await server.validate(nativeAuthToken);

        const result = server.decode(nativeAuthToken);
        console.log('result', JSON.stringify(result));

        return 'gfdsfhhljdlfs';
    } else {
        throw new Error('Invalid Auth Token');
    }
};
