import AWS from 'aws-sdk';

export class SQSRepository {
  private readonly sqs;
  private readonly queueUrl: string;

  constructor(queueUrl: string) {
    this.queueUrl = queueUrl;

    this.sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
  }

  async sendMessageToQueue(title: string, message: any) {
    const params = {
      MessageAttributes: {
        Title: {
          DataType: 'String',
          StringValue: title,
        },
      },
      MessageBody: JSON.stringify(message),
      QueueUrl: this.queueUrl,
    };

    await this.sqs.sendMessage(params).promise();
  }
}
