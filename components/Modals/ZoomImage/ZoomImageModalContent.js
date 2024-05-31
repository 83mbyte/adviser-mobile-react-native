import React from 'react';
import { View, Image } from 'react-native';

const ZoomImageModalContent = ({ imageSource }) => {
    return (

        <>
            <View style={{ flex: 1 }}>
                <Image
                    resizeMode={'contain'}
                    style={{ flex: 1, }}
                    source={{
                        uri: imageSource,
                    }}
                />
            </View>
        </>
    );
};

export default ZoomImageModalContent;