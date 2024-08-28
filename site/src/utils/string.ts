export function getFirstNStrings(arr: string[], n: number) {
  if (n >= arr.length) {
    return arr.join(", ");
  }

  const selectedStrings = arr.slice(0, n);
  const remainingCount = arr.length - n;

  return `${selectedStrings.join(", ")} and ${remainingCount} more...`;
}
