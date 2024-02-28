import { SQSRepository } from '../awsServiceRepository/sqsRepository';
import { DynamoDBRepository, S3Repository } from '../awsServiceRepository';
import { APIGatewayProxyEvent } from 'aws-lambda';

const dbClient = new DynamoDBRepository(process.env.SCRIPTS_PROCESSING_HISTORY_TABLE || '');
const s3Repository = new S3Repository(process.env.SCRIPTS_PROCESSING_BUCKET || '');
const sqsRepository = new SQSRepository(process.env.SCRIPTS_PROCESSING_QUEUE || '');

export const generatePreviewScripts = async (event: APIGatewayProxyEvent) => {
  const processedId = Math.floor(new Date().valueOf() * Math.random());

  const filename = (event?.queryStringParameters?.filename || 'sample3dMesh').replace('.py', '');
  const s3UploadResponse = await s3Repository.uploadFileOnS3(
    event.body || '',
    'dataStreams',
    `${filename}_${processedId}.py`,
  );
  await sqsRepository.sendMessageToQueue(filename, {
    scriptUrl: s3UploadResponse?.Location,
    filename: `${filename}_${processedId}.py`,
    processedId,
    type: 'blenderPythonScript',
  });

  await dbClient.putCommand({
    id: processedId,
    type: 'blenderPythonScript',
    filename: `${filename}_${processedId}.py`,
    processingStatus: 'Queued',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return {
    message: 'Successfully uploaded the script and queued for processing',
    status: 'Queued',
    processedId,
  };
};
