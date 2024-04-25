import React from 'react';
import { Text, View } from 'react-native';

const ChatMessage = ({ message, type }) => {

    if (message) {

        return (

            <View style={{ flexDirection: 'row' }}>
                <View style={{
                    minHeight: 50,
                    backgroundColor: type == 'user' ? '#f0f0f0' : '#ff5456',
                    borderColor: type == 'user' ? '#e7effb' : '#ff4a57',
                    borderWidth: 1,
                    borderTopRightRadius: 15,
                    borderTopLeftRadius: 15,
                    borderBottomLeftRadius: type == 'user' ? 6 : 25,
                    borderBottomRightRadius: type == 'user' ? 25 : 6,
                    paddingHorizontal: 15,
                    paddingVertical: 12,
                    minWidth: '15%',
                    width: 'auto',
                    maxWidth: '95%'

                }}>
                    <View style={{ flexDirection: 'row', }}>

                        <Text style={{
                            flexWrap: 'wrap',
                            color: type == 'user' ? '#505051' : 'white',
                            textAlign: type == 'user' ? 'left' : 'right'
                        }}>{message}</Text>

                    </View>

                </View >
            </View >
        )
    }
    return null
}

export default ChatMessage;


