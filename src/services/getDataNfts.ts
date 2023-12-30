import { APIGatewayProxyEvent } from 'aws-lambda';
import { DataNftRepository } from '../repository';
import { NftType } from '@multiversx/sdk-dapp/types/tokens.types';
import { DataNftMetadataType } from '../types/dataNftTypes';


export const getDataNftsService = async (event: APIGatewayProxyEvent) => {
  const { address } = event?.queryStringParameters || {};

  const dataNfts: NftType[] = await DataNftRepository.getNftsForAnAccount(address || '');

  const filteredNfts: NftType[] = dataNfts.filter((nft) => nft.collection === process.env.NFT_COLLECTION);

  const decodedNfts: DataNftMetadataType[] = filteredNfts.map((nft) => {
    const decodedNft = DataNftRepository.decodeNftAttributes(nft);
    return decodedNft;
  });
  return decodedNfts;
};
