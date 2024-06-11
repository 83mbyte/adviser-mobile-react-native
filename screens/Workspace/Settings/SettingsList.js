import React from 'react';
import { View, StyleSheet } from 'react-native';
import SettingsItemButton from '../../../components/Buttons/SettingsItemButton';

const data = [
    { id: 1, value: 'Chat settings', icon: 'chatbubbles-outline', iconColor: '#87CEEB', iconSize: 22 },
    { id: 2, value: 'Images settings', icon: 'images-outline', iconColor: '#5F9EA0', iconSize: 22 },
    { id: 3, value: 'Profile settings', icon: 'person-circle-outline', iconColor: '#A15F9E', iconSize: 22 },
];

const SettingsList = ({ navigation }) => {
    return (
        <>

            <View style={styles.cardBody}>

                <View style={styles.settingsItem}>

                    {
                        (data && data.length > 0) &&
                        data.map((item, index) => {
                            return <SettingsItemButton data={item} key={index} navigation={navigation} />
                        })
                    }
                </View>
            </View>
        </>
    );
};

export default SettingsList;



const styles = StyleSheet.create({
    cardBody: {
        paddingHorizontal: 10,
        flex: 1,
    },
    settingsItem: { backgroundColor: 'white', overflow: 'hidden', borderRadius: 10, rowGap: 2, marginBottom: 0 }
})