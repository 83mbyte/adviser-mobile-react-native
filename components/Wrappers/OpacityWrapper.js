import React from 'react';
import { View } from 'react-native';

import AnimatedViewWrapper from './AnimatedViewWrapper';

import animationLibrary from '../../lib/animationConfig';
const entering = animationLibrary.Fade.entering;
const exiting = animationLibrary.Fade.exiting;

const OpacityWrapper = ({ keyId, children }) => {


    return (

        <AnimatedViewWrapper keyId={keyId} entering={entering} exiting={exiting} >
            <View style={{ height: '100%' }}>
                {children}
            </View>
        </AnimatedViewWrapper>
    );
};

export default OpacityWrapper;