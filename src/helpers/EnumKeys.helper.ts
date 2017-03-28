export function $enumKeys(enumerable) {
  return Object.keys(enumerable).filter(enumMember => {
    return isNaN(parseInt(enumMember, 10));
  });
}
