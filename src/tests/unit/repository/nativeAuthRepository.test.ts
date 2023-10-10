// import { describe, it } from '@jest/globals';
import { NativeAuthRepository } from '../../../repository';
import { DynamoDBRepository } from '../../../awsServiceRepository';

jest.spyOn(DynamoDBRepository.prototype, 'queryByIndexCommand').mockResolvedValue([
  {
    address: 'erd18553fjcurlgm6wzp66zu4l722y0mwlq735s6sdy8lk32j4dhkq7qmmjthj',
    origin: 'https://app.locki.io',
    signature:
      '343a03e80cb3f1fb279e2937fa6ccee9bd00573c9d8153b5540da0952fd44ba60db250111cc1addbdbc5f8d41b982eb3b142f2673470edf19ed154762fe51905',
  },
]);

describe('nativeAuthRepository', () => {
  it('getNativeAuthFromApiKey', async () => {
    const apiKey = 'test_api_key';
    const dbClient = new DynamoDBRepository('');

    const nativeAuthResponse = await NativeAuthRepository.getNativeAuthFromApiKey(apiKey, dbClient);
    console.log('nativeAuthResponse', JSON.stringify(nativeAuthResponse));
    expect(nativeAuthResponse).toHaveProperty('expiry');
    expect(nativeAuthResponse).toHaveProperty('nativeAuthToken');
  });
});
