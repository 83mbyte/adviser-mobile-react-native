import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const TextButton = ({ title = 'button text', textColor = '#fe3a59', callback }) => {

    return (
        <TouchableOpacity onPress={callback}>
            <Text style={{ color: textColor }}>{title}</Text>
        </TouchableOpacity>
    );
};

export default TextButton;