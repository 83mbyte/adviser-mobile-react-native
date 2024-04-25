import React, { useCallback } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AnimatePresence, MotiView, useAnimationState } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WhiteBottomWrapper = ({ keyId, route, children }) => {
    const ins = useSafeAreaInsets();

    const animationState = useAnimationState({
        from: { translateY: 1000 },
        visible: {
            translateY: 0,
            transition: {
                delay: 800,
                type: 'timing'
            }
        },
        exit: { translateY: 1000, transition: { type: 'spring' } }
    });


    useFocusEffect(
        useCallback(() => {
            animationState.transitionTo('visible');

            return () => {
                animationState.transitionTo('exit');
            };
        }, [route])
    )
    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} >
            <View style={[styles.container, { paddingTop: ins.top * 2 }]}>

                <AnimatePresence exitBeforeEnter>
                    <MotiView style={styles.whiteContainer} key={keyId} state={animationState} >
                        {children}
                    </MotiView>
                </AnimatePresence>
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
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingVertical: 25,
    },
})