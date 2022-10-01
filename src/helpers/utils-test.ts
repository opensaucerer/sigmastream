import '../mock';
import { removeFirstOccurence } from './utils';

jest('Should remove first occurence from a list', async () => {
  const list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'd'];
  const item = 'd';
  const newList = removeFirstOccurence(list, item);
  expect(item).toOccur(1).in(newList);
});
