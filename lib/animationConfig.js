import { LinearTransition, StretchInY, StretchOutY, SlideInDown, SlideOutDown, FadeIn, FadeOut } from 'react-native-reanimated';
const animationLibrary = {
    layoutTransition: {
        linear: LinearTransition.delay(500)
    },

    Stretch: {
        entering: StretchInY.delay(1200),
        exiting: StretchOutY.duration(200)
    },
    SlideFromBottom: {
        entering: SlideInDown.springify().stiffness(70),
        exiting: SlideOutDown.springify().stiffness(10),
        // entering: SlideInDown.easing(Easing.linear).duration(700),
        // exiting: SlideOutDown.easing(Easing.linear).duration(500)
    },
    Fade: {
        entering: FadeIn.delay(300).duration(1000),
        exiting: FadeOut.duration(100)
    }


}

export default animationLibrary;