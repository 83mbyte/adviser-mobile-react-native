import React, { useCallback, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';

import animationLibrary from '../../lib/animationConfig';
import { useFocusEffect } from '@react-navigation/native';

const entering = animationLibrary.Stretch.entering;

const BackButtonHeader = ({ navigation, color = '#FFF', route }) => {
    const [show, setShow] = useState(true);

    const backClickHandler = () => {

        // backPromise().then(() => navigation.goBack());
        navigation.goBack()
    }
    // const backPromise = () => {
    //     return new Promise((resolve, reject) => {
    //         setShow(false);

    //         setTimeout(() => {
    //             resolve();
    //         }, 500);
    //     })
    // }

    useFocusEffect(
        useCallback(() => {
            setShow(true);
            return () => setShow(false);
        }, [route])
    )

    return (
        <View style={{ backgroundColor: 'transparent', minHeight: 25 }}>
            {
                show &&
                <Animated.View key={'back_btn_header'} entering={entering.delay(500)}  >
                    <Pressable onPress={backClickHandler}>
                        <Ionicons name="return-up-back" size={28} color={color} />
                    </Pressable>
                </Animated.View>
            }
        </View>
    )
}

export default BackButtonHeader;