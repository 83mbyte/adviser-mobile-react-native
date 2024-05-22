import React from 'react';
import { TouchableOpacity } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import Animated from 'react-native-reanimated';
import animationLibrary from '../../lib/animationConfig';

const entering = animationLibrary.Stretch.entering;

const ChatHeaderRightButtons = ({ color, onPressHistory, onPressNewChat }) => {
    return (

        <>
            <Animated.View
                key={'chatHeaderRightButtons'}
                style={{ backgroundColor: 'transparent', flexDirection: 'row', columnGap: 10, }}
                entering={entering.delay(500)}
            >
                <TouchableOpacity onPress={onPressNewChat}>
                    <Ionicons name="create-outline" size={24} color={color} />
                </TouchableOpacity>

                <TouchableOpacity onPress={onPressHistory}>
                    <Ionicons name="time-outline" size={24} color={color} />
                </TouchableOpacity>
            </Animated.View>
        </>
    );
};

export default ChatHeaderRightButtons;