import { APIGatewayProxyEvent } from 'aws-lambda';
import { S3Repository } from '../awsServiceRepository';

const s3Repository = new S3Repository(process.env.SCRIPTS_PROCESSING_BUCKET || '');

export const getScriptUploadLinkService = async (event: APIGatewayProxyEvent) => {
  const processedId = Math.floor(new Date().valueOf() * Math.random());
  const filename = event?.queryStringParameters?.filename || 'sample3dMesh';

  const preSignedUrl = await s3Repository.getPreSignedUrl(`processData/${processedId}/${filename}`);

  return {
    processedId,
    preSignedUrl,
  };
};
