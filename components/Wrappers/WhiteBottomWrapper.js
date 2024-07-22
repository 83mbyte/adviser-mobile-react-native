import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WhiteBottomWrapper = ({ keyId, route, children }) => {
    const ins = useSafeAreaInsets();

    return (

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} >
            <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? ins.top * 2 : ins.top * 3 }]}>

                <View style={[styles.whiteContainer]}>
                    {children}
                </View>

            </View>
        </KeyboardAvoidingView>
    );
};

export default WhiteBottomWrapper;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    whiteContainer: {
        height: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: 25,
        // paddingVertical: 25,
    },
})