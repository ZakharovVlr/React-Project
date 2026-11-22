export function formatAuthorName(name: string): string {
  const [last, first] = name.split(', ');
  return first ? `${first} ${last}` : last;
}
