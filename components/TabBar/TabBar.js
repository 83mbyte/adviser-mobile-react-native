import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const buttonsArray = [
    { label: 'Profile', icon: { default: 'person-outline', active: 'person' } },


    { label: 'Home', icon: { default: 'home-outline', active: 'home' } },
    {
        label: 'Settings',
        icon: {
            default: 'settings-outline',
            active: 'settings',
        },
    },

]

const TabBar = ({ state, descriptors, navigation }) => {

    return (
        <View style={styles.container}>
            {
                buttonsArray.map((item, index) => {
                    return (
                        <TabButton label={item.label} icon={item.icon} navigation={navigation} key={index} isFocused={state.index == index} />
                    )
                })
            }

        </View>
    );
};

export default TabBar;

const TabButton = ({ icon, label, navigation, isFocused }) => {

    return (
        <View style={styles.tabButton}>
            <Pressable style={{ alignItems: 'center', rowGap: 5, }} onPress={() => navigation.navigate(label)} >
                <Ionicons name={isFocused ? icon.active : icon.default} size={28} style={isFocused ? styles.colors.active : styles.colors.default} />
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
                    {
                        isFocused
                            ? <Ionicons size={10} name={'ellipse'} style={[styles.colors.active, { paddingTop: 3 }]} />
                            : <Text style={isFocused ? styles.colors.active : styles.colors.default}>{label}</Text>
                    }
                </View>
            </Pressable>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        columnGap: 2,
        paddingHorizontal: 30,


    },
    tabButton: {
        flexDirection: 'column',
        alignItems: 'center',
        borderBottomWidth: 0,
        flex: 1 / 4,
        borderColor: 'white',
        padding: 1,
        borderRadius: 10,
    },

    colors: {
        active: { color: '#fcb1ae' },
        default: { color: 'white' }
    }
});

