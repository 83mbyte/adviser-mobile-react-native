import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';

const ChatMessage = ({ message, type, attachments = null, setShowZoomImage }) => {

    if (message) {

        return (

            <View style={styles.rowContainer}>
                <View style={[styles.messageContainer, type === 'user' ? styles.userMessage : styles.assistantMessage]}>
                    {
                        attachments &&
                        attachments.map((item, index) => {
                            return (
                                <View style={{ flexDirection: 'column' }} key={index}>
                                    <TouchableOpacity onLongPress={() => setShowZoomImage({ show: true, imageSource: item })}>
                                        <Image source={{ uri: item }} style={{ width: 100, height: 100, marginBottom: 5 }} onError={() => alert('no image')} />
                                    </TouchableOpacity>
                                </View>
                            )
                        })

                    }
                    <View style={styles.rowContainer}>

                        <Text style={type == 'user' ? styles.userMessageText : styles.assistantMessageText}>
                            {message}
                        </Text>

                    </View>
                </View>
            </View >
        )
    }
    return null
}




export default ChatMessage;

const styles = StyleSheet.create({
    rowContainer: { flexDirection: 'row' },

    messageContainer: {
        minHeight: 50,
        borderWidth: 1,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 12,
        minWidth: '15%',
        width: 'auto',
        maxWidth: '95%'
    },
    userMessage: {
        backgroundColor: '#f0f0f0',
        borderColor: '#e7effb',
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 25,
    },
    userMessageText: {
        flexWrap: 'wrap',
        color: '#505051',
        textAlign: 'left',
    },
    assistantMessage: {
        backgroundColor: '#ff5456',
        borderColor: '#ff4a57',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 6,
    },
    assistantMessageText: {
        flexWrap: 'wrap',
        color: 'white',
        textAlign: 'right'
    },
})

