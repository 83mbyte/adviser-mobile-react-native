import React from 'react';
import { View } from 'react-native';
import RedButton from '../../../components/Buttons/RedButton';

const buttons = [
    { label: 'Chat Settings' },
    { label: 'Image Settings' },
]

const SettingsWorkspace = ({ navigation }) => {
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {
                buttons.map((item, index) => {
                    return (
                        <View key={index} style={{ marginBottom: 10 }}>

                            <RedButton title={item.label} callback={() => navigation.navigate(item.label)} />
                        </View>
                    )
                })
            }
        </View>
    );
};

export default SettingsWorkspace;
