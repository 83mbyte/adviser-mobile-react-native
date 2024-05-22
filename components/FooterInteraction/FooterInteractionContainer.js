import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const FooterInteractionContainer = ({
    icon = 'send-sharp',
    // icon = 'send',
    placeholder = 'type here..',
    callback }) => {

    const [inputValue, setInputValue] = useState(null);

    const inputChangeHandler = (value) => {
        setInputValue(value);
    };

    const submitHandler = () => {
        callback(inputValue);
        setInputValue(null);
    }

    return (
        <View style={styles.footerContainer}>
            <View style={styles.redLine}></View>

            <View style={styles.dataInputContainer}>
                <View style={{ flex: 1 }}>
                    <TextInput style={styles.dataInput} placeholder={placeholder} value={inputValue} onChangeText={(value) => inputChangeHandler(value)} />
                </View>
                <View>
                    <TouchableOpacity onPress={submitHandler} style={styles.iconSendButton}>
                        <Ionicons name={icon} size={24} color="#8b98b4" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default FooterInteractionContainer;



const styles = StyleSheet.create({
    footerContainer: {
        paddingHorizontal: 15,
        // paddingTop: 15,
        borderTopWidth: 0,
        borderTopColor: 'red'
    },
    redLine: { height: 2, backgroundColor: '#fe3a59', marginHorizontal: '5%', marginBottom: 10, },
    dataInputContainer: {
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
    dataInput: {
        color: '#505051',
        borderWidth: 0,
        borderColor: 'black',
    },
    iconSendButton: { marginRight: 10, transform: [{ 'rotate': '5deg' }, { translateY: 0 }] }
})