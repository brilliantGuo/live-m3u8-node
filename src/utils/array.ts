export interface FlattenOptions<T = any> {
  filter?: (item: T, index: number) => boolean
}

export function flatten<T = any>(arr: (T | T[])[], opts?: FlattenOptions<T>): T[] {
  const filter = opts?.filter || (() => true)
  return arr.reduce<T[]>((res, arrItem) => {
    const filteredArr = Array.isArray(arrItem) ? arrItem.filter(filter) : [arrItem]
    return res.concat(filteredArr)
  }, [])
}
