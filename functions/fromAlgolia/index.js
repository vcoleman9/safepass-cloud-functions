const functions = require("firebase-functions");
const algoliasearch = require("algoliasearch");

// [START init_algolia]
// Initialize Algolia, requires installing Algolia dependencies:
// https://www.algolia.com/doc/api-client/javascript/getting-started/#install
//
// App ID and API Key are stored in functions config variables
const ALGOLIA_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_key;

const ALGOLIA_INDEX_NAME = "students";
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
// [END init_algolia]

// [START update_index_function]
// Update the search index every time a blog post is written.
exports.onStudentCreated = functions.firestore
  .document("districts/{districtId}/schools/{schoolId}/students/{studentId}")
  .onUpdate((snap, context) => {
    // Get the note document
    const student = snap.data();
    const districtId = context.params.districtId;
    const schoolId = context.params.schoolId;

    // Add an 'objectID' field which Algolia requires
    student.objectID = context.params.studentId;
    student.firestoreDistrictId = districtId;
    student.firestoreSchoolId = schoolId;

    // Write to the algolia index
    const index = client.initIndex(districtId + "_" + ALGOLIA_INDEX_NAME);
    return index.saveObject(student);
  });
// [END update_index_function]
