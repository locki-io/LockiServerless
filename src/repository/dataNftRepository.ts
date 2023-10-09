import axios from 'axios';
import { NftType } from '@multiversx/sdk-dapp/types/tokens.types';
import jsonData from '../ABIs/datanftmint.abi.json';
import { AbiRegistry, BinaryCodec } from '@multiversx/sdk-core/out';
import { DataNftMetadataType } from '../types/dataNftTypes';

const json = JSON.parse(JSON.stringify(jsonData));
const abiRegistry: AbiRegistry = AbiRegistry.create(json);

export async function getNftsForAnAccount(address: string) {
  const datanfts = await axios.get(`${process.env.MUTLIVERSEX_API_URL}/accounts/${address}/nfts`);

  return datanfts.data;
}

export function decodeNftAttributes(nft: NftType) {
  const dataNftAttributes = abiRegistry.getStruct('DataNftAttributes');
  const decodedAttributes = new BinaryCodec()
    .decodeTopLevel(Buffer.from(nft.attributes, 'base64'), dataNftAttributes)
    .valueOf();

  const dataNFT: DataNftMetadataType = {
    id: nft.identifier, // ID of NFT -> done
    nftImgUrl: nft.url, // image URL of of NFT -> done
    dataPreview: decodedAttributes['data_preview_url'].toString(), // preview URL for NFT data stream -> done
    dataStream: decodedAttributes['data_stream_url'].toString(), // data stream URL -> done
    dataMarshal: decodedAttributes['data_marshal_url'].toString(), // data stream URL -> done
    tokenName: nft.name, // is this different to NFT ID? -> yes, name can be chosen by the user
    creator: decodedAttributes['creator'].toString(), // initial creator of NFT
    creationTime: new Date(Number(decodedAttributes['creation_time']) * 1000), // initial creation time of NFT
    supply: nft.supply ? Number(nft.supply) : 0,
    description: decodedAttributes['description'].toString(),
    title: decodedAttributes['title'].toString(),
    royalties: nft.royalties ? nft.royalties / 100 : 0,
    nonce: nft.nonce,
    collection: nft.collection,
    balance: 0,
  };

  return dataNFT;
}
