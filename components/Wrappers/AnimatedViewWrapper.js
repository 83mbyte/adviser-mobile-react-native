import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import Animated, { LinearTransition } from 'react-native-reanimated';

const AnimatedViewWrapper = ({ keyId = 'tempKeyId', entering, exiting, layoutTransition = LinearTransition, children }) => {

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
                <Animated.View key={keyId} entering={entering} exiting={exiting} layout={layoutTransition}>
                    {children}
                </Animated.View>
            }
        </>
    );
};

export default AnimatedViewWrapper;