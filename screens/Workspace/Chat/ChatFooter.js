import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const ChatFooter = ({ callback }) => {
    const [inputValue, setInputValue] = useState(null);
    const inputChangeHandler = (value) => {
        setInputValue(value);
    }

    const submitHandler = () => {
        callback(inputValue);
        setInputValue(null)
    }

    return (

        <View style={styles.chatFooter}>
            <View style={{ height: 1, backgroundColor: '#ececee', marginHorizontal: '5%', marginBottom: 5 }}></View>

            <View style={styles.chatInputContainer}>
                <View style={{ flex: 1 }}>
                    <TextInput style={styles.chatInput} placeholder='message..' value={inputValue} onChangeText={(value) => inputChangeHandler(value)} />
                </View>
                <View>
                    <TouchableOpacity style={{ transform: [{ 'rotate': '-25deg' }, { translateY: -2 }] }} onPress={submitHandler}>
                        <Ionicons name="send-sharp" size={24} color="#8b98b4" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default ChatFooter;

const styles = StyleSheet.create({
    chatFooter: {
        paddingHorizontal: 15,
        borderTopWidth: 0,
        borderTopColor: 'white'
    },
    chatInputContainer: {
        backgroundColor: '#ebebed',
        // backgroundColor: '#fafafc',
        borderColor: '#f2f6fc',
        borderWidth: 1,
        borderRadius: 20,
        height: 50,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        columnGap: 5
    },
    chatInput: {
        color: '#505051',
        borderWidth: 0,
        borderColor: 'black',
    },
})

