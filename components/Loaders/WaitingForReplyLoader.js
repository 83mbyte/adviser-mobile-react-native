import React, { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Loader from './Loader';



const WaitingForReplyLoader = ({ isLoading }) => {
    const heightShared = useSharedValue(0);

    const animatedContainerStyle = useAnimatedStyle(() => ({
        height: heightShared.value,
        overflow: 'hidden'
    }))

    useEffect(() => {
        if (isLoading == true) {
            heightShared.value = withTiming(85, { duration: 500 })
        } else {
            heightShared.value = withTiming(0, { duration: 250 })
        }
    }, [isLoading])
    return (
        <Animated.View style={animatedContainerStyle}>
            <Loader size={32} />
        </Animated.View>
    );
};

export default WaitingForReplyLoader;