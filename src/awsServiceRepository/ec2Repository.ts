import AWS from 'aws-sdk';

export class Ec2Repository {
  private readonly ec2;
  private readonly imageId: string;
  private readonly instanceType: string = 't2.micro';
  private readonly keyName: string;

  constructor(imageId: string, keyName: string, region: string, instanceType?: string) {
    this.imageId = imageId;
    this.keyName = keyName;
    if (instanceType) {
      this.instanceType = instanceType;
    }

    this.ec2 = new AWS.EC2({ apiVersion: '2016-11-15', region });
  }

  async createInstanceWithUserData(params: Partial<AWS.EC2.RunInstancesRequest>) {
    const userDataEncoded = Buffer.from(params?.UserData || '').toString('base64');
    const instanceParams: AWS.EC2.RunInstancesRequest = {
      ImageId: this.imageId,
      InstanceType: this.instanceType,
      KeyName: this.keyName,
      MinCount: params?.MinCount || 1,
      MaxCount: params?.MaxCount || 1,
      UserData: userDataEncoded,
      SecurityGroupIds: params?.SecurityGroupIds || [],
    };

    const runInstanceResponse = await this.ec2.runInstances(instanceParams).promise();

    return runInstanceResponse;
  }
}
