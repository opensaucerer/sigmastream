// remove first occurence from a list
export function removeFirstOccurence(list: string[], item: string) {
  let index = list.indexOf(item);
  if (index > -1) {
    list.splice(index, 1);
  }
  return list;
}
