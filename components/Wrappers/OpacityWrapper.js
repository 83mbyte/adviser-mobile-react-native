import { useFocusEffect } from '@react-navigation/native';
import { MotiView, useAnimationState } from 'moti';
import React, { useCallback } from 'react';

const OpacityWrapper = ({ keyId, children }) => {


    const animationState = useAnimationState({
        from: { opacity: 0 },
        visible: { opacity: 1, transition: { delay: 1000, duration: 800 } },
        exit: { opacity: 0, transition: { delay: 0, duration: 100 } },

    })
    useFocusEffect(
        useCallback(() => {
            animationState.transitionTo('visible');

            return () => {
                animationState.transitionTo('exit');
            }

        }, [])
    )
    return (

        <MotiView key={keyId} state={animationState} style={{ flex: 1 }}  >
            {children}
        </MotiView>
    );
};

export default OpacityWrapper;