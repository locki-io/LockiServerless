import axios from 'axios';
import { NftType } from '@multiversx/sdk-dapp/types/tokens.types';
import jsonData from '../ABIs/datanftmint.abi.json';
import { AbiRegistry, BinaryCodec, Address, Transaction } from '@multiversx/sdk-core/out';
import { DataNftMetadataType } from '../types/dataNftTypes';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils/account';
import { SftMinter } from '@itheum/sdk-mx-data-nft';

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

export async function mintCustomDataNft(
  chain: string,
  address: string,
  tokenName: string,
  dataMarshalEndpoint: string,
  dataStreamUrl: string,
  dataPreviewUrl: string,
  royalityPercentage: number,
  title: string,
  description: string,
  nftStorageToken: string,
) {
  const dataNftMinter = new SftMinter(chain);

  try {
    const requirements = await dataNftMinter.viewMinterRequirements(new Address(address));
    const antiSpamTax = requirements?.antiSpamTaxValue;

    const mintTransaction: Transaction = await dataNftMinter.mint(
      new Address(address),
      tokenName,
      dataMarshalEndpoint,
      dataStreamUrl,
      dataPreviewUrl,
      royalityPercentage * 100,
      1,
      title,
      description,
      antiSpamTax,
      { nftStorageToken },
    );

    await refreshAccount();
    console.log('mintTransaction', JSON.stringify(mintTransaction));

    const { sessionId, error } = await sendTransactions({
      transactions: mintTransaction,
      transactionsDisplayInfo: {
        processingMessage: 'Minting Standard Data NFT',
        errorMessage: 'Data NFT minting error',
        successMessage: 'Data NFT minted successfully',
      },
      redirectAfterSign: false,
    });
    console.log('sessionId', sessionId);
    console.log('error', error);

    return {
      id: sessionId,
      status: error ? 'error' : 'success',
      msg: error ? error.message : 'Successfully minted Data NFT',
    };
  } catch (error: any) {
    console.error('error', error);
    return { id: null, status: 'error', msg: error.message };
  }
}
