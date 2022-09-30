import { AWSError } from 'aws-sdk';
import dynamo from '../database/dynamo';
import * as util from '../helpers/utils';

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
      // append to the list and increment version
      UpdateExpression:
        'SET #streams = list_append(#streams, :streamId), #version = #version + :version',
      ConditionExpression: 'size(#streams) < :size',
      ExpressionAttributeNames: {
        '#streams': 'streams',
        '#version': 'version',
      },
      ExpressionAttributeValues: {
        ':streamId': [streamId],
        ':size': 3,
        ':version': 1,
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
  | { userId?: string; streams?: string[]; version?: number; error?: AWSError }
  | undefined
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
      version: number;
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
        version: 1,
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

// remove a streamId from a user stream list only if stream list equals initial stream list
export async function unregisterStreamWithCondition(data: {
  streamId: string;
  userId: string;
  streams: string[];
  version: number;
}): Promise<
  { userId?: string; streams?: string[]; error?: AWSError } | undefined
> {
  let { userId, streamId, streams, version } = data;
  try {
    const params = {
      TableName: 'stream',
      Key: {
        userId,
      },
      // set new stream list and increment version
      UpdateExpression:
        'SET #streams = :streams, #version = #version + :newVersion',
      // only update if version is the same
      ConditionExpression: '#version = :version',
      ExpressionAttributeNames: {
        '#streams': 'streams',
        '#version': 'version',
      },
      ExpressionAttributeValues: {
        ':streams': util.removeFirstOccurence(streams, streamId),
        ':version': version,
        ':newVersion': 1,
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

// remove a streamId from a user stream list
export async function unregisterStream(data: {
  streamId: string;
  userId: string;
}): Promise<
  { userId?: string; streams?: string[]; error?: AWSError } | undefined
> {
  let { userId, streamId } = data;
  let streams = await getStreams(userId);
  if (streams && !streams.error) {
    return await unregisterStreamWithCondition({
      streamId,
      userId,
      streams: streams.streams || [],
      version: streams.version || 0,
    });
  } else {
    return { error: streams?.error };
  }
}
