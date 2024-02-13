import { APIGatewayProxyEvent } from 'aws-lambda';

export const mintAsDataNft = async (event: APIGatewayProxyEvent) => {
  return {
    message: 'Succesfully minted Data Nft',
  };
};
