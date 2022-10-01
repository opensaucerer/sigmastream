import { loadEnv } from '../dotenv';
loadEnv();
import '../mock';
import * as dynamo from './dynamo';

jest('Should not create new stream table', async () => {
  const data = await dynamo.createStreamTable();
  expect(data).toBe(1);
});

jest('Should create new stream table', async () => {
  await dynamo.deleteStreamTable();
  const data = await dynamo.createStreamTable();
  expect(data).toBe(0);
});
