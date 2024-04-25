import React from 'react';
import { View } from 'react-native';

const DividerStyled = ({ color = '#fe3a59' }) => {
    return (
        <View style={{ alignItems: 'center', marginVertical: 10, marginHorizontal: 10 }}>
            <View style={{ backgroundColor: color, height: 1, width: '30%', opacity: 0.1 }}>
            </View>
        </View>
    );
};

export default DividerStyled;