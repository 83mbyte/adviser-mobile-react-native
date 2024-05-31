import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import ChatMessage from './ChatMessage';
import ChatHeaderRightButtons from '../../../components/Buttons/ChatHeaderRightButtons';
import FooterInteractionContainer from '../../../components/FooterInteraction/FooterInteractionContainer';



const ChatInterface = ({ navigation, setShowModal, history, historyId, submitChatForm }) => {
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
                    <View style={styles.messageAlignEnd}>
                        <ChatMessage message={messageBlock.assistant.content} type={'assistant'} />
                    </View>
                </View>)
        }
    }

    useEffect(() => {

        if (history && Object.keys(history).length > 0) {
            navigation.setOptions({
                headerRight: () => (
                    <ChatHeaderRightButtons
                        color='white'
                        onPressHistory={() => navigation.navigate('Chat History')}
                        onPressNewChat={() => setShowModal(true)}
                    />

                ),
            });
        }
    }, [navigation])

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
                    showsVerticalScrollIndicator={false}
                >
                </FlatList>
            </View>

            <FooterInteractionContainer screenName={'Chat'} callback={submitChatForm} />
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
    messageAlignEnd: { margin: 0, padding: 0, alignItems: 'flex-end' }
})

