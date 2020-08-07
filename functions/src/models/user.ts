export interface UserSchema {
  role: string,
  displayName?: string,
  district?: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
  school: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
}