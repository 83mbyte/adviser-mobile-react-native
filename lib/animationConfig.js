import { LinearTransition, StretchInY, StretchOutY, SlideInDown, SlideOutDown, FadeIn, FadeOut, SlideInLeft, SlideOutLeft, SlideInRight, SlideOutRight } from 'react-native-reanimated';
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
    SlideFromLeft: {
        entering: SlideInLeft.springify().stiffness(70),
        exiting: SlideOutLeft.springify().stiffness(70),
    },
    SlideFromRight: {
        entering: SlideInRight.springify().stiffness(70),
        exiting: SlideOutRight.springify().stiffness(70),
    },
    Fade: {
        entering: FadeIn.delay(300).duration(1000),
        exiting: FadeOut.duration(1000)
    }


}

export default animationLibrary;