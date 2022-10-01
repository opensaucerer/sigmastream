import aws from 'aws-sdk';
import '../config/env';
import logger from '../logger';

const dynamo = new aws.DynamoDB.DocumentClient({
  region: env.AWS_REGION,
  accessKeyId: env.ACCESS_KEY,
  secretAccessKey: env.SECRET_KEY,
});

export async function createStreamTable() {
  const db = new aws.DynamoDB({
    region: env.AWS_REGION,
    accessKeyId: env.ACCESS_KEY,
    secretAccessKey: env.SECRET_KEY,
  });

  const params = {
    TableName: 'stream',
    KeySchema: [
      {
        AttributeName: 'userId',
        KeyType: 'HASH',
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'userId',
        AttributeType: 'S',
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  };

  try {
    let data = await db.createTable(params).promise();
    logger.logWithColor(
      `Table '${data.TableDescription?.TableName}' created successfully`,
      'info'
    );
    return 0;
  } catch (error: any) {
    logger.logWithColor('Skipping table creation: ' + error.message, 'warn');
    return 1;
  }
}

export async function deleteStreamTable() {
  const db = new aws.DynamoDB({
    region: env.AWS_REGION,
    accessKeyId: env.ACCESS_KEY,
    secretAccessKey: env.SECRET_KEY,
  });

  const params = {
    TableName: 'stream',
  };

  try {
    let data = await db.deleteTable(params).promise();
    logger.logWithColor(
      `Table '${data.TableDescription?.TableName}' deleted successfully`,
      'info'
    );
    return 0;
  } catch (error: any) {
    logger.logWithColor('Skipping table deletion: ' + error.message, 'warn');
    return 1;
  }
}

export default dynamo;
