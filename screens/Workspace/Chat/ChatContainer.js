import React, { useState, useEffect } from 'react';
import ChatInterface from './ChatInterface';
import WhiteBottomWrapper from '../../../components/Wrappers/WhiteBottomWrapper';
import OpacityWrapper from '../../../components/Wrappers/OpacityWrapper';
import { useHistoryContext } from '../../../context/HistoryContextProvider';

import { useAttachContext } from '../../../context/AttachContextProvider';
import { Image, Text, View } from 'react-native';
import WarningModalContent from '../../../components/Modals/WarningModal/WarningModalContent';

import ModalContainer from '../../../components/Modals/ModalContainer';
import ImagePickerModalContent from '../../../components/Modals/ImagePicker/ImagePickerModalContent';



const ChatContainer = ({ navigation, route }) => {
    const historyContextData = useHistoryContext();
    const history = historyContextData.data.chatHistory.history;
    const historyId = historyContextData.data.chatHistory.currentId;

    const setHistoryId = (obj) => historyContextData.setHistoryId(obj);
    const addHistoryItem = (value) => historyContextData.addHistoryItem(value);

    const [showModal, setShowModal] = useState(false);
    const [showWarningModal, setShowWarningModal] = useState(false);

    const attachContextData = useAttachContext();
    const attachmentsPickerModal = attachContextData.data.showPickerModal;
    const attachmentsArray = attachContextData.data.attachmentsArray;


    const submitChatForm = (value) => {

        if (!historyId) {
            alert('something wrong..');
            // TODO add modal warning
            // add modal warning
            return { type: 'Error', message: 'Something wrong..' }
        }
        if (attachmentsArray.length > 0 && (!value || value == '' || value == undefined)) {
            setShowWarningModal(true);
            return { type: 'Error', message: 'No comments to the image provided.' }
        }
        if (!value || value == '' || value == undefined) {
            alert('no message to send');
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
                            <Image source={{ uri: item }} style={{ width: 100, height: 100, }} />
                            <Text>{value}</Text>
                        </View>

                    )
                }
                ) : value
            }
        };

        // add to local history state
        addHistoryItem({ path: 'chatHistory', historyId, value: userMessAndReply });
        return ({ type: 'Success' })

        // TODO  
        // TODO create a submit to server to save history 
        // TODO   
    }


    useEffect(() => {
        if (!historyId) {
            setHistoryId({ path: 'chatHistory' });
        }
    }, []);

    return (

        <>
            <WhiteBottomWrapper keyId={'cardChat'} route={route}>
                <OpacityWrapper keyId={'opacityChat'}>
                    <ChatInterface navigation={navigation} setShowModal={setShowModal} history={history} historyId={historyId} submitChatForm={submitChatForm} />
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
                                callback: () => { setHistoryId({ path: 'chatHistory' }); attachContextData.clearAllItems(); }
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
                showWarningModal &&
                <ModalContainer modalVisible={showWarningModal} callbackCancel={() => setShowWarningModal(false)}>
                    <WarningModalContent
                        message={'You are trying to send attachments only. There is no message/instruction provided, it may cause to unexpected results.'}
                        buttons={[{ title: 'OK', type: 'solid' }]}
                    />
                </ModalContainer>
            }
        </>
    );
};

export default ChatContainer;
