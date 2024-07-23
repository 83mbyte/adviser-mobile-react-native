import React from 'react';
import { View, Image } from 'react-native';


const ZoomImageModalContent = ({ imageSource, imageDetails }) => {

    const drawImage = () => {
        if (imageDetails) {

            if (imageDetails.image.rotate) {
                return (
                    <Image source={{ uri: imageSource }} style={{ height: imageDetails.image.width, width: imageDetails.image.height, transform: [{ rotate: '90deg' }] }} resizeMode={'center'} />
                )
            }
            return (<Image source={{ uri: imageSource }} style={{ height: imageDetails.image.height, width: imageDetails.image.width }} resizeMode={'cover'} />)
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            {
                drawImage()
            }
        </View>
    );
};

export default ZoomImageModalContent;