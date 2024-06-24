async function requestToAssistant(openai, { messagesArray, systemVersion, tokens }) {
    // console.log('requestToAssistant');
    let model = 'gpt-3.5-turbo'; // as default value
    let presence_p = 0; // as default value
    let frequency_p = 0; // as default value
    let temperature = 1; // as default value
    let n_param = 1; // as default value

    switch (systemVersion) {
        case 'GPT-3':
            model = 'gpt-3.5-turbo';
            break;
        case 'GPT-4':
            model = 'gpt-4o';
            break;
        default:
            model = 'gpt-3.5-turbo';
            break;
    }

    try {
        const completion = await openai.chat.completions.create({
            model,
            temperature,
            presence_penalty: presence_p,
            frequency_penalty: frequency_p,
            max_tokens: tokens,
            n: n_param,
            // messages: [{ "role": "system", "content": "You are a helpful assistant." }, { "role": "user", "content": "userPrompt" }]
            messages: messagesArray,
        });
        return { type: 'Success', payload: completion.choices }
    } catch (error) {
        return { type: 'Error', payload: null }
    }

}

async function requestToGenerateImage(openai, { size = '1024x1024', prompt, style, quality }) {

    try {
        const response = await openai.images.generate({
            model: process.env.AI_IMAGE_MODEL,
            prompt: prompt,
            n: 1,
            style,
            quality,
            size,
        });
        image_url = response.data[0].url;
        return { type: 'Success', payload: image_url }

    } catch (error) {
        return { type: 'Error', payload: null }
    }
}

module.exports = { requestToAssistant, requestToGenerateImage };
