import aws from 'aws-sdk';
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

export class S3Repository {
  private readonly bucketName: string;
  private readonly s3;

  constructor(bucketName: string) {
    this.bucketName = bucketName;

    this.s3 = new aws.S3({ apiVersion: '2006-03-01', region: 'eu-west-3' });
  }

  async uploadFileOnS3(fileData: string, key: string, fileName: string) {
    const params = {
      Bucket: this.bucketName,
      Key: `${key}/${fileName}`,
      Body: fileData,
    };

    try {
      const response = await s3.upload(params).promise();
      return response;
    } catch (err) {
      console.log(err);
    }
  }
}
