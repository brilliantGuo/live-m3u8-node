

export function flatten<T = any>(arr: (T | T[])[]): T[] {
  return arr.reduce<T[]>((res, arrItem) => res.concat(arrItem), [])
}
