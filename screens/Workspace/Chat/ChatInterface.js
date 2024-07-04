import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import ChatMessage from './ChatMessage';
import ChatHeaderRightButtons from '../../../components/Buttons/ChatHeaderRightButtons';
import FooterInteractionContainer from '../../../components/FooterInteraction/FooterInteractionContainer';
import Animated, { LinearTransition } from 'react-native-reanimated';
import WaitingForReplyLoader from '../../../components/Loaders/WaitingForReplyLoader';



const ChatInterface = ({ navigation, isLoading, setShowModal, history, historyId, historyIndexes, submitChatForm, setShowZoomImage }) => {
    const scrollRef = useRef(null);


    const renderMessages = (messageBlock, isLoading = false) => {

        if (!messageBlock.assistant) {
            return (
                <View style={styles.messageBlock}  >
                    <ChatMessage message={messageBlock.user.content} type={'user'} attachments={messageBlock.user.showAttachments} setShowZoomImage={setShowZoomImage} />
                </View>
            )
        } else {
            return (
                <View style={styles.messageBlock}  >
                    <ChatMessage message={messageBlock.user.content} type={'user'} attachments={messageBlock.user.showAttachments} setShowZoomImage={setShowZoomImage} />
                    <View style={styles.messageAlignEnd}>
                        <ChatMessage message={messageBlock.assistant.content} type={'assistant'} setShowZoomImage={setShowZoomImage} />
                    </View>
                </View>
            )
        }


    }


    useEffect(() => {

        if (historyIndexes && Object.keys(historyIndexes).length > 0) {
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

            <Animated.View style={styles.chatBody} layout={LinearTransition}>

                <FlatList
                    contentContainerStyle={{ justifyContent: 'flex-end', flexGrow: 1 }}
                    ref={(it) => (scrollRef.current = it)}
                    onContentSizeChange={() =>
                        scrollRef.current?.scrollToEnd({ animated: true })
                    }
                    data={
                        (history && Object.keys(history).length > 0) ? history[historyId] : []
                    }
                    renderItem={({ item }) => renderMessages(item, isLoading)}
                    scrollsToTop={true}
                    showsVerticalScrollIndicator={false}
                >
                </FlatList>

                {/* Loader while waiting AI response */}
                <WaitingForReplyLoader isLoading={isLoading} />
            </Animated.View >

            <FooterInteractionContainer screenName={'Chat'} callback={submitChatForm} />
        </>
    )
}

export default ChatInterface;



const styles = StyleSheet.create({

    chatHeader: {
    },

    chatBody: {
        paddingHorizontal: 15,
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

