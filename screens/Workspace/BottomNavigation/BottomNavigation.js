import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import BottomSafeViewPadding from '../../../components/Wrappers/BottomSafeViewPadding';
import Ionicons from '@expo/vector-icons/Ionicons';
const buttonsArray = [
    { label: 'Chats', screen: 'Chats', icon: { default: 'chatbubbles-outline', active: 'chatbubbles' } },
    { label: 'Images', screen: 'Generate Images', icon: { default: 'images-outline', active: 'images' } },
    {
        label: 'Settings',
        screen: 'Settings',
        icon: {
            default: 'settings-outline',
            active: 'settings',
        },
    }

];

const buttonsNumber = buttonsArray.length;

const BottomNavigation = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <BottomSafeViewPadding>
                <View style={styles.buttonsRow} >
                    {
                        buttonsArray.map((item, index) => {
                            return (
                                <TouchableOpacity key={index} style={[styles.buttonContainer, { flex: 1 / buttonsNumber }]} onPress={() => navigation.navigate(item.screen)}>
                                    <Ionicons name={item.icon.default} size={22} color='#ff5456' />
                                    <Text>{item.label}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </BottomSafeViewPadding >
        </View >
    );
};

export default BottomNavigation;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingTop: 20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    buttonContainer: { backgroundColor: 'transparent', alignItems: 'center', rowGap: 5, marginHorizontal: 5, padding: 2 }
})