import React, { useState, useEffect } from 'react';
import ChatInterface from './ChatInterface';
import WhiteBottomWrapper from '../../../components/Wrappers/WhiteBottomWrapper';
import OpacityWrapper from '../../../components/Wrappers/OpacityWrapper';

import { useHistoryContext } from '../../../context/HistoryContextProvider';
import { useAttachContext } from '../../../context/AttachContextProvider';
import { useSettingsContext } from '../../../context/SettingsContextProvider';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import WarningModalContent from '../../../components/Modals/WarningModal/WarningModalContent';
import ModalContainer from '../../../components/Modals/ModalContainer';
import ImagePickerModalContent from '../../../components/Modals/ImagePicker/ImagePickerModalContent';
import ZoomImageModalContent from '../../../components/Modals/ZoomImage/ZoomImageModalContent';

import { connectFunctionsEmulator, httpsCallable, } from "firebase/functions";
import { cloudFunctions } from '../../../firebaseConfig';
import { promptTemplatesAPI } from '../../../lib/promptsAPI';
import { fsAPI } from '../../../lib/fsAPI';


const ChatContainer = ({ navigation, route }) => {
    const historyContextData = useHistoryContext();
    const history = historyContextData.data.chatHistory.history;
    const historyIndexes = historyContextData.data.chatHistory.historyIndexes;
    const historyId = historyContextData.data.chatHistory.currentId;

    const setHistoryId = (obj) => historyContextData.setChatHistoryId(obj);
    const addHistoryItem = (value) => historyContextData.addChatHistoryItem(value);

    const [showModal, setShowModal] = useState(false);
    const [showWarningModal, setShowWarningModal] = useState({ show: false, message: null });
    const [showZoomImage, setShowZoomImage] = useState({ show: false, imageSource: null });
    const [isLoading, setIsLoading] = useState(false);

    const attachContextData = useAttachContext();
    const attachmentsPickerModal = attachContextData.data.showPickerModal;
    const attachmentsArray = attachContextData.data.attachmentsArray;

    const settingsContextData = useSettingsContext();
    const { replyLength, replyStyle, replyTone, replyFormat, replyCount, systemVersion, } = settingsContextData.data.chatSettings;

    const checkForWarnings = (value) => {
        if (!historyId) {
            setShowWarningModal({ show: true, message: `Unexpected error.` });
            return { type: 'Error', message: 'Something wrong..' }
        }
        if (attachmentsArray.length > 0 && (!value || value == '' || value == undefined)) {
            setShowWarningModal({ show: true, message: `You are trying to send attachments only. There is no message/instruction provided, it may cause to unexpected results.` });
            return { type: 'Error', message: 'No comments to the image provided.' }
        }
        if (!value || value == '' || value == undefined) {

            setShowWarningModal({ show: true, message: `You are trying to submit an empty message. It is not allowed.` });
            return { message: 'No message to send.', type: 'Error' }
        }

        return { type: 'Success', message: 'No warnings detected.' }
    }
    const createSystemMessage = () => {
        switch (replyFormat) {
            case 'Plain text':
                return systemMessage = promptTemplatesAPI.default({ replyTone, replyLength, replyStyle });
                break;
            case 'HTML':
                return systemMessage = promptTemplatesAPI.replyAsHTML({ replyTone, replyLength, replyStyle });
                break;
            default:
                return systemMessage = promptTemplatesAPI.default({ replyTone, replyLength, replyStyle });
                break;
        }
    }

    const createDiscussionContext = (arrayDataOfCurrentHistory) => {

        let arrayDiscussionContext = [{ role: 'user', content: arrayDataOfCurrentHistory[0].user.content }];

        switch (systemVersion) {
            case 'GPT-4':
                if (arrayDataOfCurrentHistory.length > 0) {
                    for (let i = 0; i <= arrayDataOfCurrentHistory.length - 1; i++) {
                        arrayDiscussionContext.push({ role: 'assistant', content: arrayDataOfCurrentHistory[i].assistant.content })
                    }
                }
                break;
            case 'GPT-3.5':
                if (arrayDataOfCurrentHistory.length >= 2) {
                    arrayDiscussionContext.push({ role: 'assistant', content: arrayDataOfCurrentHistory[arrayDataOfCurrentHistory.length - 2].assistant.content });
                    arrayDiscussionContext.push({ role: 'assistant', content: arrayDataOfCurrentHistory[arrayDataOfCurrentHistory.length - 1].assistant.content });
                }
                else {
                    arrayDiscussionContext.push({ role: 'assistant', content: arrayDataOfCurrentHistory[arrayDataOfCurrentHistory.length - 1].assistant.content });
                }

            default:
                arrayDiscussionContext.push({ role: 'assistant', content: arrayDataOfCurrentHistory[arrayDataOfCurrentHistory.length - 1].assistant.content });
                break;
        }

        return arrayDiscussionContext;
    }





    const createChatItemsAndAddToHistory = async ({ userContent, assistantContent, format, attachmentsArray }) => {

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



    const submitChatForm = async (value) => {

        let noWarnings = checkForWarnings(value);

        if (noWarnings.type == 'Success') {

            let discussionContext;
            let systemMessage;
            setIsLoading(true)
            systemMessage = createSystemMessage(systemMessage);

            // create prompts allows to create a conversation context
            if (history[historyId] && history[historyId].length > 0) {
                discussionContext = [systemMessage, ...createDiscussionContext(history[historyId])];
                discussionContext.push({ role: 'user', content: value })
            } else {
                discussionContext = [systemMessage, { role: 'user', content: value }];
            }

            // DEV emulator settings
            try {
                connectFunctionsEmulator(cloudFunctions, process.env.EXPO_PUBLIC_EMULATOR_PATH, 5001);
                // call "requestToAssistant" cloud function..
                const requestToAssistant = httpsCallable(cloudFunctions, 'requestToAssistant', { limitedUseAppCheckTokens: true });

                // return of the "requestToAssistant" result..
                return await requestToAssistant({ tokens: 4000, systemVersion, messagesArray: discussionContext })
                    .then((funcRespond) => {

                        if (funcRespond.data.type == 'Success') {
                            //  add to local history state and to show in UI
                            createChatItemsAndAddToHistory({ userContent: value, assistantContent: funcRespond.data.payload[0].message.content, format: replyFormat, attachmentsArray });
                        }
                        setIsLoading(false);
                        return { type: 'Success' }
                    })
            } catch (error) {
                console.log('error while trying to submitChatForm ')
                setIsLoading(false);
            }
        }
    }


    useEffect(() => {
        if (!historyId) {
            setHistoryId();
        }
    }, []);

    return (

        <>
            <WhiteBottomWrapper keyId={'cardChat'} route={route}>
                <OpacityWrapper keyId={'opacityChat'}>
                    <ChatInterface navigation={navigation} isLoading={isLoading} setShowModal={setShowModal} history={history} historyId={historyId} historyIndexes={historyIndexes} submitChatForm={submitChatForm} setShowZoomImage={setShowZoomImage} />
                </OpacityWrapper>
            </WhiteBottomWrapper>

            {/* modal windows */}
            {
                // new chat modal
                showModal &&
                <ModalContainer callbackCancel={() => setShowModal(false)} >
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
                // empty message modal
                showWarningModal.show &&
                <ModalContainer modalVisible={showWarningModal.show} callbackCancel={() => setShowWarningModal({ show: false, message: null })}>
                    <WarningModalContent
                        // message={'You are trying to send attachments only. There is no message/instruction provided, it may cause to unexpected results.'}
                        message={showWarningModal.message}
                        buttons={[{ title: 'OK', type: 'solid' }]}
                    />
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
    );
};

export default ChatContainer;
