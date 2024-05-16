import React from 'react';
import { TouchableOpacity } from 'react-native';

import { Fontisto } from '@expo/vector-icons';


const ImageActionButton = ({ icon, size = 18, color = "#ff5456", callback }) => {
    const onPressHandler = () => {
        callback(true);
    }

    return (
        <TouchableOpacity style={{ margin: 2, padding: 10, alignItems: 'center', justifyContent: 'center', }}
            onPress={onPressHandler}
        >
            <Fontisto name={icon} size={size} color={color} />
        </TouchableOpacity>
    )
};

export default ImageActionButton;

