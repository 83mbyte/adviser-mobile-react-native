import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SettingsItemButton = ({ data, navigation }) => {

    const onPressHandler = () => {
        let pathToNavigate;
        let settingsStatePath;
        switch (data.value) {
            case 'Chat settings':
                pathToNavigate = 'Chat Settings';
                settingsStatePath = 'chatSettings';
                break;

            case 'Images settings':
                pathToNavigate = 'Images Settings';
                settingsStatePath = 'imagesSettings';
                break;
            case 'Profile settings':
                pathToNavigate = 'Profile settings';
                settingsStatePath = 'profileSettings';

            default:
                break;
        }
        navigation.navigate(pathToNavigate, { settingsStatePath: settingsStatePath });
    }

    return (
        <TouchableOpacity style={styles.container} onPress={onPressHandler}
        >
            <View style={[styles.leftIconContainer, { backgroundColor: data.iconColor }]} >
                <Ionicons name={data.icon} size={data.iconSize} color="white" />
            </View>
            <View style={styles.textContainer}>
                <Text>{data.value}</Text>
            </View>
            <View>
                <Ionicons name="chevron-forward" size={20} color="gray" />
            </View>
        </TouchableOpacity>
    )
};

export default SettingsItemButton;


const styles = StyleSheet.create({
    container: { backgroundColor: 'rgba(0,0,0,0.025)', padding: 10, flexDirection: 'row', alignItems: 'center', },
    leftIconContainer: { padding: 5, borderRadius: 10 },
    textContainer: { flex: 1, marginHorizontal: 15 }
})