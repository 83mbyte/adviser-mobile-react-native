import React, { useState } from 'react';
import { Modal, View, StyleSheet, Image } from 'react-native';
import Animated, { StretchInY, StretchOutY } from 'react-native-reanimated';

import CloseButton from '../../Buttons/CloseButton';
const ZoomImage = ({ modalVisible, setModalVisible, imageSource }) => {
    const [showContent, setShowContent] = useState(true);

    const closeAnimationPromise = () => {
        return new Promise((resolve, reject) => {
            setShowContent(false);
            setTimeout(() => {
                resolve();
            }, 300)
        })
    }

    const modalCloseHandler = () => {
        closeAnimationPromise().then(() => setModalVisible(false));
    }
    return (
        <Modal
            animationType={'fade'}
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <View style={styles.centeredView}>
                {
                    showContent &&
                    <Animated.View style={styles.whiteContainer} entering={StretchInY} exiting={StretchOutY}  >
                        <View style={styles.closeButtonContainer}>
                            <CloseButton onPressCallback={modalCloseHandler} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Image
                                resizeMode={'contain'}
                                style={{ flex: 1 }}
                                source={{
                                    uri: imageSource,
                                }}
                            />
                        </View>
                    </Animated.View>
                }
            </View>
        </Modal>
    );
};

export default ZoomImage;


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.65)'
    },

    whiteContainer: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginHorizontal: 5,
        borderRadius: 15,
        flex: 1,
        flexDirection: 'column',
        maxHeight: '75%',
        width: '100%'
    },
    closeButtonContainer: { justifyContent: 'flex-end', flexDirection: 'row' },
    footer: {
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row'
    }
})