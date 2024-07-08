import React, { useState } from 'react';
import { View, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, StyleSheet } from 'react-native';


import SignIn from '../../components/Forms/SignIn';
import SignUp from '../../components/Forms/SignUp';
import LogoApp from '../../components/LogoApp/LogoApp';
import TextButton from '../../components/Buttons/TextButton';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AnimatedViewWrapper from '../../components/Wrappers/AnimatedViewWrapper';
import animationLibrary from '../../lib/animationConfig';
const enterTransition = animationLibrary.Fade.entering;
const exitTransition = animationLibrary.Stretch.exiting;


const AuthModal = ({ navigation }) => {
    const ins = useSafeAreaInsets();
    const [page, setPage] = useState('Sign In');

    return (


        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, }} keyboardVerticalOffset={-120}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} >

                <View style={[styles.modalContainer, { paddingTop: ins.top, }]}>
                    <View style={{ flex: 1, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <AnimatedViewWrapper keyId='authLogoWrapper' entering={enterTransition.delay(100)} exiting={exitTransition}>
                            <LogoApp color='white' size={page == 'Sign In' ? 'lg' : 'sm'} />
                        </AnimatedViewWrapper>
                    </View>
                    <View style={styles.modalWhiteArea}>

                        {
                            page === 'Sign In'
                                ? <SignIn navigation={navigation} />
                                : <SignUp />
                        }

                        <View style={{ alignItems: 'center', marginTop: 10, paddingBottom: ins.bottom }}>
                            {
                                page === 'Sign In'
                                    ?
                                    <TextButton title='CREATE AN ACCOUNT' textColor='#fe3a59' callback={() => setPage('Sign Up')} />
                                    :
                                    <TextButton title='Already registered?' textColor='#fe3a59' callback={() => setPage('Sign In')} />
                            }
                        </View>
                    </View>

                </View >
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

    );
};

export default AuthModal;

const styles = StyleSheet.create({
    modalContainer: { alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'transparent', height: '100%' },
    modalWhiteArea: {
        backgroundColor: 'white', flexDirection: 'column', width: '100%', borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20,
        marginTop: 0,
    },
    // header: {
    //     flexDirection: 'column',
    //     marginBottom: 30
    // },
    // closeContainer: {
    //     alignItems: 'flex-end',
    //     height: 25,
    //     marginBottom: 10,
    //     justifyContent: 'center',
    // },

})