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

        return { type: 'Success', payload: message.content }
    }
    catch (error) {
        //console.log('ERROR', error.message)
        return { type: 'Error', payload: null }
    }
}

async function requestToAssistantClaudeStream(anthropic, { tokens, messagesArray }) {
    // TODO check this function
    // TODO check function
    // TODO check function
    // TODO check function
    const MODEL_AI = 'claude-3-haiku-20240307';
    let systemObject = messagesArray.find(item => item.role == 'system');
    let system = systemObject.content;
    let messagesArrayToSend = messagesArray.filter(item => item.role !== 'system');
    try {
        const stream = anthropic.messages
            .stream({
                model: MODEL_AI,
                max_tokens: tokens,
                system,
                messages: messagesArrayToSend,
            })
            .on('text', (text) => {
                console.log('..on :', text);
            });

        const message = await stream.finalMessage();
        console.log('after finalMessage() :', message);

        return { type: 'Success', payload: message }

    } catch (error) {
        return { type: 'Error', payload: null }
    }
}


module.exports = { requestToAssistantClaude, requestToAssistantClaudeStream }