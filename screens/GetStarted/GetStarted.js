import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import WhiteButton from '../../components/Buttons/WhiteButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const GetStarted = ({ navigation }) => {
    const ins = useSafeAreaInsets();

    const openModalHandler = (type) => {
        navigation.navigate('AuthModal', { type })
    }
    return (
        <View style={[styles.container, { paddingTop: ins.top }]}>
            <View>
                <View style={styles.logoContainer}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoCircleText}>H</Text>
                    </View>
                    <View style={styles.logoTextContainer}>
                        <Text style={styles.logoText}>{process.env.EXPO_PUBLIC_PROJECT_NAME || 'LIBERO'}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.logoTextRed}>({process.env.EXPO_PUBLIC_PROJECT_NAME_RED || 'fuga'})</Text>
                            <Text style={styles.logoTextRedSup}>{process.env.EXPO_PUBLIC_PROJECT_NAME_EDITION || 'ipsum'}</Text>
                        </View>
                    </View>
                </View>
            </View>

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

    logoContainer: {
        width: 210,
        alignItems: 'center'
    },
    logoCircle: {
        borderWidth: 2,
        borderColor: '#FFF',
        borderRadius: 90,
        padding: 0,
        width: 135,
        height: 135,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    logoCircleText: {
        color: '#FFF',
        fontSize: 64
    },
    logoTextContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoText: {
        color: '#FFF',
        fontSize: 34
    },
    logoTextRed: {
        color: '#ba0b23',
        fontWeight: '600'

    },
    logoTextRedSup: {
        color: '#ba0b23',
    },

})