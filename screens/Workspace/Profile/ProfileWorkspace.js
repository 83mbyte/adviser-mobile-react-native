import React, { useReducer } from 'react';
import { Text, View, StyleSheet, ScrollView, } from 'react-native';
import RedButton from '../../../components/Buttons/RedButton';
import TextInputStyled from '../../../components/Forms/Inputs/TextInputStyled';
import { useAuthContext } from '../../../context/AuthContextProvider';
import Section from '../../../components/Section/Section';


const initialState = {
    email: null,
    subject: null,
    message: null
}

const reducer = (prevState, action) => {
    switch (action.type) {
        case 'SUBJECT':
            return {
                ...prevState,
                email: action.payload.userEmail,
                subject: action.payload.value
            }
        case 'MESSAGE':
            return {
                ...prevState,
                email: action.payload.userEmail,
                message: action.payload.value
            }
        case 'CLEAR_FORM':
            return {
                email: action.payload.userEmail,
                subject: null,
                message: null
            }

        default:
            break;
    }
}
const ProfileWorkspace = () => {

    const auth = useAuthContext();
    const user = auth.data.user;
    const signOut = auth.signOut;

    const [formState, dispatch] = useReducer(reducer, initialState);

    const updateFormState = (type, value) => {
        dispatch({ type, payload: { userEmail: user.email, value: value } });
    }



    const sendContactForm = () => {
        alert('Thank you');
        dispatch({ type: 'CLEAR_FORM', payload: { userEmail: user.email } });
    }

    const singOutHandler = async () => {
        await signOut();
    }
    return (


        <View style={styles.container}  >
            <ScrollView style={{ width: '100%' }}>

                <Section title={'User'}>
                    <View style={{ width: '100%', flexDirection: 'row', marginBottom: 10 }}>
                        <View style={{ flex: 1 / 4 }}>
                            <Text style={{ fontSize: 18 }}>Email: </Text>
                        </View>
                        <View style={{ flex: 3 / 4, alignItems: 'center' }}>
                            <Text style={{ fontSize: 16 }}>{user.email} </Text>
                        </View>
                    </View>
                    <View style={{ alignItems: 'center', marginVertical: 10 }}>
                        <RedButton title={'Sign out'} callback={singOutHandler} variant='solid' />
                    </View>

                </Section>

                <Section title='Get in touch' marginTop={20} animationDelayExtra={200}>
                    <View style={styles.formContainer}>

                        <TextInputStyled label={'Subject'} value={formState.subject} onChangeText={(val) => updateFormState('SUBJECT', val)} />
                        <TextInputStyled label={'Message'} value={formState.message} multiline={true} onChangeText={(val) => updateFormState('MESSAGE', val)} />

                        <View style={{ alignItems: 'center', }}>
                            <RedButton title={'Send'} callback={sendContactForm} variant='outline' />
                        </View>

                    </View>
                </Section>

            </ScrollView>
        </View>
    );
};

export default ProfileWorkspace;

const styles = StyleSheet.create({
    container: {
        borderWidth: 0,
        borderColor: '#ececee',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 2,
        borderRadius: 15,
        paddingHorizontal: 5,
        paddingVertical: 12,
        // minHeight: '100%',
        // flex: 1
    }
    ,
    signoutContainer: {
        backgroundColor: '#ececee',
        padding: 2
    },
    formContainer: {
        padding: 2,
        flexDirection: 'column',
        rowGap: 20,
        width: '100%'
    }
})


