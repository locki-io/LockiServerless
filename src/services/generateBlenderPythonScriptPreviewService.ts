import { SQSRepository } from '../awsServiceRepository/sqsRepository';
import { DynamoDBRepository, S3Repository } from '../awsServiceRepository';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { INPUT_OPTIONS } from '../constants/scriptProcessingConstants';

const dbClient = new DynamoDBRepository(process.env.SCRIPTS_PROCESSING_HISTORY_TABLE || '');
const s3Repository = new S3Repository(process.env.SCRIPTS_PROCESSING_BUCKET || '');
const sqsRepository = new SQSRepository(process.env.SCRIPTS_PROCESSING_QUEUE || '');

export const generateBlenderPythonScriptPreviewService = async (event: APIGatewayProxyEvent) => {
  const processedId = Math.floor(new Date().valueOf() * Math.random());

  const filename = (event?.queryStringParameters?.filename || 'sample3dMesh').replace('.py', '');
  const exportOption = event?.queryStringParameters?.exportOption || '';
  const s3UploadResponse = await s3Repository.uploadFileOnS3(
    event.body || '',
    `processData/${processedId}`,
    `${filename}_${processedId}.py`,
  );
  await sqsRepository.sendMessageToQueue(filename, {
    scriptUrl: s3UploadResponse?.Location,
    filename: `${filename}_${processedId}.py`,
    processedId,
    type: INPUT_OPTIONS.blenderPyInput,
    exportOption,
  });

  await dbClient.putCommand({
    id: processedId,
    type: INPUT_OPTIONS.blenderPyInput,
    filename: `${filename}_${processedId}.py`,
    exportOption,
    processingStatus: 'Queued',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return {
    message: 'Successfully uploaded the script and queued for processing',
    status: 'Queued',
    processedId,
    scriptUrl: s3UploadResponse?.Location,
  };
};
