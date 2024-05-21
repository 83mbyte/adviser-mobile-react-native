import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSafeViewPadding from '../Wrappers/BottomSafeViewPadding';
import Ionicons from '@expo/vector-icons/Ionicons';
import animationLibrary from '../../lib/animationConfig';
import AnimatedViewWrapper from '../Wrappers/AnimatedViewWrapper';
const buttonsArray = [
    { label: 'Chats', screenTo: 'Chats', icon: { default: 'chatbubbles-outline', active: 'chatbubbles' } },
    { label: 'Images', screenTo: 'Generate Images', icon: { default: 'images-outline', active: 'images' } },
    {
        label: 'Settings',
        screenTo: 'Settings',
        icon: {
            default: 'settings-outline',
            active: 'settings',
        },
    }

];

const buttonsNumber = buttonsArray.length;

const enterTransition = animationLibrary.SlideFromBottom.entering;
const exitTransition = animationLibrary.SlideFromBottom.exiting;


const BottomNavigation = ({ navigation }) => {


    return (
        <AnimatedViewWrapper keyId='bottomNavigationView' entering={enterTransition.damping(20)} exiting={exitTransition.delay(150)}>

            <View style={styles.container}>
                <BottomSafeViewPadding>
                    <View style={styles.buttonsRow} >
                        {
                            buttonsArray.map((item, index) => {
                                return (
                                    <TouchableOpacity key={index} style={[styles.buttonContainer, { flex: 1 / buttonsNumber }]} onPress={() => navigation.navigate(item.screenTo)}>
                                        <Ionicons name={item.icon.default} size={22} color='#ff5456' />
                                        <Text>{item.label}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                </BottomSafeViewPadding >
            </View>

        </AnimatedViewWrapper >
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