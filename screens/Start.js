import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { View } from 'react-native';
import GetStarted from './GetStarted/GetStarted';
import AuthModal from './AuthModal/AuthModal';
import { useAuthContext } from '../context/AuthContextProvider';
import BackButtonHeader from '../components/Buttons/BackButtonHeader';
import Workspace from './Workspace/Workspace';
import ChatContainer from './Workspace/Chat/ChatContainer';
import ChatSettings from './Workspace/Settings/ChatSettings/ChatSettings';
import ImageSettings from './Workspace/Settings/ImageSettings/ImageSettings';
import HistoryContainer from './History/HistoryContainer';
import GenerateImagesContainer from './Workspace/GenerateImages/GenerateImagesContainer';



const RootStack = createNativeStackNavigator();
const commonOptions = {
    gestureDirection: 'vertical',
    headerShown: true,
    headerTransparent: true,
    headerTintColor: 'white',
}

const Start = () => {

    const authState = useAuthContext();

    return (
        <View style={{ flex: 1 }}>

            <RootStack.Navigator  >
                {
                    !authState.data.user
                        ?
                        <RootStack.Group screenOptions={{ headerShown: false, }} >
                            <RootStack.Screen name="GetStarted" component={GetStarted} />
                            <RootStack.Screen name="AuthModal"
                                component={AuthModal}
                                options={({ navigation }) => ({
                                    headerShown: false,
                                    presentation: 'transparentModal',
                                    // presentation: 'fullScreenModal',
                                    headerTransparent: true,
                                    headerTitle: '',
                                    headerLeft: () => <BackButtonHeader navigation={navigation} />
                                })} />

                        </RootStack.Group>
                        : <>
                            <RootStack.Screen name="Workspace" component={Workspace} options={{ headerShown: false, }} />
                            {
                                !authState.data.isSignout &&
                                <>
                                    <RootStack.Screen name="Chat"
                                        component={ChatContainer}

                                        options={({ navigation, route }) => ({
                                            ...commonOptions,
                                            headerTitle: 'Chat',
                                            headerLeft: () => <BackButtonHeader navigation={navigation} color={'white'} route={route} />,
                                        })}
                                    />

                                    <RootStack.Screen name="Chat History"
                                        component={HistoryContainer}

                                        options={({ navigation, route }) => ({
                                            ...commonOptions,
                                            headerTitle: 'Chat History',
                                            headerLeft: () => <BackButtonHeader navigation={navigation} color={'white'} route={route} />
                                        })}
                                    />
                                    <RootStack.Screen name="Chat Settings"
                                        component={ChatSettings}

                                        options={({ navigation, route }) => ({
                                            ...commonOptions,
                                            headerTitle: 'Chat Settings',
                                            headerLeft: () => <BackButtonHeader navigation={navigation} color={'white'} route={route} />
                                        })}
                                    />

                                    <RootStack.Screen name="Generate Images"
                                        component={GenerateImagesContainer}
                                        options={({ navigation, route }) => ({
                                            ...commonOptions,
                                            headerTitle: 'Generate Images',
                                            headerLeft: () => <BackButtonHeader navigation={navigation} color={'white'} route={route} />
                                        })}
                                    />

                                    <RootStack.Screen name="Image Settings"
                                        component={ImageSettings}

                                        options={({ navigation, route }) => ({
                                            ...commonOptions,
                                            headerTitle: 'Image Settings',

                                            headerLeft: () => <BackButtonHeader navigation={navigation} color={'white'} route={route} />
                                        })}
                                    />
                                </>
                            }

                        </>
                }
                {/* <RootStack.Group screenOptions={{ presentation: 'containedTransparentModal', }}>
                    <RootStack.Screen name="MyModal" component={ModalScreen} options={{ headerShown: false, }} />
                </RootStack.Group> */}

            </RootStack.Navigator>
        </View >
    );
};

export default Start;

