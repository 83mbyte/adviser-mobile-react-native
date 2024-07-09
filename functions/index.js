//

const { getDatabase } = require('firebase-admin/database');
const { initializeApp } = require("firebase-admin/app");
const functionsV1 = require('firebase-functions');
const { onCall } = require('firebase-functions/v2/https');

const { OpenAI } = require("openai");
const gptAPI = require('./lib/gptAPI');


const { Anthropic } = require('@anthropic-ai/sdk')
const claudeAPI = require('./lib/claudeAPI');

//init app, database
const app = initializeApp();
const database = getDatabase(app);

const DB_USER_PATH = process.env.DB_USER_PATH;
const DB_CHAT_PATH = process.env.DB_CHAT_PATH;
const DB_NAME = process.env.DB_NAME;
const SECRET_KEY_OPENAI = process.env.SECRET_KEY_OPENAI; // TODO use firebase secrets
const SECRET_KEY_CLAUDEAI = process.env.SECRET_KEY_CLAUDEAI;

exports.requestToAssistant = onCall(
    {
        // DEV
        // cors: true,

        // PROD
        // cors:[  ADDD_SOME_DATA_HERE]
        // enforceAppCheck: true, // Reject requests with missing or invalid App Check tokens.
        // consumeAppCheckToken: true  // Consume the token after verification.
    },
    async (request) => {

        if (request.data.systemVersion == 'Claude') {
            // console.log('using CLAUDE AI')
            const anthropic = new Anthropic({
                apiKey: SECRET_KEY_CLAUDEAI,
            })
            return await claudeAPI.requestToAssistantClaude(anthropic, request.data)
        } else {
            // console.log('using OPEN AI')
            const openai = new OpenAI({
                apiKey: SECRET_KEY_OPENAI,
            });
            return await gptAPI.requestToAssistant(openai, request.data);
        }

    }
)

exports.requestToGenerateImage = onCall(
    {},
    async (request) => {
        const openai = new OpenAI({
            apiKey: SECRET_KEY_OPENAI,
        });
        return await gptAPI.requestToGenerateImage(openai, request.data)
    }
)

exports.userAdded = functionsV1.auth.user().onCreate((user) => {

    // CREATE an user data (empty template) in database while registration request 
    const updates = {};
    const chat_id = 'defaultExampleDataId';

    updates[DB_CHAT_PATH + user.uid + '/' + chat_id] = [
        {
            assistant: { content: 'example_assistant_string..', format: 'example_format_string' },
            user: { content: 'example_user_string..' }
        }
    ];
    updates[DB_USER_PATH + user.uid + '/chats'] = {};
    updates[DB_USER_PATH + user.uid + '/profile'] = { isEmailVerified: user.emailVerified, email: user.email }

    return database.ref(DB_NAME).update(updates)
        .then(() => {
            return { type: 'Success', text: 'user data created..' }
        }).catch(error => ({ type: 'Error', text: 'user data was not created' }))
})

exports.userDeleted = functionsV1.auth.user().onDelete((user) => {

    // DELETE a user data (all data) in database while delete user
    const updates = {};
    updates[DB_CHAT_PATH + user.uid] = null;
    updates[DB_USER_PATH + user.uid] = null;

    return database.ref(DB_NAME).update(updates)
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
