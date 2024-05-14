import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const BottomSafeViewPadding = ({ children }) => {
    const ins = useSafeAreaInsets();
    return (
        <View style={{ paddingBottom: ins.bottom }}>
            {children}
        </View>
    );
};

export default BottomSafeViewPadding;