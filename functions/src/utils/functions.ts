export function pruneUndefined(input: { [ field: string ]: any }): FirebaseFirestore.DocumentData {
  return Object.keys(input).reduce((accumulator: { [ f: string ]: any }, key) => {
    if (input[ key ] !== undefined) {
      accumulator[ key ] = input[ key ]
    }
    return accumulator
  }, {})
}
