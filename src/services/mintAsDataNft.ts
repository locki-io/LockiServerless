import { APIGatewayProxyEvent } from 'aws-lambda';
import { DataNftRepository } from '../repository';
import { DATA_MARSHALL_URL } from '../constants/multiversxConstants';

export const mintAsDataNft = async (event: APIGatewayProxyEvent) => {
  try {
    const { CHAIN: chain, CREATOR_ADDRESS = '', NFT_STORAGE_TOKEN = '' } = process.env;
    const { dataStreamUrl = '', dataPreviewUrl = '', title = '', description = '' } = JSON.parse(event.body || '{}');
    console.log('chain', chain);
    const mintTransactionResponse = await DataNftRepository.mintCustomDataNft(
      chain || 'devnet',
      CREATOR_ADDRESS,
      'LOCKI1001',
      DATA_MARSHALL_URL[chain || 'devnet'],
      dataStreamUrl,
      dataPreviewUrl,
      10,
      title,
      description,
      NFT_STORAGE_TOKEN,
    );
    console.log('mintTransactionResponse', JSON.stringify(mintTransactionResponse));
    return {
      message: 'Succesfully minted Data Nft',
    };
  } catch (error) {
    console.error('error', error);
  }
};
