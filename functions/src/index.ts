import * as functions from 'firebase-functions'
import admin from 'firebase-admin'
import express from 'express'
import { ApolloServer, gql, IResolvers } from 'apollo-server-express'

// Path to the local file containing the key for admin access. Can be replaced with many other sleeker options
const serviceAccount = require('../../../../../.firebasekeys/service-account-file.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://safepass-76e29.firebaseio.com"
})

const adminAuth = admin.auth()

const typeDefs = gql`
  type District {
    documentPath: String!
    name: String!
    schools: [School]!
  }

  type School {
    documentPath: String!
    name: String!
    passes: [Pass!]!
    rooms: [Room!]!
    students: [Student!]!
  }

  type Student {
    documentPath: String!
    passes: [Pass!]!
    displayName: String!
    grade: String!
    profilePictureUri: String
    school: String!
    schoolIssuedId: String!
    searchName: String!
  }

  enum LocationCategory {
    Bathroom
    Classroom
    Other
  }

  type Room {
    documentPath: String!
    passes: [Pass!]!
    category: LocationCategory!
    displayName: String!
    maxPersonCount: Int
    personCount: Int!
  }

  type Pass {
    endTime: String!
    fromLocation: String!
    fromLocationName: String!
    issuingUser: String!
    issuingUserName: String!
    locationCategory: LocationCategory!
    passRecipientName: String!
    passSchemaVersion: Int!
    startTime: String!
    toLocation: String!
    toLocationName: String!
  }

  enum UserRole {
    admin
    teacher
    district_admin
    owner
  }

  type User {
    documentPath: String
    id: ID!
    district: String
    school: String
    role: UserRole
  }

  type Query {
    userIdFromEmail(
      email: String!
    ): ID!
    users: [User]!
    districts: [District]!
  }

  type Mutation {
    createUser(
      email: String!
      password: String!
      role: UserRole!
      district: String!
      school: String
    ): User
  }
`

const Users = admin.firestore().collection('users')
const Districts = admin.firestore().collection('districts')

const resolvers: IResolvers = {
  Query: {
    userIdFromEmail: (_root, args) =>
      adminAuth
        .getUserByEmail(args.email)
        .then(u => u.uid),
    users: () => (
      Users.get().then(snap => {
        const userDocs: FirebaseFirestore.DocumentData[] = []
        snap.forEach((doc) => {
          const data = doc.data()

          userDocs.push({
            documentPath: doc.ref.path,
            id: doc.id,
            district: data.district.path,
            role: data.role,
            school: data.school ? data.school.path : null
          })
        })
        return userDocs
      })
    ),
    districts: () => (
      Districts.get().then(snap => {
        const districtDocs: FirebaseFirestore.DocumentData[] = []
        snap.forEach((doc) => {
          const data = doc.data()

          districtDocs.push({
            documentPath: doc.ref.path,
            id: doc.id,
            name: data.name,
          })
        })
        return districtDocs
      })
    )
  },
  Mutation: {
    createUser: () => console.log('create user')
  }
}

const app = express()
const server = new ApolloServer({ typeDefs, resolvers })
server.applyMiddleware({ app, path: '/', cors: true })

export default functions.https.onRequest(app)