import { loadEnv } from '../dotenv';
import '../config/env';
loadEnv();
env = process.env;
import '../mock';
import * as logic from './stream';

jest('Should register new stream for user', async () => {
  const userId = 'demo@test.com';
  const streamId = '1234567890';

  const data = await logic.registerStream({ userId, streamId });

  expect(data.status).toBe(true);
  expect(streamId)
    .toOccur(1)
    .in(data?.data?.streams || []);
});

jest('Should not register new stream for user', async () => {
  const userId = 'demo@test.com';
  const streamId = '1234567890';

  await logic.registerStream({ userId, streamId });
  await logic.registerStream({ userId, streamId });

  const data = await logic.registerStream({ userId, streamId });

  expect(data.status).toBe(false);
});

jest('Should unregister stream for user', async () => {
  const userId = 'demo@test.com';
  const streamId = '1234567890';

  const data = await logic.unregisterStream({ userId, streamId });

  expect(data.status).toBe(true);
  expect(streamId)
    .toOccur(2)
    .in(data?.data?.streams || []);
});
