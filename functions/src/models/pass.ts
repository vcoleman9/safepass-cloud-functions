export interface PassSchema {
  endTime: FirebaseFirestore.Timestamp,
  fromLocation?: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
  fromLocationName?: string,
  issuingUser: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
  issuingUserName: string,
  locationCategory?: string,
  passRecipientName: string,
  passSchemaVersion?: number,
  startTime: FirebaseFirestore.Timestamp
  toLocation: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
  toLocationName: string
}