export const keyBy = <A extends object, K extends PropertyKey>(
  array: A[],
  keyFn: (x: A) => K
) => {
  return array.reduce(
    (r, x) => ({ ...r, [keyFn(x)]: x }),
    {} as { [P in K]: A }
  )
}
