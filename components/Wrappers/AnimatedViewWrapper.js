import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import Animated from 'react-native-reanimated';

const AnimatedViewWrapper = ({ keyId = 'tempKeyId', entering, exiting, children }) => {

    const [show, setShow] = useState(false);



    useFocusEffect(
        useCallback(() => {
            setShow(true);
            return () => setShow(false);
        }, [])
    )
    return (
        <>
            {
                show &&
                <Animated.View key={keyId} entering={entering} exiting={exiting}>
                    {children}
                </Animated.View>
            }
        </>
    );
};

export default AnimatedViewWrapper;