import React from 'react';

import WhiteBottomWrapper from '../../../../components/Wrappers/WhiteBottomWrapper';
import ShowSettings from '../ShowSettings';

// descriptions/text data
import { chatSettingsDescription } from '../../../../lib/textData';


const DATA = [
    {
        id: 1,
        sectionTitle: 'AI System',
        options: [
            {
                subtitle: null,
                dispatcherName: 'setChatSettings',
                dispatcherType: 'SET_SYSTEM_VERSION',
                stateKey: 'systemVersion',
                elements: [
                    {

                        labelText: chatSettingsDescription.systemVersion[1].labelText,
                        value: chatSettingsDescription.systemVersion[1].value,
                        description: chatSettingsDescription.systemVersion[1].description
                    },
                    {
                        labelText: chatSettingsDescription.systemVersion[2].labelText,
                        value: chatSettingsDescription.systemVersion[2].value,
                        description: chatSettingsDescription.systemVersion[2].description
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
                dispatcherName: 'setChatSettings',
                dispatcherType: 'SET_REPLY_LENGTH',
                stateKey: 'replyLength',
                elements: [
                    {
                        labelText: chatSettingsDescription.replyLength[1].labelText,
                        value: chatSettingsDescription.replyLength[1].value,

                    },
                    {
                        labelText: chatSettingsDescription.replyLength[2].labelText,
                        value: chatSettingsDescription.replyLength[2].value,
                    },
                    {
                        labelText: chatSettingsDescription.replyLength[3].labelText,
                        value: chatSettingsDescription.replyLength[3].value,
                    },
                ]
            },
            {
                subtitle: `Set reply style:`,
                dispatcherName: 'setChatSettings',
                dispatcherType: 'SET_REPLY_STYLE',
                stateKey: 'replyStyle',
                elements: [
                    {
                        labelText: chatSettingsDescription.replyStyle[1].labelText,
                        value: chatSettingsDescription.replyStyle[1].value,
                    },
                    {
                        labelText: chatSettingsDescription.replyStyle[2].labelText,
                        value: chatSettingsDescription.replyStyle[2].value,
                    },
                ]
            },
            {
                subtitle: `Set reply tone:`,
                dispatcherName: 'setChatSettings',
                dispatcherType: 'SET_REPLY_TONE',
                stateKey: 'replyTone',
                elements: [
                    {
                        labelText: chatSettingsDescription.replyTone[1].labelText,
                        value: chatSettingsDescription.replyTone[1].value,
                    },
                    {
                        labelText: chatSettingsDescription.replyTone[2].labelText,
                        value: chatSettingsDescription.replyTone[2].value,
                    },
                    {
                        labelText: chatSettingsDescription.replyTone[3].labelText,
                        value: chatSettingsDescription.replyTone[3].value,
                    },
                    {
                        labelText: chatSettingsDescription.replyTone[4].labelText,
                        value: chatSettingsDescription.replyTone[4].value,
                    },
                ]
            }
        ]
    },
    {
        id: 3,
        sectionTitle: `Output adjustment`,
        options: [
            {
                subtitle: `Set output format`,
                dispatcherName: 'setChatSettings',
                dispatcherType: 'SET_REPLY_FORMAT',
                stateKey: 'replyFormat',
                elements: [
                    {
                        labelText: chatSettingsDescription.replyFormat[1].labelText,
                        value: chatSettingsDescription.replyFormat[1].value,
                        description: chatSettingsDescription.replyFormat[1].description
                    },
                    {
                        labelText: chatSettingsDescription.replyFormat[2].labelText,
                        value: chatSettingsDescription.replyFormat[2].value,
                        description: chatSettingsDescription.replyFormat[2].description
                    },
                ]
            },
            {
                subtitle: `Set alternative replies number`,
                dispatcherName: 'setChatSettings',
                dispatcherType: 'SET_REPLY_COUNT',
                stateKey: 'replyCount',
                optionDescription: chatSettingsDescription.replyCount.optionDescription,
                elements: []
            }
        ]
    },

]


const ChatSettings = ({ route }) => {


    return (
        <WhiteBottomWrapper route={route} keyId={'Chat_Settings'}>

            <ShowSettings settingsDataArray={DATA} settingsStatePath={'chatSettings'} />

        </WhiteBottomWrapper>

    );
};

export default ChatSettings;
