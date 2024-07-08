import React from 'react';
import { View, StyleSheet } from 'react-native';
import WhiteButton from '../../components/Buttons/WhiteButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LogoApp from '../../components/LogoApp/LogoApp';
import { useAuthContext } from '../../context/AuthContextProvider';
import AnimatedViewWrapper from '../../components/Wrappers/AnimatedViewWrapper';
import animationLibrary from '../../lib/animationConfig';
const enterTransition = animationLibrary.Stretch.entering;
const exitTransition = animationLibrary.Stretch.exiting;


const GetStarted = ({ navigation, route }) => {
    const ins = useSafeAreaInsets();
    const userContextData = useAuthContext();

    const lauchButtonHandler = () => {

        if (userContextData.data?.user?.uid && !userContextData.data.isSignout) {
            navigation.navigate('Workspace');
        } else {
            navigation.navigate('AuthModal');
        }
    }

    return (
        <View style={[styles.container, { paddingTop: ins.top }]}>
            <LogoApp route={route} color='white' size='lg' />
            <AnimatedViewWrapper keyId='launchButtonWrapper' entering={enterTransition} exiting={exitTransition}>
                <WhiteButton title='Launch' variant={'solid'} callback={() => lauchButtonHandler()} />
            </AnimatedViewWrapper>

        </View>
    );
};


export default GetStarted;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center'
    },


})