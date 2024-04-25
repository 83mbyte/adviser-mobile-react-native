import React, { useCallback } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import TabBar from '../../components/TabBar/TabBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { MotiView, useAnimationState } from 'moti';
import HomeWorkspace from './Home/HomeWorkspace';
import ProfileWorkspace from './Profile/ProfileWorkspace';
import SettingsWorkspace from './Settings/SettingsWorkspace';

const BottomTab = createBottomTabNavigator();

const Workspace = () => {
    const ins = useSafeAreaInsets();

    return (

        <View style={{
            backgroundColor: 'transparent',
            flex: 1,
            paddingBottom: ins.bottom,
        }}>
            <BottomTab.Navigator
                initialRouteName='Home'
                screenOptions={

                    {
                        headerShown: false,
                        tabBarStyle: { backgroundColor: 'green', borderTopLeftRadius: 15, borderTopRightRadius: 15, borderWidth: 0 },

                    }
                }
                tabBar={(props) => <TabBar {...props} />}

            >
                <BottomTab.Screen component={AnimationWrapper} name='Profile' />
                <BottomTab.Screen component={AnimationWrapper} name='Home' />
                <BottomTab.Screen component={AnimationWrapper} name='Settings' />
            </BottomTab.Navigator>
        </View>
    );
};

export default Workspace;

const AnimationWrapper = ({ route, navigation }) => {
    const ins = useSafeAreaInsets();

    const animationState = useAnimationState({
        from: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
            transition: {
                delay: 400
            }
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 150
            }
        }
    })

    useFocusEffect(
        useCallback(() => {
            animationState.transitionTo('visible');

            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
                animationState.transitionTo('exit');
            };

        }, [route])
    )

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} >
            {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} > */}
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'white', marginBottom: 8, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, paddingTop: ins.top, paddingHorizontal: 15, paddingBottom: 5 }}>
                <MotiView state={animationState} key={`animate_${route.name}`} style={{ flex: 1, width: '100%', justifyContent: 'center' }}>
                    {
                        route.name == 'Home' &&
                        <HomeWorkspace navigation={navigation} />
                    }
                    {
                        route.name == 'Profile' &&

                        <ProfileWorkspace navigation={navigation} />

                    }
                    {
                        route.name == 'Settings' &&
                        <SettingsWorkspace navigation={navigation} />
                    }
                </MotiView>
            </View >
            {/* </TouchableWithoutFeedback> */}
        </KeyboardAvoidingView>
    )

}



const old = () => {

}