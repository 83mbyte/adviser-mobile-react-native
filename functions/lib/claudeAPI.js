async function requestToAssistantClaude(anthropic, { messagesArray, tokens }) {

    try {


        let systemObject = messagesArray.find(item => item.role == 'system');
        let system = systemObject.content;
        let messagesArrayToSend = messagesArray.filter(item => item.role !== 'system');

        const message = await anthropic.messages.create({
            max_tokens: tokens,
            messages: messagesArrayToSend,
            system: systemObject.content,
            model: 'claude-3-haiku-20240307',
        });

        return { type: 'Success', payload: message.content }
    }
    catch (error) {
        console.log('ERROR', error.message)
        return { type: 'Error', payload: 'ERROR requestToAssistantClaude' }
    }
}

async function requestToAssistantClaudeStream(anthropic, { tokens, messagesArray }) {

    try {
        const stream = anthropic.messages
            .stream({
                model: 'claude-3-haiku-20240307',
                max_tokens: tokens,
                messages: messagesArray,
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