import React from 'react';
import { View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const BottomSafeViewPadding = ({ children }) => {
    const ins = useSafeAreaInsets();
    return (
        <View style={{ paddingBottom: Platform.OS === 'ios' ? ins.bottom : ins.bottom + 10 }}>
            {children}
        </View>
    );
};

export default BottomSafeViewPadding;