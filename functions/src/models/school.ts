export interface SchoolSchema {
  name: string,
  passes?: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  rooms?: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  students?: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>
}