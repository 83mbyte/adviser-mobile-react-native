const MODEL_AI = 'claude-3-haiku-20240307';

async function requestToAssistantClaude(anthropic, { messagesArray, tokens }) {
    const MODEL_AI = 'claude-3-haiku-20240307';
    try {

        let systemObject = messagesArray.find(item => item.role == 'system');
        let system = systemObject.content;
        let messagesArrayToSend = messagesArray.filter(item => item.role !== 'system');

        const message = await anthropic.messages.create({
            max_tokens: tokens,
            messages: messagesArrayToSend,
            system,
            model: MODEL_AI,
        });

        return { status: 'Success', payload: message.content }
    }
    catch (error) {
        //console.log('ERROR', error.message)
        return { status: 'Error', payload: null }
    }
}

async function requestToAssistantClaudeStream(client, res, { tokens, messagesArray },) {

    let systemObject = messagesArray.find(item => item.role == 'system');
    let system = systemObject.content;
    let messagesArrayToSend = messagesArray.filter(item => item.role !== 'system');

    function writeOperation({ event, data }) {
        res.write(`event:${event}\n`);
        res.write(`data:${data}\n\n`);
    }

    return client.messages
        .stream({
            max_tokens: tokens,
            messages: messagesArrayToSend,
            system,
            model: MODEL_AI,
        })
        .on('error', (e) => {
            writeOperation({ event: 'error', data: `Something goes wrong..try to modify your prompt. Error = ${e}.` });
        })
        .on('text', (text) => {
            // console.log('chunking..');
            writeOperation({ event: 'dataChunk', data: text })
        })
        .on('end', () => {
            // console.log('end');
            writeOperation({ event: 'close', data: '' });
            return res.end();
        })
        .on('message', (message) => {
            // console.log('in message: ', message);
            if (message.stop_reason == 'end_turn' || message.stop_reason == 'max_tokens') {

                let str = message.content[0].text;
                let formattedStr = str.replaceAll('\n', '+_+');
                writeOperation({ event: 'finalText', data: formattedStr });
            } else {

                writeOperation({ event: 'error', data: 'Something goes wrong..try to modify your prompt.' });
            }
        })
}

module.exports = { requestToAssistantClaude, requestToAssistantClaudeStream }