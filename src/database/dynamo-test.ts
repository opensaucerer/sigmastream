import { loadEnv } from '../dotenv';
import '../config/env';
loadEnv();
env = process.env;
import '../mock';
import * as dynamo from './dynamo';

jest('Should not create new stream table', async () => {
  const data = await dynamo.createStreamTable();
  expect(data).toBe(1);
});
