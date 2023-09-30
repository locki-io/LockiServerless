import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getApiTokenService } from './services';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.info('event', JSON.stringify(event));
    try {
        const token = await getApiTokenService(event);
        console.log('token', token);

        return {
            statusCode: 200,
            body: JSON.stringify({
                token,
            }),
        };
    } catch (err: any) {
        console.log('err', err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: err?.message || 'some error happened',
            }),
        };
    }
};
