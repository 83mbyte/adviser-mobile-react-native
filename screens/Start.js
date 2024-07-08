import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { View } from 'react-native';

import AuthModal from './AuthModal/AuthModal';
import { useAuthContext } from '../context/AuthContextProvider';
import BackButtonHeader from '../components/Buttons/BackButtonHeader';
import Workspace from './Workspace/Workspace';
import ChatContainer from './Workspace/Chat/ChatContainer';
import HistoryContainer from './History/HistoryContainer';
import GenerateImagesContainer from './Workspace/GenerateImages/GenerateImagesContainer';
import SettingsContainer from './Workspace/Settings/SettingsContainer';
import SettingsOptions from './Workspace/Settings/SettingsOptions';
import ProfileSettings from './Workspace/Settings/ProfileSettings';
import HistoryImagesContainer from './History/HistoryImagesContainer';
import GetStarted from './GetStarted/GetStarted';

const COMMON_OPTIONS = {
    gestureDirection: 'vertical',
    headerShown: true,
    headerTransparent: true,
    headerTintColor: 'white',
};
const NAVIGATION_SCREENS = [
    {
        screenName: 'Chats',
        componentName: ChatContainer,
        headerTitle: 'Chat',
    },
    {
        screenName: 'Chat History',
        componentName: HistoryContainer,
        headerTitle: 'Chat History',
    },
    {
        screenName: 'Generate Images',
        componentName: GenerateImagesContainer,
        headerTitle: 'Generate Images',
    },
    {
        screenName: 'Images History',
        componentName: HistoryImagesContainer,
        headerTitle: 'Images History',
    },
    {
        screenName: 'Settings',
        componentName: SettingsContainer,
        headerTitle: 'Settings',
    },
    {
        screenName: 'Chat Settings',
        componentName: SettingsOptions,
        headerTitle: 'Chat Settings',
    },
    {
        screenName: 'Images Settings',
        componentName: SettingsOptions,
        headerTitle: 'Images Settings',
    },
    {
        screenName: 'Profile settings',
        componentName: ProfileSettings,
        headerTitle: 'Profile Settings',
    },

]

const RootStack = createNativeStackNavigator();

const Start = () => {
    const authState = useAuthContext();

    return (
        <View style={{ flex: 1 }}>

            <RootStack.Navigator initialRouteName='GetStarted'>

                <RootStack.Screen name="GetStarted" component={GetStarted} options={{
                    headerShown: false, gestureDirection: 'vertical'
                }} />
                {
                    (!authState?.data?.user)
                        ? <RootStack.Group screenOptions={{ headerShown: false }} >
                            <RootStack.Screen name="AuthModal" component={AuthModal} options={{ headerShown: false, gestureDirection: 'vertical' }} />
                        </RootStack.Group>
                        : <RootStack.Group screenOptions={{ gestureEnabled: false }} >
                            <RootStack.Screen name="Workspace" component={Workspace} options={{ headerShown: false, gestureDirection: 'vertical' }} />
                            {

                                NAVIGATION_SCREENS.map((screen, index) => {
                                    return (
                                        <RootStack.Screen key={`screen_${index}`} name={screen.screenName} component={screen.componentName}
                                            options={({ navigation, route }) => ({
                                                ...COMMON_OPTIONS,
                                                headerTitle: screen.headerTitle,
                                                headerLeft: () => <BackButtonHeader navigation={navigation} color={'white'} route={route} />,
                                            })}
                                        />
                                    )
                                })
                            }
                        </RootStack.Group>
                }

            </RootStack.Navigator>

        </View>
    );
};

export default Start;



