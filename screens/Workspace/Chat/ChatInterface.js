import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import ChatMessage from './ChatMessage';
import ChatFooter from './ChatFooter';
import { useHistoryContext } from '../../../context/HistoryContextProvider';
import ChatHeaderRightButtons from '../../../components/Buttons/ChatHeaderRightButtons';
import PopUp from '../../../components/Modals/PopUp/PopUp';


import { modalsData } from '../../../lib/textData';

const ChatInterface = ({ navigation }) => {

    const [modalVisible, setModalVisible] = useState(false);

    const historyContextData = useHistoryContext();
    const history = historyContextData.data.chatHistory.history;
    const historyId = historyContextData.data.chatHistory.currentId;
    const setHistoryId = (obj) => historyContextData.setHistoryId(obj);
    const addHistoryItem = (value) => historyContextData.addHistoryItem(value);


    useEffect(() => {

        if (history && Object.keys(history).length > 0) {
            navigation.setOptions({
                headerRight: () => (
                    <ChatHeaderRightButtons
                        color='white'
                        onPressHistory={() => navigation.navigate('Chat History')}
                        onPressNewChat={() => setModalVisible(true)}
                    />

                ),
                // headerShown: false,
            });
        }
    }, [navigation])


    const scrollRef = useRef(null);


    const renderMessages = (messageBlock) => {
        if (!messageBlock.assistant) {
            return (
                <View style={styles.messageBlock}  >
                    <ChatMessage message={messageBlock.user.content} type={'user'} />
                </View>
            )
        } else {
            return (
                <View style={styles.messageBlock}  >
                    <ChatMessage message={messageBlock.user.content} type={'user'} />
                    <View style={{ margin: 0, padding: 0, alignItems: 'flex-end' }}>
                        <ChatMessage message={messageBlock.assistant.content} type={'assistant'} />
                    </View>
                </View>)
        }
    }

    const submitChatForm = (value) => {
        if (!historyId) {
            alert('something wrong..');
            return null
        }
        if (!value || value == '' || value == undefined) {
            alert('no message to send');
            return null
        }
        const userMessAndReply = { assistant: { content: 'Explicabo voluptatum veritatis temporibus ad voluptatibus officiis qu?', format: 'Lorem ipsum' }, user: { content: value } }
        addHistoryItem({ path: 'chatHistory', historyId, value: userMessAndReply })
    }


    useEffect(() => {
        if (!historyId) {
            setHistoryId({ path: 'chatHistory' });
        }
    }, []);

    return (

        <>
            <View style={styles.chatBody}>

                <FlatList
                    ref={(it) => (scrollRef.current = it)}
                    onContentSizeChange={() =>
                        scrollRef.current?.scrollToEnd({ animated: true })
                    }
                    data={
                        (history && Object.keys(history).length > 0) ? history[historyId] : []
                    }
                    renderItem={({ item }) => renderMessages(item)}
                    scrollsToTop={true}
                >
                </FlatList>
            </View>
            <ChatFooter callback={submitChatForm} />
            <PopUp headerText={modalsData.newChat.headerText} message={modalsData.newChat.message} modalVisible={modalVisible} setModalVisible={setModalVisible} setHistoryId={setHistoryId} />
        </>
    )
}

export default ChatInterface;



const styles = StyleSheet.create({

    chatHeader: {

    },

    chatBody: {
        paddingHorizontal: 20,
        rowGap: 1,
        flex: 1,
    },

    messageBlock: {
        flexDirection: 'column',
        marginBottom: 30,
        rowGap: 15,
    },
    //


})

