import React, { useReducer } from 'react';
import { StyleSheet, View } from 'react-native';
import RedButton from '../Buttons/RedButton';
import { useAuthContext } from '../../context/AuthContextProvider';
import TextInputStyled from './Inputs/TextInputStyled';
import AnimatedViewWrapper from '../Wrappers/AnimatedViewWrapper';

import animationLibrary from '../../lib/animationConfig';

const enterTransition = animationLibrary.Stretch.entering;
const exitTransition = animationLibrary.Stretch.exiting;


const emailPattern = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/);
const initialState = {
    email: { isValid: true, value: null },
    password: { isValid: true, value: null }
}

const reducer = (prevState, action) => {
    switch (action.type) {
        case 'EMAIL':
            let emailString = action.payload;
            emailString = emailString.toLowerCase();
            if (emailPattern.test(emailString)) {
                return {
                    ...prevState,
                    email: {
                        isValid: true,
                        value: emailString
                    }
                };
            } else {
                return {
                    ...prevState,
                    email: {
                        isValid: false,
                        value: emailString
                    }
                };
            }

        case 'PASSWORD':
            let passwordString = action.payload;
            if (passwordString && passwordString.length > 5) {
                return {
                    ...prevState,
                    password: {
                        isValid: true,
                        value: passwordString
                    }
                };
            } else {
                return {
                    ...prevState,
                    password: {
                        isValid: false,
                        value: passwordString
                    }
                }
            }

        default:
            return prevState;
    }
}



const SignIn = () => {
    const { signIn } = useAuthContext();

    const [formState, dispatch] = useReducer(reducer, initialState);

    const updateFormState = (type, value) => {
        dispatch({ type, payload: value });
    }

    const submitHandler = async () => {
        if ((formState.email.isValid && formState.email.value) && (formState.password.isValid && formState.password.value)) {
            await signIn(formState.email.value, formState.password.value);
        }
    }

    return (
        <AnimatedViewWrapper keyId={'signInForm'} entering={enterTransition.delay(100)} exiting={exitTransition}>
            <View style={styles.container} >
                <TextInputStyled label='Email' value={formState.email.value} keyboardType={'email-address'} onChangeText={(val) => updateFormState('EMAIL', val)} isValid={formState.email.isValid} errorText={'incorrect email'} />
                <TextInputStyled label='Password' value={formState.password.value} secureTextEntry={true} onChangeText={(val) => updateFormState('PASSWORD', val)} isValid={formState.password.isValid} errorText={'must be at least 6 chars long'} />

                <View style={styles.buttonsContainer}>
                    <RedButton title='Sign In' variant='solid' callback={submitHandler} />
                </View>



            </View>
        </AnimatedViewWrapper>
    );
};

export default SignIn;

const styles = StyleSheet.create({
    container: {

        flexDirection: 'column',
        rowGap: 20
    },
    buttonsContainer: {
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 10
    }
})