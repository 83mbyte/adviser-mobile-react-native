import React from 'react';
import { TouchableOpacity } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import Animated from 'react-native-reanimated';
import animationLibrary from '../../lib/animationConfig';

const entering = animationLibrary.Stretch.entering;

const ImagesHeaderRightButtons = ({ color, onPressStartNew, isHistory, onSettingsButtonPress, onHistoryButtonPress }) => {
    return (
        <>

            <Animated.View
                key={'chatHeaderRightButtons'}
                style={{ backgroundColor: 'transparent', flexDirection: 'row', columnGap: 12, marginLeft: 12 }}
                entering={entering.delay(500)}
            >
                <TouchableOpacity onPress={onPressStartNew}>
                    <Ionicons name="create-outline" size={24} color={color} />
                </TouchableOpacity>
                {
                    isHistory && <TouchableOpacity onPress={onHistoryButtonPress}>
                        <Ionicons name="time-outline" size={24} color={color} />
                    </TouchableOpacity>
                }

                <TouchableOpacity onPress={onSettingsButtonPress}>
                    <Ionicons name="settings-outline" size={24} color={color} />
                </TouchableOpacity>

            </Animated.View>
        </>
    );
};

export default ImagesHeaderRightButtons;