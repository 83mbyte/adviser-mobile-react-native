import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';


const duration = 5000;
const easing = Easing.out(Easing.bounce);

const durationOpacity = 500;
const easingOpacity = Easing.ease


const Loader = ({ size = 24, color = '#fe3a59' }) => {
    const sv = useSharedValue(0);
    const opacityShared = useSharedValue(0.25);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${sv.value * 360}deg` }],

    }));
    const animatedOpacity = useAnimatedStyle(() => ({
        opacity: opacityShared.value
    }))

    React.useEffect(() => {
        sv.value = withRepeat(withTiming(1, { duration, easing }), -1);
        opacityShared.value = withRepeat(withTiming(1, { duration: durationOpacity, easing: easingOpacity }), -1, true)
    }, []);

    return (
        <View style={styles.container}>
            <View>
                <Animated.Text style={{ color: color, fontSize: size / 2 }}>{process.env.EXPO_PUBLIC_PROJECT_NAME || 'LIBERO'}</Animated.Text>
            </View>
            <View>
                <Animated.View style={animatedStyle}>

                    <Animated.View style={[styles.logoCircle, { borderColor: color, width: size + 30, height: size + 30 }]} >
                        <Animated.Text style={{ color: color, fontSize: size }}>H</Animated.Text>
                    </Animated.View>
                </Animated.View>
            </View>
            <View style={styles.textContainer}>
                <Animated.Text style={[animatedOpacity, { color: color, fontSize: size / 2 }]}>{'Loading..'}</Animated.Text>
            </View>
        </View>
    );
};

export default Loader;

const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'white',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
        padding: 10,
        flexDirection: 'row',
        columnGap: 10,
        borderRadius: 15

    },
    logoCircle: {
        borderWidth: 1,
        borderColor: '#fe3a59',
        // borderColor: '#FFF',
        borderRadius: 90,
        padding: 0,
        width: 74,
        height: 74,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 0
    },
    logoTextContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    textContainer: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
    }
})

