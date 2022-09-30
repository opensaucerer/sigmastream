import * as streamRepo from '../repository/stream';

export async function registerStream(data: {
  userId: string;
  streamId: string;
}) {
  let status = await streamRepo.registerStream(data);
  if (status && status.error) {
    return {
      status: false,
      message: 'Failed to register stream',
      error:
        status.error.code === 'ConditionalCheckFailedException'
          ? 'Concurrent stream limit reached'
          : status.error.message,
    };
  }
  return {
    status: true,
    message: 'Stream registered successfully',
    data: status,
  };
}

export async function unregisterStream(data: {
  userId: string;
  streamId: string;
}) {
  let status = await streamRepo.unregisterStream(data);
  if (status && status.error) {
    return {
      status: false,
      message: 'Failed to unregister stream',
      error: status.error.message,
    };
  }
  return {
    status: true,
    message: 'Stream unregistered successfully',
    data: status,
  };
}
