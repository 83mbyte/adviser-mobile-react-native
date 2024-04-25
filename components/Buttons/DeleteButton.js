import React, { useMemo } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { MotiPressable } from 'moti/interactions';

const DeleteButton = ({ color = 'black', size = 24, onPress }) => {

    return (
        <MotiPressable
            onPress={onPress}
            animate={useMemo(
                () => ({ hovered, pressed }) => {
                    'worklet'

                    return {
                        opacity: hovered || pressed ? 0.25 : 1,

                    }
                },
                []
            )}

        >
            <Ionicons name="trash-outline" size={size} color={color} />
        </MotiPressable >

    );
};

export default DeleteButton;
