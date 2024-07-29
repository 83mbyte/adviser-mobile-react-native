import React, { useRef } from 'react';
import Animated from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import { uid } from 'uid';

import FooterInteractionContainer from '../../../components/FooterInteraction/FooterInteractionContainer';
import ChatMessage from './ChatMessage';


const ChatInterface = ({ history, historyId, tempUserMessage, streamData, submitPrompt, setShowZoomImage, setShowVoiceRecording, isLoading }) => {

    const scrollRef = useRef(null);

    return (

        <>
            {/* Chat body */}
            <Animated.View style={styles.container}>
                <Animated.ScrollView
                    showsVerticalScrollIndicator={false}
                    ref={(it) => (scrollRef.current = it)}
                    onContentSizeChange={() =>
                        scrollRef.current?.scrollToEnd({ animated: true })
                    }
                >

                    {
                        (history && Object.keys(history).length > 0)
                            ?

                            history[historyId]
                                ? history[historyId].map((item,) => {

                                    if (!item.assistant && !item.user) {
                                        return null
                                    }
                                    else if (!item.assistant) {
                                        return <ChatMessage type={'user'} message={item.user.content} key={uid()} />
                                    } else {
                                        return (
                                            <Animated.View key={uid()} style={styles.messagesBlock}>
                                                <ChatMessage type={'user'} message={item.user.content} key={uid()} attachments={item.user.showAttachments} setShowZoomImage={setShowZoomImage} />
                                                <ChatMessage type={'assistant'} format={item.assistant.format} message={item.assistant.content} key={uid()} />
                                            </Animated.View>
                                        )
                                    }
                                })
                                : null

                            : null
                    }


                    {
                        tempUserMessage &&
                        <ChatMessage type={'user'} message={tempUserMessage.user.content} key={uid()} />
                    }

                    {
                        (streamData && streamData != '') &&
                        <ChatMessage type={'assistant'} message={streamData + '...'} key={'streaming_text_' + uid()} />
                    }
                </Animated.ScrollView>
            </Animated.View>
            {/* Chat body  end*/}

            {/* Footer */}
            <FooterInteractionContainer screenName={'Chat'} callback={submitPrompt} setShowVoiceRecording={setShowVoiceRecording} isLoading={isLoading} />
        </>
    );
};

export default ChatInterface;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingBottom: 2,
        rowGap: 1,
        flex: 1,
    },

    messagesBlock: { marginVertical: 3 }
})