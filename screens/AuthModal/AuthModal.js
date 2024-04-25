import React from 'react';
import { View, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Pressable, StyleSheet } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

import SignIn from '../../components/Forms/SignIn';
import SignUp from '../../components/Forms/SignUp';
import TitleHeading from '../../components/TitleHeading/TitleHeading';

const AuthModal = ({ navigation, route }) => {

    const closeModal = () => {
        navigation.goBack();
    }
    return (


        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} keyboardVerticalOffset={-120}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                <View style={styles.modalContainer}>
                    <View style={styles.modalWhiteArea}>

                        <>
                            <View style={styles.header}>
                                <View style={styles.closeContainer}>
                                    <Pressable onPress={closeModal} >
                                        <Ionicons name="close" size={22} color="#000" />
                                    </Pressable>
                                </View>
                                <TitleHeading value={route.params.type} />
                            </View>

                            {/* form */}

                            <View >
                                {
                                    route.params.type == 'Sign Up'
                                        ? <SignUp />
                                        : <SignIn />
                                }
                            </View>

                        </>
                    </View>

                </View >
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

    );
};

export default AuthModal;

const styles = StyleSheet.create({
    modalContainer: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', backgroundColor: 'transparent', height: '100%' },
    modalWhiteArea: {
        backgroundColor: 'white', flexDirection: 'column', width: '100%', borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        padding: 20,
        marginTop: 15,
    },
    header: {
        flexDirection: 'column',
        marginBottom: 30
    },
    closeContainer: {
        alignItems: 'flex-end',
        height: 25,
        marginBottom: 10,

        justifyContent: 'center',

    },

})