import { LinearTransition, StretchInY, StretchOutY, L } from 'react-native-reanimated';
const animationLibrary = {
    layoutTransition: {
        linear: LinearTransition.delay(300)
    },

    Stretch: {
        entering: StretchInY.delay(1200),
        exiting: StretchOutY
    }
}

export default animationLibrary;