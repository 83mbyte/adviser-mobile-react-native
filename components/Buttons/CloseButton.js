import React from 'react';
import { TouchableOpacity, } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
const CloseButton = ({ onPressCallback }) => {

    return (
        <TouchableOpacity onPress={onPressCallback}>
            <Ionicons name="close" size={22} color="#000" />
        </TouchableOpacity>
    );
};

export default CloseButton;
