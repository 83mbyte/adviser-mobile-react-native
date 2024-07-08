import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import animationLibrary from '../../lib/animationConfig';
import AnimatedViewWrapper from '../Wrappers/AnimatedViewWrapper';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, } from 'react-native-reanimated';

const enterTransition = animationLibrary.Stretch.entering;
const exitTransition = animationLibrary.Stretch.exiting;

const logoContainerSize = {
    sm: { width: 125, height: 125 },
    md: { width: 210, height: 210 },
    lg: { width: 225, height: 225 },
}

const logoCircleSize = {
    sm: { width: 85, height: 85 },
    md: { width: 135, height: 135 },
    lg: { width: 145, height: 145 },
}
const logoCircleText = {
    sm: { fontSize: 42 },
    md: { fontSize: 64 },
    lg: { fontSize: 72 },
};

const logoTextSize = {
    sm: { fontSize: 16 },
    md: { fontSize: 34 },
    lg: { fontSize: 42 },
}

const logoTextRedSize = {
    sm: { fontSize: 8 },
    md: { fontSize: 12 },
    lg: { fontSize: 16 },
}

const logoTextRedSupSize = { ...logoTextRedSize };

const LogoApp = ({ color = '#fe3a59', size = 'sm', subTextColor = '#ba0b23', delay = 100 }) => {

    const circleTextSharedValue = useSharedValue(logoCircleText[size]);
    const animatedCircleText = useAnimatedStyle(() => {
        return { fontSize: withSpring(circleTextSharedValue.value.fontSize, { stiffness: 100, overshootClamping: true }) }
    });

    const logoCircleSharedValue = useSharedValue(logoCircleSize[size]);
    const animatedLogoCircle = useAnimatedStyle(() => {
        return { width: withSpring(logoCircleSharedValue.value.width, { damping: 4, mass: 0.8 }), height: withSpring(logoCircleSharedValue.value.height, { damping: 4, mass: 0.8 }) }
    });

    const logoTextSizeSharedValue = useSharedValue(logoTextSize[size]);
    const animatedLogoTextSize = useAnimatedStyle(() => {
        return { fontSize: withSpring(logoTextSizeSharedValue.value.fontSize, { damping: 10, mass: 1, overshootClamping: true }) }
    });

    const logoTextRedSizeSharedValue = useSharedValue(logoTextRedSize[size]);
    const logoTextRedSupSizeSharedValue = useSharedValue(logoTextRedSupSize[size]);

    const animatedLogoTextRedSize = useAnimatedStyle(() => {
        return { fontSize: withSpring(logoTextRedSizeSharedValue.value.fontSize, { damping: 10, mass: 1, overshootClamping: true }) }
    })
    const animatedLogoTextRedSupSize = useAnimatedStyle(() => {
        return { fontSize: withSpring(logoTextRedSupSizeSharedValue.value.fontSize, { damping: 10, mass: 1, overshootClamping: true }) }
    })

    useEffect(() => {

        circleTextSharedValue.value = logoCircleText[size];
        logoCircleSharedValue.value = logoCircleSize[size];
        logoTextSizeSharedValue.value = logoTextSize[size];
        logoTextRedSizeSharedValue.value = logoTextRedSize[size];
        logoTextRedSupSizeSharedValue.value = logoTextRedSupSize[size];


    }, [size])

    return (
        <AnimatedViewWrapper keyId={'logoAppView'} entering={enterTransition.delay(delay)} exiting={exitTransition}>

            <Animated.View style={[{ alignItems: 'center', justifyContent: 'space-around', }]}>
                <View style={[styles.logoContainer, logoContainerSize[size]]}>
                    <Animated.View style={[styles.logoCircle, animatedLogoCircle, { borderColor: color }]}>
                        <Animated.Text style={[animatedCircleText, { color: color }]}>H</Animated.Text>
                    </Animated.View>
                    <View style={styles.logoTextContainer}>
                        <Animated.Text style={[animatedLogoTextSize, { color: color }]}>{process.env.EXPO_PUBLIC_PROJECT_NAME || 'LIBERO'}</Animated.Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Animated.Text style={[animatedLogoTextRedSize, { color: subTextColor, fontWeight: 600 }]}>({process.env.EXPO_PUBLIC_PROJECT_NAME_RED || 'fuga'})</Animated.Text>
                            <Animated.Text style={[animatedLogoTextRedSupSize, { color: subTextColor }]}>{process.env.EXPO_PUBLIC_PROJECT_NAME_EDITION || 'ipsum'}</Animated.Text>
                        </View>
                    </View>
                </View>
            </Animated.View>

        </AnimatedViewWrapper>

    );
};

export default LogoApp;


const styles = StyleSheet.create({
    logoContainer: {
        //width: 210,
        alignItems: 'center',
        marginBottom: 0,
    },
    logoCircle: {
        borderWidth: 2,
        borderColor: '#fe3a59',
        // borderColor: '#FFF',
        borderRadius: 90,
        padding: 0,
        width: 135,
        height: 135,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5
    },

    logoTextContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },


})
