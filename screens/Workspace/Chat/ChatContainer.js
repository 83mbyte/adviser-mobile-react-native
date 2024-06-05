import React, { useState, useEffect } from 'react';
import ChatInterface from './ChatInterface';
import WhiteBottomWrapper from '../../../components/Wrappers/WhiteBottomWrapper';
import OpacityWrapper from '../../../components/Wrappers/OpacityWrapper';
import { useHistoryContext } from '../../../context/HistoryContextProvider';

import { useAttachContext } from '../../../context/AttachContextProvider';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import WarningModalContent from '../../../components/Modals/WarningModal/WarningModalContent';

import ModalContainer from '../../../components/Modals/ModalContainer';
import ImagePickerModalContent from '../../../components/Modals/ImagePicker/ImagePickerModalContent';
import ZoomImageModalContent from '../../../components/Modals/ZoomImage/ZoomImageModalContent';




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

    const attachContextData = useAttachContext();
    const attachmentsPickerModal = attachContextData.data.showPickerModal;
    const attachmentsArray = attachContextData.data.attachmentsArray;


    const submitChatForm = (value) => {

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
        // DEV template data
        const userMessAndReply = {
            assistant: {
                content: 'Explicabo voluptatum veritatis temporibus ad voluptatibus officiis qu?', format: 'Lorem ipsum'
            },
            user: {
                content: attachmentsArray.length > 0 ? attachmentsArray.map((item, index) => {
                    return (

                        <View style={{ flexDirection: 'column' }} key={index}>
                            <TouchableOpacity onLongPress={() => setShowZoomImage({ show: true, imageSource: item })}><Image source={{ uri: item }} style={{ width: 100, height: 100, marginBottom: 5 }} /></TouchableOpacity>
                            <Text>{value}</Text>
                        </View>

                    )
                }
                ) : value
            }
        };

        // add to local history state
        addHistoryItem({ historyId, value: userMessAndReply });
        return ({ type: 'Success' })

        // TODO  
        // TODO create a submit to server to save history 
        // TODO   
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
                    <ChatInterface navigation={navigation} setShowModal={setShowModal} history={history} historyId={historyId} historyIndexes={historyIndexes} submitChatForm={submitChatForm} />
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
