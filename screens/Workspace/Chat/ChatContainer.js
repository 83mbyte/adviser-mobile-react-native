import React, { useEffect, useReducer, useState, } from 'react';
import { useAttachContext } from '../../../context/AttachContextProvider';
import { useSettingsContext } from '../../../context/SettingsContextProvider';
import { useHistoryContext } from '../../../context/HistoryContextProvider';

import WhiteBottomWrapper from '../../../components/Wrappers/WhiteBottomWrapper';
import OpacityWrapper from '../../../components/Wrappers/OpacityWrapper';

import ModalContainer from '../../../components/Modals/ModalContainer';
import WarningModalContent from '../../../components/Modals/WarningModal/WarningModalContent';
import ChatHeaderRightButtons from '../../../components/Buttons/ChatHeaderRightButtons';
import ZoomImageModalContainer from '../../../components/Modals/ZoomImage/ZoomImageModalContainer';
import ImagePickerModalContent from '../../../components/Modals/ImagePicker/ImagePickerModalContent';
import ChatInterface from './ChatInterface';
import VocieRecordingModalContent from '../../../components/Modals/VoiceRecording/VoiceRecordingModalContent';
import CopyMessageModalContent from '../../../components/Modals/CopyMessageModal/CopyMessageModalContent';
import FooterInteractionContainer from '../../../components/FooterInteraction/FooterInteractionContainer';

import { chatUtility } from './lib/chatUtility';


const initialState = {
    showWarningModal: { showModal: false, message: null },
    showStartNewModal: { showModal: false },
    showZoomImage: { showModal: false, imageSource: null, imageSize: null },
    showVoiceRecording: { showModal: false, recordedUri: null },
    showCopyMessageModal: { showModal: false, message: null }
}

const reducer = (prevState, action) => {
    switch (action.type) {
        case 'TOGGLE-ZOOM-IMAGE':

            if (action.payload) {
                return { ...prevState, showZoomImage: action.payload }
            }
            return {
                ...prevState,
                showZoomImage: { showModal: false, imageSource: null, imageSize: null }
            }

        case 'TOGGLE-START-NEW':
            return {
                ...prevState,
                showStartNewModal: { showModal: action.payload || false }
            }

        case 'TOGGLE-WARNING-MODAL':
            return {
                ...prevState,
                showWarningModal: action.payload ? action.payload : { showModal: false, message: null }
            }

        case 'TOGGLE-VOICE-RECORDING':
            return {
                ...prevState,
                showVoiceRecording: action.payload ? action.payload : { showModal: false, recordedUri: null }
            }

        case 'TOGGLE-COPY-MESSAGE-MODAL':
            return {
                ...prevState,
                showCopyMessageModal: action.payload ? action.payload : { showModal: false, message: null }
            }
        default:
            return prevState;
    }
}


