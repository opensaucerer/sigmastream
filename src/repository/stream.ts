import { AWSError } from 'aws-sdk';
import dynamo from '../database/dynamo';

// add a streamId to a user stream list if length is less than 3
export async function registerStreamWithCondition(data: {
  streamId: string;
  userId: string;
}): Promise<
  { userId?: string; streams?: string[]; error?: AWSError } | undefined
> {
  let { userId, streamId } = data;
  try {
    const params = {
      TableName: 'stream',
      Key: {
        userId,
      },
      UpdateExpression: 'SET streams = list_append(streams, :streamId)',
      ConditionExpression: 'size(streams) < :maxSize',
      ExpressionAttributeValues: {
        ':streamId': [streamId],
        ':maxSize': 3,
      },
      ReturnValues: 'ALL_NEW',
    };
    return (await dynamo.update(params).promise()).Attributes as {
      userId: string;
      streams: string[];
    };
  } catch (error: any) {
    return { error };
  }
}

// get user stream list
export async function getStreams(
  userId: string
): Promise<
  { userId?: string; streams?: string[]; error?: AWSError } | undefined
> {
  try {
    const params = {
      TableName: 'stream',
      Key: {
        userId,
      },
    };
    return (await dynamo.get(params).promise()).Item as {
      userId: string;
      streams: string[];
    };
  } catch (error: any) {
    return { error };
  }
}

// create a new user stream list
export async function registerNewUserStream(data: {
  streamId: string;
  userId: string;
}): Promise<
  { userId?: string; streams?: string[]; error?: AWSError } | undefined
> {
  let { userId, streamId } = data;
  try {
    const params = {
      TableName: 'stream',
      Item: {
        userId,
        streams: [streamId],
      },
      ReturnValues: 'ALL_OLD',
    };
    return (
      ((await dynamo.put(params).promise()).Attributes as {
        userId: string;
        streams: string[];
      }) || { userId, streams: [streamId] }
    );
  } catch (error: any) {
    return { error };
  }
}

export async function registerStream(data: {
  streamId: string;
  userId: string;
}): Promise<
  { userId?: string; streams?: string[]; error?: AWSError } | undefined
> {
  let { userId, streamId } = data;
  let streams = await getStreams(userId);
  if (streams && !streams.error) {
    return await registerStreamWithCondition({ streamId, userId });
  } else {
    return await registerNewUserStream({ streamId, userId });
  }
}

// unregister a streamId from a user stream list
export async function unregisterStream(data: {
  streamId: string;
  userId: string;
}): Promise<
  { userId?: string; streams?: string[]; error?: AWSError } | undefined
> {
  let { userId, streamId } = data;
  try {
    const params = {
      TableName: 'stream',
      Key: {
        userId,
      },
      UpdateExpression: 'SET streams = list_remove(streams, :streamId)',
      ExpressionAttributeValues: {
        ':streamId': streamId,
      },
      ReturnValues: 'ALL_NEW',
    };
    return (await dynamo.update(params).promise()).Attributes as {
      userId: string;
      streams: string[];
    };
  } catch (error: any) {
    return { error };
  }
}
