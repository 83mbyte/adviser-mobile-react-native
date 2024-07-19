export const DATA_CHAT_SETTINGS = [
    {
        id: 1,
        sectionTitle: 'AI System',
        options: [
            {
                // subtitle: null,
                dispatcherType: 'SET_SYSTEM_VERSION',
                stateKey: 'systemVersion',
                elements: [
                    {
                        id: 1,
                        labelText: `GPT-4o mini`,
                        value: `GPT-4o-mini`,
                        description: `GPT-4o mini (“o” for “omni”) is the intelligent small model for fast, lightweight tasks. GPT-4o mini is more capable than GPT-3.5 Turbo.`
                    },
                    {
                        id: 2,
                        labelText: `GPT-4`,
                        value: `GPT-4`,
                        description: `GPT-4 is a large multimodal model that can solve difficult problems with greater accuracy, thanks to its broader general knowledge and advanced reasoning capabilities.`
                    },
                    {
                        id: 3,
                        labelText: `Claude`,
                        value: `Claude`,
                        description: `Claude is a highly performant, trustworthy, and intelligent AI platform built by Anthropic. Claude excels at tasks involving language, reasoning, analysis, coding, and more.`
                    },

                ]
            }
        ]
    },
    {
        id: 2,
        sectionTitle: `Assistant's adjustment`,
        options: [

            {
                subtitle: `Set reply length (as max):`,
                dispatcherType: 'SET_REPLY_LENGTH',
                stateKey: 'replyLength',
                elements: [
                    {
                        id: 1,
                        labelText: `100 words`,
                        value: `100 words`,
                    },
                    {
                        id: 2,
                        labelText: `400 words`,
                        value: `400 words`,
                    },
                    {
                        id: 3,
                        labelText: `800 words`,
                        value: `800 words`,
                    },
                ]
            },
            {
                subtitle: `Set reply style`,
                dispatcherType: 'SET_REPLY_STYLE',
                stateKey: 'replyStyle',
                elements: [
                    {
                        id: 1,
                        labelText: 'Detailed',
                        value: 'Detailed',
                    },
                    {
                        id: 2,
                        labelText: 'Facts only',
                        value: 'Facts only',
                    },
                ]
            },
            {
                subtitle: `Set reply tone`,
                dispatcherType: 'SET_REPLY_TONE',
                stateKey: 'replyTone',
                elements: [
                    {
                        id: 1,
                        labelText: 'Professional',
                        value: 'Professional',
                    },
                    {
                        id: 2,
                        labelText: 'Casual',
                        value: 'Casual',
                    },
                    {
                        id: 3,
                        labelText: 'Philosophical',
                        value: 'Philosophical',
                    },
                    {
                        id: 4,
                        labelText: 'Funny',
                        value: 'Funny',
                    },
                ]
            },

        ]
    },
    {
        id: 3,
        sectionTitle: 'Output rules',
        options: [
            {
                subtitle: `Set format`,
                dispatcherType: 'SET_REPLY_FORMAT',
                stateKey: 'replyFormat',
                elements: [
                    {
                        id: 1,
                        labelText: 'Plain text',
                        value: 'Plain text',
                        description: `The output will be provided as plain text, without formatting.`
                    },
                    {
                        id: 2,
                        labelText: 'HTML',
                        value: 'HTML',
                        description: `The output will be provided in HTML format.`
                    },

                ]
            },
            {
                subtitle: `Set alternative replies`,
                dispatcherType: 'SET_REPLY_COUNT',
                stateKey: 'replyCount',
                elements: [
                    {
                        id: 1,
                        labelText: 'Allow alternative replies',
                        value: true,
                        description: `Set this opt to get the alternative replies (variants) on your request. It allows to choose more suitable assistant's reply for your needs.`
                    },


                ]
            },
        ]
    }


]

export const DATA_IMAGES_SETTINGS = [
    {
        id: 1,
        sectionTitle: 'Image Size',
        options: [
            {
                dispatcherName: 'setImageSettings',
                dispatcherType: 'SET_IMAGE_SIZE',
                stateKey: 'size',
                elements: [
                    {
                        id: 1,
                        labelText: `1024x1024 pixels`,
                        value: `1024x1024`
                    },
                    {
                        id: 2,
                        labelText: `1792x1024 pixelss`,
                        value: `1792x1024`
                    },
                    {
                        id: 3,
                        labelText: `1024x1792 pixels`,
                        value: `1024x1792`
                    },
                ]
            }
        ]
    },
    {
        id: 2,
        sectionTitle: 'Image Style',
        options: [
            {
                dispatcherType: 'SET_IMAGE_STYLE',
                stateKey: 'style',
                elements: [
                    {
                        id: 1,
                        labelText: 'Colorful',
                        value: 'vivid',
                        description: 'Hyper-real and dramatic images.'
                    },
                    {
                        id: 2,
                        labelText: 'Natural',
                        value: 'natural'
                    },
                ]
            }
        ]
    },
    {
        id: 3,
        sectionTitle: `Image Quality`,
        options: [
            {
                dispatcherType: 'SET_IMAGE_QUALITY',
                stateKey: 'quality',
                elements: [
                    {
                        id: 1,
                        labelText: 'Standard',
                        value: 'standard',
                    },
                    {
                        id: 2,
                        labelText: 'HD',
                        value: 'hd',
                        description: 'For enhanced detail.'
                    }
                ]

            }
        ]
    }
];


