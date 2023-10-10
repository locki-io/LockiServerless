import { APIGatewayProxyEvent } from 'aws-lambda';
import { DataNftRepository, NativeAuthRepository } from '../repository';
import { NftType } from '@multiversx/sdk-dapp/types/tokens.types';
import { DataNftMetadataType } from '../types/dataNftTypes';
import { DynamoDBRepository } from '../awsServiceRepository';

const dbClient = new DynamoDBRepository(process.env.LOCKI_USERS_TABLE || '');

export const getDataNftsService = async (event: APIGatewayProxyEvent) => {
  const { address, apiKey } = event?.queryStringParameters || {};
  await NativeAuthRepository.getNativeAuthFromApiKey(apiKey || '', dbClient);

  const dataNfts: NftType[] = await DataNftRepository.getNftsForAnAccount(address || '');

  const filteredNfts: NftType[] = dataNfts.filter((nft) => nft.collection === process.env.NFT_COLLECTION);

  const decodedNfts: DataNftMetadataType[] = filteredNfts.map((nft) => {
    const decodedNft = DataNftRepository.decodeNftAttributes(nft);
    return decodedNft;
  });
  return decodedNfts;
};
