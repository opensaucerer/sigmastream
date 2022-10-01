import { loadEnv } from './dotenv';
import * as fs from 'fs';
import './mock';

jest('Should load env into process', async () => {
  // create a .env file and write some data
  fs.writeFileSync(
    '.env.test',
    'PORT=3000\nDUMMY_KEY=1234567890\nDUMMY_KEY_2=0987654321'
  );

  // load the .env file
  loadEnv('.env.test');

  // check if the process.env object has the correct data
  expect(process.env.PORT).toBe('3000');
  expect(process.env.DUMMY_KEY).toBe('1234567890');
  expect(process.env.DUMMY_KEY_2).toBe('0987654321');
});

afterJest(() => {
  // delete the .env file
  fs.unlinkSync('.env.test');
});
