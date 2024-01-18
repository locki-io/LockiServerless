import { Ec2Repository } from '../awsServiceRepository/ec2Repository';

const ec2Repository = new Ec2Repository('ami-07de5b1c3060a8f4d', 'blender-processor', 'eu-west-3');

export async function blenderScriptsProcessor() {
  const userData = 'blender --version';
  const newInstanceResponse = await ec2Repository.createInstanceWithUserData({ UserData: userData });
  console.log('newInstanceResponse', JSON.stringify(newInstanceResponse));
}
