//

const { getDatabase } = require('firebase-admin/database');
const { initializeApp } = require("firebase-admin/app");
const functionsV1 = require('firebase-functions');
const { onCall, onRequest } = require('firebase-functions/v2/https');


const { OpenAI } = require("openai");
const gptAPI = require('./lib/gptAPI');


const { Anthropic } = require('@anthropic-ai/sdk')
const claudeAPI = require('./lib/claudeAPI');

const multipart = require('parse-multipart-data');

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

// Speach-to-Text

exports.requestToTranscribe = onRequest({
    cors: true, // DEV

    // PROD
    // cors:[  ADDD_SOME_DATA_HERE]
    // enforceAppCheck: true, // Reject requests with missing or invalid App Check tokens. 
},
    async (req, res) => {
        if (req.method !== 'POST') {
            return res.status(400).json({ status: 'Error', message: 'Bad request.' });
        }
        const contentType = req.header('content-type');
        const boundary = contentType.split(';')[1].trim().slice(9,);

        if (!boundary) {
            // in case of incorrect data to parse 
            return res.status(400).json({ status: 'Error', message: 'Bad request. Incorrect data provided.' });
        }

        if (!req.body) {
            return res.send({ status: 'Error', message: 'No voice recorded..' })
        }

        // if OK
        const parsedForm = multipart.parse(req.body, boundary); // parse files in formData

        const audio = parsedForm[0]; // will be: { filename: 'tmp.mp4', type: 'audio/m4a', data: <Buffer 41 41 41 41 42 42 42 42> }

        if (!audio && !audio.data && !audio.filename && !audio.type) {
            return res.send({ status: 'Error', message: 'Something wrong with the audio file. Try again.' })
        }


        return await gptAPI.requestToTranscribe(SECRET_KEY_OPENAI, res, { buff: audio.data, filename: audio.filename, type: audio.type, lastModified: Date.now() });
    }
)

// STREAM func


exports.requestToAssistantStream = onRequest(
    {
        //DEV
        cors: true,
        timeoutSeconds: 120,
    },
    async (req, res) => {
        let client = null;
        const { tokens, messagesArray, systemVersion } = { ...req.body };

        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache',
        });

        if (systemVersion == 'Claude') {
            console.log('run as CLAUDE!')
            client = new Anthropic({
                apiKey: SECRET_KEY_CLAUDEAI,
            });

        } else {
            client = new OpenAI({
                apiKey: SECRET_KEY_OPENAI,
            });

        };


        try {

            if (client) {
                let ai_name = systemVersion;
                if (systemVersion.includes('GPT-')) {
                    ai_name = 'GPT';
                }
                switch (ai_name) {
                    case 'Claude':
                        return claudeAPI.requestToAssistantClaudeStream(client, res, { tokens, messagesArray });

                    case 'GPT':
                        return await gptAPI.requestToAssistantStream(client, res, { tokens, messagesArray, systemVersion });
                        break;
                    default:
                        return res.end();
                        break;
                }
            } else {
                return res.end()
            }
        } catch (error) {
            console.log('error:: ', error);
            return res.status(200).end();
        }

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