const ChatContainer = ({ navigation, route }) => {

    // local states
    const [streamData, setStreamData] = useState('');
    const [tempUserMessage, setTempUserMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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

    const [utilityState, dispatch] = useReducer(reducer, initialState);

    const submitPrompt = async (prompt) => {

        try {
            setIsLoading(true);
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
                            setIsLoading(false);
                            return { status: 'Success' };
                        }
                    )
                    .catch((error) => {
                        throw new Error(error.message);
                    });
            }


        } catch (error) {
            dispatch({ type: 'TOGGLE-WARNING-MODAL', payload: { showModal: true, message: error.message } });
            setTempUserMessage(null);
            setIsLoading(false);
        }
    }

    const transcribeAudio = async (uri) => {
        let filesData = uri.split('/');
        let ext = filesData[filesData.length - 1].split('.')[1];

        const formData = new FormData();
        formData.append('file', {
            uri: uri,
            name: `transcribe.${ext}`,
            type: `audio/${ext}`,
        });

        try {

            // PROD
            // return await fetch(process.env.EXPO_PUBLIC_EMULATOR_FUNC_TRANSCRIBE_PATH_PROD, {

            // DEV 
            return await fetch(process.env.EXPO_PUBLIC_EMULATOR_FUNC_TRANSCRIBE_PATH_DEV, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
                .then((res) => res.json())
                .then(resp => {
                    if (resp?.status !== 'Success') {
                        if (resp.message) {
                            throw new Error(`${resp.message}`);
                        } else {
                            throw new Error(`Error while trying to transcribe audio..`);
                        }
                    }

                    dispatch({ type: 'TOGGLE-VOICE-RECORDING' })
                    return { status: 'Success', payload: resp.payload };
                })
                .catch((error) => {
                    throw new Error(error.message);
                });

        } catch (error) {
            //console.log('erro in try catch   ', error);
            dispatch({ type: 'TOGGLE-VOICE-RECORDING' })
            throw new Error(error.message);
        }

    }

    const startNewButtonPress = (value) => {
        dispatch({ type: 'TOGGLE-START-NEW', payload: value || false })
    }

    const zoomButtonPress = (imageSource, imageSize) => {

        dispatch({
            type: 'TOGGLE-ZOOM-IMAGE',
            payload: { showModal: true, imageSource: imageSource, imageSize: imageSize }
        });
    };

    const micButtonPress = () => {
        dispatch({
            type: 'TOGGLE-VOICE-RECORDING',
            payload: { showModal: true, recordedUri: null }
        })
    }

    const copyMessageHandler = (message) => {
        dispatch({
            type: 'TOGGLE-COPY-MESSAGE-MODAL',
            payload: { showModal: true, message: message || null }
        });
    }


    useEffect(() => {
        if (!historyId) {
            setHistoryId();
        }
    }, []);

    useEffect(() => {

        const transcribeThenSubmit = async (recordedUri) => {

            try {
                setIsLoading(true);
                let res = await transcribeAudio(recordedUri);
                if (!res || res.status != 'Success') {
                    throw new Error(res?.message ? res.message : 'no results from transcribeAudio');
                }
                await submitPrompt(res.payload)
                if (isLoading == true) {
                    setIsLoading(false);
                }

            } catch (error) {
                // console.log('Error..'); 
                dispatch({ type: 'TOGGLE-WARNING-MODAL', payload: { showModal: true, message: error.message } });
                setIsLoading(false);
            }
        }

        if (utilityState.showVoiceRecording.recordedUri && utilityState.showVoiceRecording.recordedUri != undefined) {

            transcribeThenSubmit(utilityState.showVoiceRecording.recordedUri);
        }

    }, [utilityState.showVoiceRecording.recordedUri])

    useEffect(() => {
        // show buttons in header
        if (historyIndexes && Object.keys(historyIndexes).length > 0) {
            navigation.setOptions({

                headerRight: () => (
                    <ChatHeaderRightButtons
                        color='white'
                        onPressHistory={() => navigation.navigate('Chat History')}
                        onPressNewChat={() => startNewButtonPress(true)}
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

                    <ChatInterface submitPrompt={submitPrompt} setShowZoomImage={zoomButtonPress} tempUserMessage={tempUserMessage} streamData={streamData} history={history} historyId={historyId} copyMessageHandler={copyMessageHandler} />
                    <FooterInteractionContainer screenName={'Chat'} callback={submitPrompt} micButtonPress={micButtonPress} isLoading={isLoading} />


                </OpacityWrapper>
            </WhiteBottomWrapper>
            {/* Main end  */}


            {/* -------------------------------------------------- */}
            {/* --------- various MODALS/POPUPS elements --------- */}
            {/* -------------------------------------------------- */}

            {
                // popup notification about an error..
                utilityState.showWarningModal.showModal &&
                <ModalContainer modalVisible={utilityState.showWarningModal.showModal} callbackCancel={() => dispatch({ type: 'TOGGLE-WARNING-MODAL' })}>
                    <WarningModalContent
                        message={utilityState.showWarningModal.message}
                        buttons={[{ title: 'OK', type: 'solid' }]}
                    />
                </ModalContainer>
            }

            {
                // popup notification about a new chat creation
                utilityState.showStartNewModal.showModal &&
                <ModalContainer callbackCancel={() => startNewButtonPress(false)}>
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
                utilityState.showZoomImage.showModal &&

                <ZoomImageModalContainer modalVisible={utilityState.showZoomImage.showModal} callbackCancel={() => dispatch({ type: 'TOGGLE-ZOOM-IMAGE' })} imageSize={'1024x1024'} imageSource={utilityState.showZoomImage.imageSource}>
                </ZoomImageModalContainer>

            }
            {
                utilityState.showVoiceRecording.showModal &&
                <ModalContainer modalVisible={utilityState.showVoiceRecording.showModal} callbackCancel={() => dispatch({ type: 'TOGGLE-VOICE-RECORDING' })}>

                    <VocieRecordingModalContent setRecordedUri={(value) => dispatch({ type: 'TOGGLE-VOICE-RECORDING', payload: { showModal: false, recordedUri: value } })} />

                </ModalContainer>
            }

            {
                utilityState.showCopyMessageModal.showModal &&
                <ModalContainer
                    modalVisible={utilityState.showCopyMessageModal.showModal}
                    callbackCancel={() => dispatch({ type: 'TOGGLE-COPY-MESSAGE-MODAL' })}
                >
                    <CopyMessageModalContent message={utilityState.showCopyMessageModal.message} />
                </ModalContainer>
            }
        </>
    )
}

export default ChatContainer;