export interface StudentSchema {
  passes?: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  displayName: string,
  grade?: string,
  profilePictureUri?: string,
  school: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
  schoolIssuedId?: string,
  searchName?: string
}