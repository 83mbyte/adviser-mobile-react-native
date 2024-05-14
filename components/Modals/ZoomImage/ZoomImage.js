import React, { useState } from 'react';
import { Modal, View, StyleSheet, Image } from 'react-native';
import Animated from 'react-native-reanimated';

import animationLibrary from '../../../lib/animationConfig';

const enterTransition = animationLibrary.Stretch.entering;
const exitTransition = animationLibrary.Stretch.exiting;

import CloseButton from '../../Buttons/CloseButton';
const ZoomImage = ({ modalVisible, closeModal, imageSource }) => {
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
        closeAnimationPromise().then(() => closeModal());
    }
    return (
        <Modal
            animationType={'fade'}
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                closeModal();
            }}
        >
            <View style={styles.centeredView}>
                {
                    showContent &&
                    <Animated.View style={styles.whiteContainer} entering={enterTransition.delay(0)} exiting={exitTransition}  >
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
        borderRadius: 25,
        flex: 1,
        flexDirection: 'column',
        minHeight: '10%',
        // height: 'auto',
        maxHeight: '60%',
        width: '100%'
    },
    closeButtonContainer: { justifyContent: 'flex-end', flexDirection: 'row' },
    footer: {
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row'
    }
})