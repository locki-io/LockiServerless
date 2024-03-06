import { SQSRepository } from '../awsServiceRepository/sqsRepository';
import { DynamoDBRepository, S3Repository } from '../awsServiceRepository';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { FILE_INPUT_TYPES, INPUT_OPTIONS } from '../constants/scriptProcessingConstants';

const dbClient = new DynamoDBRepository(process.env.SCRIPTS_PROCESSING_HISTORY_TABLE || '');
const s3Repository = new S3Repository(process.env.SCRIPTS_PROCESSING_BUCKET || '');
const sqsRepository = new SQSRepository(process.env.SCRIPTS_PROCESSING_QUEUE || '');

export const generateBlenderPythonScriptPreviewService = async (event: APIGatewayProxyEvent) => {
  const processedId =
    Number(event?.queryStringParameters?.processedId) || Math.floor(new Date().valueOf() * Math.random());

  const filename = (event?.queryStringParameters?.filename || 'sample3dMesh').replace('.py', '');
  const inputOption = event?.queryStringParameters?.inputOption || '';
  const exportOption = event?.queryStringParameters?.exportOption || '';
  const filenameExtension = INPUT_OPTIONS.blendFile === inputOption ? 'blend' : 'py';
  let s3UploadResponse;
  if (!FILE_INPUT_TYPES.includes(inputOption)) {
    s3UploadResponse = await s3Repository.uploadFileOnS3(
      event.body || '',
      `processData/${processedId}`,
      `${filename}.${filenameExtension}`,
    );
  }

  await sqsRepository.sendMessageToQueue(filename, {
    scriptUrl: s3UploadResponse ? s3UploadResponse?.Location : event.body,
    filename: `${filename}.${filenameExtension}`,
    processedId,
    type: inputOption,
    exportOption,
  });

  await dbClient.putCommand({
    id: processedId,
    type: inputOption,
    filename: `${filename}.${filenameExtension}`,
    exportOption,
    processingStatus: 'Queued',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return {
    message: 'Successfully uploaded the script and queued for processing',
    status: 'Queued',
    processedId,
    scriptUrl: s3UploadResponse ? s3UploadResponse?.Location : event.body,
  };
};
