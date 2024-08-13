import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import animationLibrary from '../../lib/animationConfig';
import ChatAttachmentItem from '../ChatAttachment/ChatAttachmentItem';
import { useAttachContext } from '../../context/AttachContextProvider';
import Loader from '../Loaders/Loader';
import BottomSafeViewPadding from '../Wrappers/BottomSafeViewPadding';

const layoutTransition = animationLibrary.layoutTransition.linear;

const FooterInteractionContainer = ({
    screenName = 'Chat',
    icon = 'send-sharp',
    // icon = 'send',
    placeholder = 'type here..',
    micButtonPress = null,
    isLoading,
    callback }) => {


    const attachContextData = useAttachContext();
    const attachmentsArray = attachContextData.data.attachmentsArray;


    const [inputValue, setInputValue] = useState(null);
    const [showAttachment, setShowAttachment] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const containerHeight = useSharedValue(0);

    const animatedStyles = useAnimatedStyle(() => ({
        height: withTiming(containerHeight.value, { duration: 500 }),
        borderWidth: 0
    }));

    const inputChangeHandler = (value) => {
        setInputValue(value);
    };

    const submitHandler = async () => {
        setButtonDisabled(true);
        try {
            let resp = await callback(inputValue.trim());
            if (resp && resp.status == 'Success') {
                if (screenName == 'Chat') {
                    attachContextData.clearAllItems();
                }
                setInputValue(null);
            }
            setButtonDisabled(false);
        } catch (error) {
            setButtonDisabled(false);
        }
    }

    useEffect(() => {
        if (attachmentsArray && attachmentsArray.length > 0) {
            setShowAttachment(true);
            containerHeight.value = 110;
        } else {
            containerHeight.value = 0;
        }
    }, [attachmentsArray]);

    useEffect(() => {
        // clear previously added attachments 
        attachContextData.clearAllItems();
    }, [])

    return (
        <BottomSafeViewPadding>

            <View style={styles.footerContainer}>
                <View style={styles.redLine}></View>
                <View style={styles.grayContainer}>
                    {
                        (screenName === 'Chat' && showAttachment) &&
                        <Animated.FlatList
                            style={animatedStyles}
                            data={attachmentsArray}
                            showsHorizontalScrollIndicator={false}
                            itemLayoutAnimation={layoutTransition}
                            keyExtractor={item => item.slice(-10, -4)}
                            horizontal={true}
                            renderItem={({ item }) => <ChatAttachmentItem key={item.slice(-10, -4)} attachment={item} clearItemCallback={() => attachContextData.deleteAttachment(item)} />}
                        >

                        </Animated.FlatList>

                    }
                    <View style={styles.dataInputContainer}>


                        {
                            isLoading
                                ? <Loader size={12} />

                                : <>
                                    <View style={{ flex: 1 }}>
                                        <TextInput style={[styles.dataInput, { color: buttonDisabled ? 'lightgray' : '#505051' }]} placeholder={placeholder} value={inputValue} onChangeText={(value) => inputChangeHandler(value)} multiline={true} editable={!buttonDisabled} />
                                    </View>
                                    {

                                        screenName === 'Chat'
                                            ?
                                            <View style={{ flexDirection: 'row', columnGap: 15 }}>



                                                <TouchableOpacity onPress={micButtonPress} style={styles.iconButton}>
                                                    <Ionicons name={'mic-sharp'} size={24} color={!buttonDisabled ? '#ff5456' : 'lightgray'} />
                                                </TouchableOpacity>

                                                <TouchableOpacity onPress={() => attachContextData.showAttachmentPicker(true)} style={styles.iconButton}>
                                                    <Ionicons name={'attach-sharp'} size={24} color={!buttonDisabled ? '#ff5456' : 'lightgray'} />
                                                </TouchableOpacity>

                                                <TouchableOpacity onPress={(!buttonDisabled) ? submitHandler : null} style={styles.iconButton}>
                                                    <Ionicons name={icon} size={24} color={!buttonDisabled ? '#ff5456' : 'lightgray'} />
                                                </TouchableOpacity>
                                            </View>
                                            :
                                            <View style={{ flexDirection: 'row', columnGap: 15 }}>
                                                <TouchableOpacity onPress={micButtonPress} style={styles.iconButton}>
                                                    <Ionicons name={'mic-sharp'} size={24} color={!buttonDisabled ? '#ff5456' : 'lightgray'} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={(!buttonDisabled) ? submitHandler : null} style={styles.iconButton}>
                                                    <Ionicons name={icon} size={24} color={!buttonDisabled ? '#ff5456' : 'lightgray'} />
                                                </TouchableOpacity>
                                            </View>

                                    }
                                </>
                        }


                    </View>
                </View>

            </View >
        </BottomSafeViewPadding>
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
    grayContainer: {
        backgroundColor: '#ebebed',
        borderColor: '#f2f6fc',
        borderWidth: 1,
        borderRadius: 20,
        minHeight: 50,
        padding: 10,
        //paddingRight: 5,

    },
    dataInputContainer: {

        // backgroundColor: '#fafafc',

        // borderRadius: 20,
        // minHeight: 50,
        borderWidth: 0,
        borderColor: 'green',
        alignItems: 'center',
        // alignItems: 'flex-end',
        justifyContent: 'center',
        flexDirection: 'row',
        columnGap: 0,
        padding: 0

    },
    dataInput: {
        color: '#505051',
        borderWidth: 0,
        minHeight: 25,
        paddingVertical: 5,
        borderColor: 'black',
        fontSize: 16
    },
    iconButton: { marginRight: 0, transform: [{ 'rotate': '5deg' }, { translateY: 0 }] }
})