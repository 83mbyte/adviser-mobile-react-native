//

const { getDatabase } = require('firebase-admin/database');
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const functionsV1 = require('firebase-functions');
const { onRequest } = require('firebase-functions/v2/https');


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

const verifyToken = async (userToken) => {
    return await getAuth(app)
        .verifyIdToken(userToken)
        .then((decodedToken) => {
            const uid = decodedToken.uid;
            return ({ status: true, uid, message: 'Token verified successfully' })
        })
        .catch(() => {
            return ({ status: false, uid: null, message: 'Unauthorized request. Please refresh the app.' })
        });
}

exports.requestToGenerateImage = onRequest(
    {
        secrets: ['SECRET_KEY_OPENAI'],
        timeoutSeconds: 90,
    },
    async (req, res) => {
        if (req.method !== 'POST') {
            return res.status(400).json({ status: 'Error', message: 'Bad request.' });
        }

        if (!req.body) {
            return res.send({ status: 'Error', message: 'Missed or incorrect request data..' })
        }

        try {
            const request_data = JSON.parse(req.body);
            const isTokenVerified = await verifyToken(request_data.accessToken);

            if (!isTokenVerified || isTokenVerified.status == false) {
                return res.status(401).json({ status: 'Error', message: isTokenVerified.message });
            }

            const openai = new OpenAI({
                apiKey: process.env.SECRET_KEY_OPENAI,
            });

            return await gptAPI.requestToGenerateImage(openai, res, request_data);

        } catch (error) {
            return res.status(500).json(
                {
                    status: 'Error',
                    message: error?.message ? error.message : `Something went wrong while generating an image.`
                })
        }

        return res.end(); // default return
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
        }).catch(() => ({ type: 'Error', text: 'user data was not created' }))
})

exports.userDeleted = functionsV1.auth.user().onDelete((user) => {

    // DELETE a user data (all data) in database while delete user
    const updates = {};
    updates[DB_CHAT_PATH + user.uid] = null;
    updates[DB_USER_PATH + user.uid] = null;

    return database.ref(DB_NAME).update(updates)
        .then(() => {
            return { type: 'Success', text: 'user data deleted..' }
        }).catch(() => ({ type: 'Error', text: 'user data was not deleted..' }))
})

// Speach-to-Text

exports.requestToTranscribe = onRequest({
    cors: true,
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
            return res.send({ status: 'Error', message: 'Request body missed..' })
        }

        // if OK
        try {
            const parsedForm = multipart.parse(req.body, boundary); // parse token and files in formData
            const accessToken = parsedForm[0].data.toString();

            const isTokenVerified = await verifyToken(accessToken);

            if (!isTokenVerified || isTokenVerified.status == false) {
                return res.status(401).json({ status: 'Error', message: isTokenVerified.message });
            }

            const audio = parsedForm[1]; // will be: { filename: 'tmp.mp4', type: 'audio/m4a', data: <Buffer 41 41 41 41 42 42 42 42> }

            if (!audio && !audio.data && !audio.filename && !audio.type) {
                return res.send({ status: 'Error', message: 'Something wrong with the audio file. Try again.' })
            }

            return await gptAPI.requestToTranscribe(process.env.SECRET_KEY_OPENAI, res, { buff: audio.data, filename: audio.filename, type: audio.type, lastModified: Date.now() });

        } catch (error) {
            return res.status(500).json(
                {
                    status: 'Error',
                    message: error?.message ? error.message : `Something went wrong while transcribing audio.`
                })
        }

        return res.end()
    })

// STREAM func

exports.requestToAssistantStream = onRequest(
    {
        secrets: ['SECRET_KEY_OPENAI', 'SECRET_KEY_CLAUDEAI'],
        //enforceAppCheck: true,
        // consumeAppCheckToken: true,

        //DEV
        //cors: true,
        timeoutSeconds: 150,
    },
    async (req, res) => {

        let client = null;
        const { tokens, messagesArray, systemVersion, accessToken } = { ...req.body };


        if (systemVersion == 'Claude') {
            client = new Anthropic({
                apiKey: process.env.SECRET_KEY_CLAUDEAI,
            });

        } else {
            client = new OpenAI({
                apiKey: process.env.SECRET_KEY_OPENAI,
            });

        };


        try {

            const isTokenVerified = await verifyToken(accessToken);
            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Connection': 'keep-alive',
                'Cache-Control': 'no-cache',
            });
            if (!isTokenVerified || isTokenVerified.status == false) {
                res.write(`event:${'error'}\n`);
                res.write(`data:${isTokenVerified.message}\n\n`);
                throw new Error()
            }

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
            res.write(`event:${'error'}\n`);
            res.write(`data:${error.message}\n\n`);
            return res.end();
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
