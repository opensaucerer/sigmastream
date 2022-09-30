import aws from 'aws-sdk';
import '../config/env';
import logger from '../logger';

const dynamo = new aws.DynamoDB.DocumentClient({
  region: env.AWS_REGION,
  accessKeyId: env.ACCESS_KEY,
  secretAccessKey: env.SECRET_KEY,
});

export function createStreamTable() {
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

  db.createTable(params, (err, data) => {
    if (err) {
      logger.logWithColor('Skipping table creation: ' + err.message, 'warn');
    } else {
      logger.logWithColor(
        `Table '${data.TableDescription?.TableName}' created successfully`,
        'info'
      );
    }
  });
}

export default dynamo;
