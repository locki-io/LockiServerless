import { SQSRepository } from './../awsServiceRepository/sqsRepository';
import { S3Repository } from './../awsServiceRepository';
import { APIGatewayProxyEvent } from 'aws-lambda';
const s3Repository = new S3Repository('blender-scripts');
const sqsRepository = new SQSRepository(process.env.BLENDER_SCRIPTS_QUEUE || '');

export const mintBlenderScripts = async (event: APIGatewayProxyEvent) => {
  const filename = event?.queryStringParameters?.filename || 'sample3dMesh';
  const s3UploadResponse = await s3Repository.uploadFileOnS3(event.body || '', filename);
  // const s3UploadResponse = { Location: 'sample url' };
  await sqsRepository.sendMessageToQueue(filename, { scriptUrl: s3UploadResponse?.Location });
  return {
    message: 'Successfully uploaded script to s3',
  };
};
