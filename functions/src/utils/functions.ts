export function pruneUndefined(input: any): FirebaseFirestore.DocumentData {
  return Object.keys(input).reduce((accumulator: { [ k: string ]: any }, key) => {
    if (input[ key ] !== undefined) {
      accumulator[ key ] = input[ key ]
    }
    return accumulator
  }, {})
}
