import React, { useEffect, useState, } from 'react';

import WhiteBottomWrapper from '../../../components/Wrappers/WhiteBottomWrapper';
import OpacityWrapper from '../../../components/Wrappers/OpacityWrapper';

import { useAttachContext } from '../../../context/AttachContextProvider';
import { useSettingsContext } from '../../../context/SettingsContextProvider';
import ModalContainer from '../../../components/Modals/ModalContainer';
import WarningModalContent from '../../../components/Modals/WarningModal/WarningModalContent';
import { useHistoryContext } from '../../../context/HistoryContextProvider';
import ChatHeaderRightButtons from '../../../components/Buttons/ChatHeaderRightButtons';
import ImagePickerModalContent from '../../../components/Modals/ImagePicker/ImagePickerModalContent';
import ZoomImageModalContent from '../../../components/Modals/ZoomImage/ZoomImageModalContent';
import ChatInterface from './ChatInterface';


import { chatUtility } from './lib/chatUtility';

const ChatContainer = ({ navigation, route }) => {

    // local states
    const [streamData, setStreamData] = useState('');
    const [tempUserMessage, setTempUserMessage] = useState(null);
    const [showWarningModal, setShowWarningModal] = useState({ show: false, message: null });
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [showZoomImage, setShowZoomImage] = useState({ show: false, imageSource: null });

    // Settings context
    const settingsContextData = useSettingsContext();
    const { replyLength, replyStyle, replyTone, replyFormat, replyCount, systemVersion, } = settingsContextData.data.chatSettings;

    // Attachments context controls
    const attachContextData = useAttachContext();
    const attachmentsPickerModal = attachContextData.data.showPickerModal;
    const attachmentsArray = attachContextData.data.attachmentsArray;

    // History context controls
    const historyContextData = useHistoryContext();
    const history = historyContextData.data.chatHistory.history;
    const historyIndexes = historyContextData.data.chatHistory.historyIndexes;
    const historyId = historyContextData.data.chatHistory.currentId;
    const setHistoryId = (obj) => historyContextData.setChatHistoryId(obj);
    const addHistoryItem = (value) => historyContextData.addChatHistoryItem(value);



    const submitPrompt = async (prompt) => {

        try {

            let noWarnings = chatUtility.checkForWarnings(prompt, historyId);
            if (noWarnings.status !== 'Success' || noWarnings.status === 'Error') {
                // if checkForWarnings returns error..
                //
                throw new Error(noWarnings.message);
            }
            else {
                // No warnings detected..
                //
                let systemMessage;
                systemMessage = chatUtility.createSystemMessage({ replyFormat, replyTone, replyLength, replyStyle });
                let userPromtWithEncodedAttachments = null;
                let discussionContext = null;

                if (attachmentsArray && attachmentsArray.length > 0) {
                    // if at least 1 attachment exists
                    // create base64 encoded attachments and include it to the user prompt
                    userPromtWithEncodedAttachments = await chatUtility.createUserPromptWithEncodedAttachments(prompt, attachmentsArray, systemVersion);
                }

                // create prompts allows to create a conversation context
                if (history[historyId] && history[historyId].length > 0) {

                    discussionContext = [systemMessage, ...chatUtility.createDiscussionContext(history[historyId], systemVersion)];
                    discussionContext.push({ role: 'user', content: userPromtWithEncodedAttachments ? userPromtWithEncodedAttachments : prompt })
                } else {
                    // console.log('createDiscussionContext EMPTY)')
                    discussionContext = [systemMessage, { role: 'user', content: userPromtWithEncodedAttachments ? userPromtWithEncodedAttachments : prompt }];
                }

                // visualizing user message while receiving chunks of stream data from assistant
                // 
                setTempUserMessage({ user: { content: prompt, showAttachments: null } });

                return await chatUtility.streamingPromise({ discussionContext, max_tokens: 1024, setStreamData, systemVersion })
                    .then(
                        (resp) => {

                            if (resp?.status !== 'Success') {
                                throw new Error('unsuccessful reply (no data) received..');
                            }
                            else {

                                chatUtility.createChatItemsAndAddToHistory({ userContent: prompt, assistantContent: resp.payload.text, format: replyFormat, attachmentsArray, addHistoryItem, historyId });
                            }

                            setTempUserMessage(null);
                            setStreamData('');
                            return { status: 'Success' };
                        }
                    )
                    .catch((error) => {
                        throw new Error(error.message);
                    });
            }


        } catch (error) {
            setShowWarningModal({ show: true, message: error.message });
        }
    }

    useEffect(() => {
        if (!historyId) {
            setHistoryId();
        }
    }, []);

    useEffect(() => {
        // show buttons in header
        if (historyIndexes && Object.keys(historyIndexes).length > 0) {
            navigation.setOptions({

                headerRight: () => (
                    <ChatHeaderRightButtons
                        color='white'
                        onPressHistory={() => navigation.navigate('Chat History')}
                        onPressNewChat={() => setShowNewChatModal(true)}
                    />
                ),
            });
        }
    }, [navigation]);

    return (
        <>
            {/* Main  */}
            <WhiteBottomWrapper keyId={'cardChat'} route={route}>
                <OpacityWrapper keyId={'opacityChat'}>

                    <ChatInterface submitPrompt={submitPrompt} setShowZoomImage={setShowZoomImage} tempUserMessage={tempUserMessage} streamData={streamData} history={history} historyId={historyId} />

                </OpacityWrapper>
            </WhiteBottomWrapper>
            {/* Main end  */}


            {/* -------------------------------------------------- */}
            {/* --------- various MODALS/POPUPS elements --------- */}
            {/* -------------------------------------------------- */}

            {
                // popup notification about an error..
                showWarningModal.show &&
                <ModalContainer modalVisible={showWarningModal.show} callbackCancel={() => setShowWarningModal({ show: false, message: null })}>
                    <WarningModalContent
                        message={showWarningModal.message}
                        buttons={[{ title: 'OK', type: 'solid' }]}
                    />
                </ModalContainer>
            }

            {
                // popup notification about a new chat creation
                showNewChatModal &&
                <ModalContainer modalVisible={showNewChatModal} callbackCancel={() => setShowNewChatModal(false)}>
                    <WarningModalContent
                        title='Start a New Chat'
                        message={'By clicking AGREE, you will close the current chat and open a new one.'}
                        buttons={[
                            {
                                title: 'AGREE',
                                type: 'solid',
                                callback: () => { setHistoryId(); attachContextData.clearAllItems(); }
                            },
                            { title: 'Cancel', type: 'outline' }
                        ]}
                    />
                </ModalContainer>
            }

            {
                // attachment picker modal
                attachmentsPickerModal &&
                <ModalContainer modalVisible={attachmentsPickerModal} callbackCancel={() => attachContextData.showAttachmentPicker(false)}>
                    <ImagePickerModalContent />

                </ModalContainer>
            }
            {
                // modal zooom image
                showZoomImage.show &&
                <ModalContainer modalVisible={showZoomImage.show} callbackCancel={() => setShowZoomImage(false)} customHeight={'50%'}>
                    <ZoomImageModalContent imageSource={showZoomImage.imageSource} />

                </ModalContainer>
            }
        </>
    )
}

export default ChatContainer;