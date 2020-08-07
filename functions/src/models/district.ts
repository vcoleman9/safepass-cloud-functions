export interface DistrictSchema {
  name: string,
  schools?: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>
}