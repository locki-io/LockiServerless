import { mintCustomDataNft } from '../../../repository/dataNftRepository';

describe('dataNftRepository', function () {
  it('mintCustomDataNft', async () => {
    const response = await mintCustomDataNft(
      'devnet',
      'erd1e00rlyn8avxpz5enfx0n6zf2u5negyw8zg4npwcqemd08cwzwevqml3vuu',
      'My First 3D Model',
      'https://api.itheumcloud-stg.com/datamarshalapi/achilles/v1',
      
    );
    expect(response).toEqual({
      message: 'Succesfully minted Data Nft',
    });
  });
});
