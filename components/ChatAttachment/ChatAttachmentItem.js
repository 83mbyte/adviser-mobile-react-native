import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Animated, { } from 'react-native-reanimated';
import CloseButton from '../Buttons/CloseButton';

import animationLibrary from '../../lib/animationConfig';
const entering = animationLibrary.Stretch.entering;
const exiting = animationLibrary.Stretch.exiting;

const ChatAttachmentItem = ({ attachment, clearItemCallback }) => {
    const [show, setShow] = useState(true);

    const clearPromise = () => {
        return new Promise((resolve) => {
            setShow(false);
            setTimeout(() => {
                resolve();
            }, 500);
        })
    };

    const clearItemHandler = () => {
        clearPromise().then(() => clearItemCallback())
    }


    return (

        <>
            {
                show &&
                <Animated.View key={attachment.slice(-10, -4)} style={styles.container} entering={entering} exiting={exiting}  >
                    <Image
                        source={{ uri: attachment }}
                        style={styles.imageStyle} />
                    <View style={styles.badge}>
                        <CloseButton onPressCallback={clearItemHandler} />
                    </View>
                </Animated.View>
            }
        </>
    );

};

export default ChatAttachmentItem;

const styles = StyleSheet.create({
    container: { position: 'relative', width: 110, height: 110, },
    imageStyle: { width: 100, height: 100, margin: 5, borderWidth: 1, borderColor: '#FFF', borderRadius: 15, overflow: 'hidden' },
    badge: { position: 'absolute', top: 0, right: 0 }
})