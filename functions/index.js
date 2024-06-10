//
const { getDatabase } = require('firebase-admin/database');
const { initializeApp } = require("firebase-admin/app");
const functionsV1 = require('firebase-functions');


//init app, database
const app = initializeApp();
const database = getDatabase(app);



exports.userAdded = functionsV1.auth.user().onCreate((user) => {

    // CREATE an user data (empty template) in database while registration request 
    const updates = {};
    const chat_id = 'defaultExampleDataId';

    updates[process.env.DB_CHAT_PATH + user.uid + '/' + chat_id] = [
        {
            assistant: { content: 'example_assistant_string..', format: 'example_format_string' },
            user: { content: 'example_user_string..' }
        }
    ];
    updates[process.env.DB_USER_PATH + user.uid + '/chats'] = {};
    updates[process.env.DB_USER_PATH + user.uid + '/profile'] = { isEmailVerified: user.emailVerified, email: user.email }

    return database.ref(process.env.DB_NAME).update(updates)
        .then(() => {
            return { type: 'Success', text: 'user data created..' }
        }).catch(error => ({ type: 'Error', text: 'user data was not created' }))
})

exports.userDeleted = functionsV1.auth.user().onDelete((user) => {

    // DELETE a user data (all data) in database while delete user
    const updates = {};
    updates[process.env.DB_CHAT_PATH + user.uid] = null;
    updates[process.env.DB_USER_PATH + user.uid] = null;

    return database.ref(process.env.DB_NAME).update(updates)
        .then(() => {
            return { type: 'Success', text: 'user data deleted..' }
        }).catch(error => ({ type: 'Error', text: 'user data was not deleted..' }))
})


/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const { onRequest } = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");



// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
