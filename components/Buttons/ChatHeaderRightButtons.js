import React from 'react';
import { TouchableOpacity } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { MotiView } from 'moti';

const ChatHeaderRightButtons = ({ color, onPressHistory, onPressNewChat }) => {
    return (
        <MotiView
            key={'chatHeaderRightButtons'}
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1000 }}
            style={{ backgroundColor: 'transparent', flexDirection: 'row', columnGap: 10, }}
        >

            <TouchableOpacity onPress={onPressNewChat}>
                <Ionicons name="create-outline" size={24} color={color} />
            </TouchableOpacity>

            <TouchableOpacity onPress={onPressHistory}>
                <Ionicons name="time-outline" size={24} color={color} />
            </TouchableOpacity>

        </MotiView>
    );
};

export default ChatHeaderRightButtons;