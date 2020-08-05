"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = __importStar(require("firebase-functions"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
// Path to the local file containing the key for admin access. Can be replaced with many other sleeker options
const serviceAccount = require('../../../../../.firebasekeys/service-account-file.json');
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
    databaseURL: "https://safepass-76e29.firebaseio.com"
});
const adminAuth = firebase_admin_1.default.auth();
const typeDefs = apollo_server_express_1.gql `
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
`;
const Users = firebase_admin_1.default.firestore().collection('users');
const Districts = firebase_admin_1.default.firestore().collection('districts');
const resolvers = {
    Query: {
        userIdFromEmail: (_root, args) => adminAuth
            .getUserByEmail(args.email)
            .then(u => u.uid),
        users: () => (Users.get().then(snap => {
            const userDocs = [];
            snap.forEach((doc) => {
                const data = doc.data();
                userDocs.push({
                    documentPath: doc.ref.path,
                    id: doc.id,
                    district: data.district.path,
                    role: data.role,
                    school: data.school ? data.school.path : null
                });
            });
            return userDocs;
        })),
        districts: () => (Districts.get().then(snap => {
            const districtDocs = [];
            snap.forEach((doc) => {
                const data = doc.data();
                districtDocs.push({
                    documentPath: doc.ref.path,
                    id: doc.id,
                    name: data.name,
                });
            });
            return districtDocs;
        }))
    },
    Mutation: {
        createUser: () => console.log('create user')
    }
};
const app = express_1.default();
const server = new apollo_server_express_1.ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app, path: '/', cors: true });
exports.default = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map