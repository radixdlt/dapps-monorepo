export type ValidateQueries<T extends QueryRecord> = {
  [K in keyof T]: T[K] & {
    fn: (params?: Parameters<T[K]['fn']>[0]) => Promise<any>
    decoder: (arg: Awaited<ReturnType<T[K]['fn']>>) => any
    transformationFn: (args: Awaited<ReturnType<T[K]['decoder']>>) => any
  }
}

export type QueryRecord = Record<
  string,
  {
    fn: (...args: any[]) => Promise<any>
    decoder: (...args: any[]) => any
    transformationFn: (...args: any[]) => any
  }
>
