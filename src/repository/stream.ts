import dynamo from '../database/dynamo';

export const getStream = async (id: string) => {
  const params = {
    TableName: 'stream',
    Key: {
      id,
    },
  };
  const result = await dynamo.get(params).promise();
  return result.Item;
};
