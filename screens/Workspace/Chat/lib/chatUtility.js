import EventSource from "react-native-sse"
import { promptTemplatesAPI } from "../../../../lib/promptsAPI"
import { fsAPI } from "../../../../lib/fsAPI"
import { parser } from "posthtml-parser"



export const chatUtility = {
    checkForWarnings: (value, historyId, attachmentsArray,) => checkForWarnings(value, historyId, attachmentsArray),
    createSystemMessage: (obj) => createSystemMessage(obj),
    createUserPromptWithEncodedAttachments: (prompt, attachmentsArray, systemVersion) => createUserPromptWithEncodedAttachments(prompt, attachmentsArray, systemVersion),
    convertToBase64: (urlToAttachment) => convertToBase64(urlToAttachment),
    createDiscussionContext: (arrayDataOfCurrentHistory, systemVersion) => createDiscussionContext(arrayDataOfCurrentHistory, systemVersion),
    streamingPromise: (obj) => streamingPromise(obj),
    createChatItemsAndAddToHistory: async (obj) => await createChatItemsAndAddToHistory(obj),
}

export function checkForWarnings(value, historyId = null, attachmentsArray = null) {

    if ((attachmentsArray && attachmentsArray.length > 0) && (!value || value == '' || value == undefined)) {
        return { status: 'Error', message: `You are trying to send attachments only. There is no message/instruction provided, it may cause to unexpected results. Please enter your comment/instruction to the attached files.` }
    };

    if (!value || value == '' || value == undefined) {
        return { status: 'Error', message: `You are trying to submit an empty message. It is not allowed.` }
    };

    if (!historyId) {
        return {
            status: 'Error', message: `Seems that no ID was assigned to the current chat. Try to start a new chat.`
        }
    };

    // if passed - return Success
    return { status: 'Success', message: 'No warnings detected.' }
};

export function createSystemMessage({ replyFormat, replyTone, replyLength, replyStyle }) {
    switch (replyFormat) {
        case 'Plain text':
            promptTemplatesAPI
            return promptTemplatesAPI.default({ replyTone, replyLength, replyStyle });
            break;
        case 'HTML':
            return promptTemplatesAPI.replyAsHTML({ replyTone, replyLength, replyStyle });
            break;
        default:
            return promptTemplatesAPI.default({ replyTone, replyLength, replyStyle });
            break;
    }
}

export async function createUserPromptWithEncodedAttachments(prompt, attachmentsArray, systemVersion) {

    if (!prompt || !attachmentsArray) {
        // if no user prompt or no attachments data
        return { status: 'Error', message: `No user prompt OR attachments detected..` }
    }
    else {
        let userPromtWithEncodedAttachments;
        userPromtWithEncodedAttachments = [{
            type: 'text',
            text: prompt
        },];

        for (let index = 0; index < attachmentsArray.length; index++) {
            const element = attachmentsArray[index];
            let encodedResult = await convertToBase64(element);
            if (encodedResult.status === 'Success') {
                switch (systemVersion) {
                    case 'GPT-4':
                        userPromtWithEncodedAttachments.push({
                            type: 'image_url',
                            image_url: {
                                url: encodedResult.payload
                            }
                        });
                        break;
                    case 'GPT-4o-mini':
                        userPromtWithEncodedAttachments.push({
                            type: 'image_url',
                            image_url: {
                                url: encodedResult.payload
                            }
                        });
                        break;

                    case 'Claude':
                        const regStr = /(?:data\:)(image\/[a-zA-Z]+\;base64)(?:\,)(.*$)/g;
                        const regex = new RegExp(regStr, 'g');
                        let regexResult = regex.exec(encodedResult.payload);

                        if (regexResult && regexResult.length == 3) {
                            let imageDetails = regexResult[1].split(';');
                            userPromtWithEncodedAttachments.push({
                                type: 'image',
                                source: {
                                    media_type: imageDetails[0],
                                    type: imageDetails[1],
                                    data: regexResult[2]
                                }
                            });
                        }
                        break;

                    default:
                        break;
                }
            }
        }
        return userPromtWithEncodedAttachments;
    }
}

