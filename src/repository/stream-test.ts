import { loadEnv } from '../dotenv';
import '../config/env';
loadEnv();
env = process.env;
import '../mock';
import * as streamRepo from './stream';

jest('Should add a new stream to the user stream list', async () => {
  const userId = '1234567890';
  const streamId = '1234567890';

  const data = await streamRepo.registerStream({ userId, streamId });

  console.log(data);
  expect(streamId)
    .toOccur(1)
    .in(data?.streams || []);
});
