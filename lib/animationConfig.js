import { LinearTransition, StretchInY, StretchOutY, L } from 'react-native-reanimated';
const animationLibrary = {
    layoutTransition: {
        linear: LinearTransition.delay(500)
    },

    Stretch: {
        entering: StretchInY.delay(1200),
        exiting: StretchOutY.duration(200)
    }
}

export default animationLibrary;