function chooseCorrectModel(systemVersion) {
    switch (systemVersion) {
        case 'GPT-4o-mini':
            return 'gpt-4o-mini';
            break;
        case 'GPT-4':
            return 'gpt-4o';
            break;
        default:
            return 'gpt-3.5-turbo';
            break;
    }
}
async function requestToAssistant(openai, { messagesArray, systemVersion, tokens }) {
    // console.log('requestToAssistant');
    let model = 'gpt-3.5-turbo'; // as default value
    let presence_p = 0; // as default value
    let frequency_p = 0; // as default value
    let temperature = 1; // as default value
    let n_param = 1; // as default value

    model = chooseCorrectModel(systemVersion);

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
        return { status: 'Success', payload: completion.choices }
    } catch (error) {
        return { status: 'Error', payload: null }
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
        return { status: 'Success', payload: image_url }

    } catch (error) {
        return { status: 'Error', payload: null }
    }
}


async function requestToTranscribe(openai_key, res, { buff, filename, type, lastModified }) {

    let fileToTranscribe = new File([buff], filename, { type, lastModified });

    if (fileToTranscribe) {
        const formData = new FormData();
        formData.append('model', 'whisper-1');
        formData.append('file', fileToTranscribe);

        return await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${openai_key}`,
            },
            body: formData
        })
            .then((resp) => {
                fileToTranscribe = null;
                return resp.json();
            })
            .then(respFinal => {
                console.log('respFinal', respFinal);

                if (respFinal?.text) {
                    return res.send({ status: 'Success', payload: respFinal.text })
                } else {
                    return res.send({ status: 'Error', message: 'Unable to convert audio to text.' })
                }
            })
            .catch((error) => {
                fileToTranscribe = null;
                // console.log({ error: 'Internal Server Error. (Error while transcribe operation)' })
                return res.send({ status: 'Error', message: error.message ? error.message : 'Error while transcribe operation.' })
            })
    }

}

// STREAMing. 
async function requestToAssistantStream(openai, res, { messagesArray, systemVersion, tokens }) {
    function writeOperation({ event, data }) {
        res.write(`event:${event}\n`);
        res.write(`data:${data}\n\n`);
    }
    let model = 'gpt-3.5-turbo'; // as default value
    let presence_p = 0; // as default value
    let frequency_p = 0; // as default value
    let temperature = 1; // as default value
    let n_param = 1; // as default value


    model = chooseCorrectModel(systemVersion);

    const formatChunkWithSpecialSybmols = (data) => {
        let formattedChunk = data.replaceAll(' ', '~/~');
        formattedChunk = formattedChunk.replaceAll('\n', '<w_s>');
        return formattedChunk
    }
    try {
        const stream = await openai.chat.completions.create({
            model,
            temperature,
            presence_penalty: presence_p,
            frequency_penalty: frequency_p,
            max_tokens: tokens,
            n: n_param,
            messages: messagesArray,
            stream: true,
            // response_format: { type: 'json_object' }
        });


        for await (const chunk of stream) {
            writeOperation({ event: 'dataChunk', data: chunk.choices[0].delta.content ? formatChunkWithSpecialSybmols(chunk.choices[0].delta.content) : '\n\n' });
        }
        writeOperation({ event: 'streamStop', data: '' });
    } catch (error) {
        // console.log('errror in requestToAssistantStream ', error);
        writeOperation({ event: 'error', data: error.message })
    }
    res.end()
}



module.exports = { requestToAssistant, requestToGenerateImage, requestToAssistantStream, requestToTranscribe };
