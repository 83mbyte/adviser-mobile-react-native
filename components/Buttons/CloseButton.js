import React from 'react';
import { TouchableOpacity, } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
const CloseButton = ({ onPressCallback }) => {

    return (
        // as grey color close button
        // <TouchableOpacity onPress={onPressCallback} style={{ backgroundColor: '#F1F1F1', borderRadius: 15, padding: 2 }}>
        // <Ionicons name="close" size={18} color='#B5B5B5' /> 
        // </TouchableOpacity >

        <TouchableOpacity onPress={onPressCallback} style={{ backgroundColor: '#ff5456', borderRadius: 15, padding: 2 }}>
            <Ionicons name="close" size={18} color='white' />
        </TouchableOpacity>
    );
};

export default CloseButton;
