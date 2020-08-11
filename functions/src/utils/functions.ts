import admin from '../firestoreAuthentication'

export function pruneUndefined(input: { [ field: string ]: any }): FirebaseFirestore.DocumentData {
  return Object.keys(input).reduce((accumulator: { [ f: string ]: any }, key) => {
    if (input[ key ] !== undefined) {
      accumulator[ key ] = input[ key ]
    }
    return accumulator
  }, {})
}

export function userIsOneOfRoles(
  userSnap: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>,
  ...roles: string[]
): boolean {
  const userDoc = userSnap.data()
  return userDoc !== undefined && roles.includes(userDoc.role)
}

export async function tokenMatchesOneOfRoles(tokenId: string | null, ...roles: string[]): Promise<boolean> {
  if (!tokenId) {
    throw { error: 'token missing or invalid' }
  }

  const decoded = await admin.auth.verifyIdToken(tokenId)
  const userSnap = await admin.db.doc(`users/${decoded.uid}`).get()
  const userDoc = userSnap.data()
  return userDoc !== undefined && roles.includes(userDoc.role)
}
