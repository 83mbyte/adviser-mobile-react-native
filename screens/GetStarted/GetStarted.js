import React from 'react';
import { View, StyleSheet } from 'react-native';
import WhiteButton from '../../components/Buttons/WhiteButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LogoApp from '../../components/LogoApp/LogoApp';


const GetStarted = ({ navigation }) => {
    const ins = useSafeAreaInsets();

    const openModalHandler = (type) => {
        navigation.navigate('AuthModal', { type })
    }
    return (
        <View style={[styles.container, { paddingTop: ins.top }]}>
            <LogoApp />
            <View>
                <WhiteButton title='Get Started' variant={'solid'} callback={() => openModalHandler('Sign Up')} />
                <WhiteButton title='Sign In' variant={'link'} callback={() => openModalHandler('Sign In')} />
            </View>
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