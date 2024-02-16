import { mintAsDataNft } from './../../../services/mintAsDataNft';
import { APIGatewayProxyEvent } from 'aws-lambda';
// import { expect, describe, it } from '@jest/globals';

describe('mintAsDAtaNft', function () {
  it('verifies successful response', async () => {
    const mockEvent: Partial<APIGatewayProxyEvent> = {
      headers: {},
      body: '{}',
    };
    const response = await mintAsDataNft(mockEvent as APIGatewayProxyEvent);
    expect(response).toEqual({
      message: 'Succesfully minted Data Nft',
    });
  });
});
