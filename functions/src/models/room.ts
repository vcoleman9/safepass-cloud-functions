export interface RoomSchema {
  name: string,
  displayName?: string,
  category?: string,
  maxPersonCount?: number,
  personCount?: number,
  passes?: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
}
