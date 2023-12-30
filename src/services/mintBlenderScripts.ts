import { S3Repository } from './../awsServiceRepository';
import { APIGatewayProxyEvent } from 'aws-lambda';
const s3Repository = new S3Repository('blender-scripts');

export const mintBlenderScripts = async (event: APIGatewayProxyEvent) => {
  const s3UploadResponse = await s3Repository.uploadFileOnS3(event.body || '', 'sampleScript3.py');
  return {
    message: 'Successfully uploaded script to s3',
    scriptUrl: s3UploadResponse?.Location,
  };
};
