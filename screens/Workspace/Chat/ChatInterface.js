import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import ChatMessage from './ChatMessage';
import ChatHeaderRightButtons from '../../../components/Buttons/ChatHeaderRightButtons';
import FooterInteractionContainer from '../../../components/FooterInteraction/FooterInteractionContainer';
import Animated, { Keyframe } from 'react-native-reanimated';




const ChatInterface = ({ navigation, isLoading, setShowModal, history, historyId, historyIndexes, submitChatForm }) => {
    const scrollRef = useRef(null);

    const renderMessages = (messageBlock, isLoading = false) => {

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
                </View>
            )
        }


    }

    //skeleton keyframe... temporal fix
    const keyframe = new Keyframe({
        0: {
            opacity: 1,
        },
        45: {
            opacity: 0.55,
        },
        75: {
            opacity: 0.25
        },
        100: {
            opacity: 0,
        },
    },).duration(1000);

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
            <View style={styles.chatBody}>

                <FlatList
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
                {
                    // SKELETON while loading replies...  
                    // TODO need to be moved to a Skeleton component
                    // and create normal animation
                    isLoading &&
                    <View style={[styles.messageBlock,]}>
                        <Animated.View style={{ width: '25%', height: 20, marginTop: 5, marginBottom: 5, backgroundColor: 'darkgray', borderRadius: 15 }} entering={keyframe}></Animated.View>
                        <View style={styles.messageAlignEnd}>

                            <Animated.View style={{ width: '55%', height: 55, marginTop: 5, marginBottom: 5, backgroundColor: 'darkgray', borderRadius: 15 }} entering={keyframe}></Animated.View>
                        </ View>
                    </View>
                }
            </View >

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

