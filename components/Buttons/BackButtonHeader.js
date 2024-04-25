import React, { useCallback } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from 'react-native';
import { MotiView, useAnimationState } from 'moti';
import { useFocusEffect } from '@react-navigation/native';

const BackButtonHeader = ({ navigation, color = '#FFF', route }) => {
    const backClickHandler = () => {

        backPromise().then(() => navigation.goBack());
    }

    const backPromise = () => {

        return new Promise((resolve, reject) => {
            animationState.transitionTo('exit');
            setTimeout(() => {
                resolve();
            }, 200)
        })
    }

    const animationState = useAnimationState({
        from: {
            scale: 1,
            opacity: 0,

        },
        to: {
            scale: 1,
            opacity: 1,
            transition: {
                delay: 1000
            }
        },
        exit: {
            scale: 0.8,
            opacity: 0,
            transition: {
                duration: 150
            }
        },
    })

    useFocusEffect(
        useCallback(() => {
            animationState.transitionTo('to');

            return () => {
                animationState.transitionTo('exit');
            };
        }, [route])
    )

    return (

        <MotiView key={'back_btn_header'} state={animationState}>
            <Pressable onPress={backClickHandler}>
                <Ionicons name="return-up-back" size={28} color={color} />
            </Pressable>
        </MotiView>

    )
}

export default BackButtonHeader;