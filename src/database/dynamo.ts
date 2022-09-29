import aws from 'aws-sdk';
console.log(env.ACCESS_KEY, env.SECRET_KEY);
const dynamo = new aws.DynamoDB.DocumentClient({
  region: 'us-east-1',
  accessKeyId: 'AKIA5TVLF7BLNNZE6UEW',
  secretAccessKey: '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',
});

export default dynamo;
