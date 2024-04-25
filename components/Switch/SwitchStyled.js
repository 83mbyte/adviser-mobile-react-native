import React from 'react';
import { Switch, View } from 'react-native';

const SwitchStyled = ({ value = false, onValueChange = null }) => {
    return (
        <View>
            <Switch
                trackColor={{ false: '#f0f0f0', true: '#fe3a59' }}
                thumbColor={'#f4f3f4'}
                ios_backgroundColor="#f0f0f0"
                onValueChange={onValueChange}
                value={value}
            />
        </View>
    );
};

export default SwitchStyled;