import React, { useState, useEffect } from 'react';
import ChatInterface from './ChatInterface';
import WhiteBottomWrapper from '../../../components/Wrappers/WhiteBottomWrapper';
import OpacityWrapper from '../../../components/Wrappers/OpacityWrapper';
import PopUpAnimated from '../../../components/Modals/PopUp/PopUpAnimated';
import { useHistoryContext } from '../../../context/HistoryContextProvider';



const ChatContainer = ({ navigation, route }) => {
    const historyContextData = useHistoryContext();
    const history = historyContextData.data.chatHistory.history;
    const historyId = historyContextData.data.chatHistory.currentId;

    const setHistoryId = (obj) => historyContextData.setHistoryId(obj);
    const addHistoryItem = (value) => historyContextData.addHistoryItem(value);

    const [showModal, setShowModal] = useState(false);

    const submitChatForm = (value) => {

        if (!historyId) {
            alert('something wrong..');
            return null
        }
        if (!value || value == '' || value == undefined) {
            alert('no message to send');
            return null
        }
        // DEV template data
        const userMessAndReply = { assistant: { content: 'Explicabo voluptatum veritatis temporibus ad voluptatibus officiis qu?', format: 'Lorem ipsum' }, user: { content: value } };

        // add to local history state
        addHistoryItem({ path: 'chatHistory', historyId, value: userMessAndReply });

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

        <WhiteBottomWrapper keyId={'cardChat'} route={route}>
            <OpacityWrapper keyId={'opacityChat'}>
                <ChatInterface navigation={navigation} setShowModal={setShowModal} history={history} historyId={historyId} submitChatForm={submitChatForm} />
            </OpacityWrapper>
            {
                showModal &&
                <PopUpAnimated
                    headerText='Start a New Chat'
                    message='By clicking AGREE, you will close the current chat and open a new one.'
                    callbackCancel={() => setShowModal(false)}
                    callbackAgree={() => {
                        setHistoryId({ path: 'chatHistory' });
                        setShowModal(false);
                    }}
                />
            }
        </WhiteBottomWrapper>
    );
};

export default ChatContainer;
