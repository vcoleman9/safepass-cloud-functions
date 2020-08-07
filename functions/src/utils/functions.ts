export function pruneUndefined<T>(input: any) {
  return Object.keys(input).reduce((accumulator: { [ k: string ]: T }, key) => {
    if (!!input[ key ]) {
      accumulator[ key ] = input[ key ]
    }
    return accumulator
  }, {})
}