export async function convertToBase64(urlToAttachment) {

    if (!urlToAttachment) {
        return { status: 'Error', message: `Something goes wrong while trying to convert attachments..` }
    } else {
        return await fetch(urlToAttachment)
            .then((response) => {
                return response.blob()
            })
            .then(blob => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve({ status: 'Success', payload: reader.result });
                    reader.onerror = () => reject({ status: 'Error', message: 'unable to read and convert attachment' });
                    reader.readAsDataURL(blob);
                })
            })
    }
}

export function createDiscussionContext(arrayDataOfCurrentHistory, systemVersion) {

    if (!arrayDataOfCurrentHistory || !systemVersion) {
        return { status: 'Error', message: `Missed previous discussion data.. unable to create discussion context.` }
    }
    else {
        let arrayDiscussionContext = [{ role: 'user', content: arrayDataOfCurrentHistory[0].user.content }];

        switch (systemVersion) {
            case 'GPT-4':
                // console.log('createDiscussionContext for GPT-4')
                if (arrayDataOfCurrentHistory.length > 0) {
                    for (let i = 0; i <= arrayDataOfCurrentHistory.length - 1; i++) {
                        arrayDiscussionContext.push({ role: 'assistant', content: arrayDataOfCurrentHistory[i].assistant.content })
                    }
                }
                break;
            case 'GPT-3.5':
                // console.log('createDiscussionContext for GPT-3.5')
                if (arrayDataOfCurrentHistory.length >= 2) {
                    arrayDiscussionContext.push({ role: 'assistant', content: arrayDataOfCurrentHistory[arrayDataOfCurrentHistory.length - 2].assistant.content });
                    arrayDiscussionContext.push({ role: 'assistant', content: arrayDataOfCurrentHistory[arrayDataOfCurrentHistory.length - 1].assistant.content });
                }
                else {
                    arrayDiscussionContext.push({ role: 'assistant', content: arrayDataOfCurrentHistory[arrayDataOfCurrentHistory.length - 1].assistant.content });
                }
                break;

            case 'Claude':
                // console.log('createDiscussionContext for CLAUDE')
                if (arrayDataOfCurrentHistory.length > 1) {
                    arrayDiscussionContext.push({ role: 'assistant', content: arrayDataOfCurrentHistory[0].assistant.content })
                    for (let i = 1; i < arrayDataOfCurrentHistory.length; i++) {
                        arrayDiscussionContext.push({ role: 'user', content: arrayDataOfCurrentHistory[i].user.content });
                        arrayDiscussionContext.push({ role: 'assistant', content: arrayDataOfCurrentHistory[i].assistant.content });
                    }
                } else {
                    arrayDiscussionContext.push({ role: 'assistant', content: arrayDataOfCurrentHistory[arrayDataOfCurrentHistory.length - 1].assistant.content });
                }
                break;

            default:
                arrayDiscussionContext.push({ role: 'assistant', content: arrayDataOfCurrentHistory[arrayDataOfCurrentHistory.length - 1].assistant.content });
                break;
        }

        return arrayDiscussionContext;
    }
}

