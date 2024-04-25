import React, { useCallback } from 'react';
import { View } from 'react-native';
import TitleHeading from '../TitleHeading/TitleHeading';
import { MotiView, useAnimationState } from 'moti';
import { useFocusEffect } from '@react-navigation/native';

const Section = ({ title = 'default title', marginTop = 0, animationDelayExtra = 0, children }) => {

    const animationState = useAnimationState({
        from: {
            opacity: 0,
            scale: 0.4
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                delay: 800 + animationDelayExtra,
                duration: 900,
                type: 'timing'
            }
        },
        exit: {
            opacity: 0,
            scale: 0.4,
            transition: {
                duration: 150
            }
        }
    })

    useFocusEffect(
        useCallback(() => {
            animationState.transitionTo('visible');

            return () => {
                animationState.transitionTo('exit');
            };

        }, [])
    )

    return (
        <MotiView state={animationState} key={`${title}_section`}  >
            <View style={{ borderBottomColor: '#f0f0f0', borderBottomWidth: 0, paddingBottom: 40, marginTop: marginTop, }}>
                <View style={{ marginBottom: 30, marginTop: 10 }}>
                    <TitleHeading value={title} />
                </View>

                {children}

            </View>
        </MotiView>
    )
}

export default Section;