export function streamingPromise({ discussionContext: discussionContext, max_tokens = 1024, systemVersion, setStreamData }) {
    let stringFromChunks = '';

    const removeSpecialSymbolsFromChunk = (data) => {
        let formattedChunk = (data).replaceAll('~/~', ' ',);
        formattedChunk = formattedChunk.replaceAll('<w_s>', '\n');
        return formattedChunk
    }

    return new Promise(
        (resolve, reject) => {

            const es = new EventSource(
                process.env.EXPO_PUBLIC_EMULATOR_FUNC_STREAM_PATH,
                {
                    method: 'POST',
                    headers: {
                        // 'Content-Type': 'text/event-stream',
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        systemVersion: systemVersion,
                        tokens: max_tokens,
                        messagesArray: discussionContext
                    }),
                    timeout: 50000,
                    pollingInterval: 0,
                    //lineEndingCharacter: '\n'
                },
            );

            function closeStreamOperations() {

                es.close();
                es.removeAllEventListeners();
                console.log('stream closed..')
                return null
            }

            es.addEventListener('open', (event) => console.log('Stream is opened..', event));

            es.addEventListener('dataChunk', (event) => {

                let formattedChunk = removeSpecialSymbolsFromChunk(event.data);
                stringFromChunks = stringFromChunks + formattedChunk;

                setStreamData((prevData) => prevData + formattedChunk);
            });

            es.addEventListener('error', (event) => {
                // console.log('Stream got error..', event);
                closeStreamOperations();
                reject({ status: 'Error', name: '', message: 'error while streeaming..' });
            });


            es.addEventListener('finalText', (event) => {
                if (event?.data) {
                    setStreamData('');
                    closeStreamOperations();

                    let formattedStr = event.data.replaceAll('+_+', '\n');
                    resolve({ status: 'Success', payload: { text: formattedStr } }); // return from Promise

                } else {
                    // console.log('No data as a final result/response');
                    reject({ status: 'Error', message: 'No data as a final result/response from assistant.' }); // promise rejected
                }
            })

            es.addEventListener('streamStop', async (event) => {
                closeStreamOperations();
                resolve({ status: 'Success', payload: { text: stringFromChunks } });
            })

        })
}

export async function createChatItemsAndAddToHistory({ userContent, assistantContent, format, attachmentsArray, addHistoryItem, historyId }) {
    let dialogItems = {};
    dialogItems.assistant = { content: assistantContent, format: format };

    if (attachmentsArray && attachmentsArray.length > 0) {

        let attachmentsInAppStorage = await fsAPI.moveAttachmentsFromCache(attachmentsArray, historyId);
        dialogItems.user = {
            content: userContent,
            showAttachments: attachmentsInAppStorage
        }
    } else {
        dialogItems.user = { content: userContent, showAttachments: null };
    }

    addHistoryItem({ historyId, data: dialogItems })
}


export function createJSXFromHTML(data, setContentHTML) {
    let parseResult = parser(data);
    let finalResult = [];


    const _checkInner = (item) => {
        (item.content).forEach((elem, index) => {
            if (typeof elem == 'string') {
                switch (item.tag) {
                    case 'strong':

                        finalResult.push({ value: `${elem.trim()}`, style: { fontWeight: 'bold', marginBottom: 10 } })
                        break;

                    case 'li':
                        finalResult.push({
                            value: `- ${elem.trim()}`, style: { fontStyle: 'italic', marginBottom: 5 }
                        })
                        break;

                    case 'p':
                        finalResult.push({
                            value: `    ${elem.trim()}`, style: { marginBottom: 20 }
                        })
                        break;
                    case 'h1':
                    case 'h2':
                    case 'h3':
                    case 'h4':
                    case 'h5':
                        finalResult.push({
                            value: `${elem.trim()}`, style: { fontSize: 15, fontWeight: 'bold', marginBottom: 10 }
                        })
                        break

                    default:

                        if ((elem !== '\n') && (elem !== '\n\n')) {
                            finalResult.push({
                                value: elem.trim(), style: { marginBottom: 10 }
                            })
                        }
                        break;
                }
            }
            if (typeof elem == 'object') {
                _checkInner(elem)
            }
        })

    }

    if (parseResult) {

        parseResult.forEach((item, index) => {
            if (typeof item == 'string') {


                if ((item == '\n') && (item == '\n\n')) {
                    finalResult.push({
                        value: item.trim(), style: null
                    })
                }
            }
            if (typeof item == 'object') {
                _checkInner(item);
            }
        });
    }
    return finalResult
}