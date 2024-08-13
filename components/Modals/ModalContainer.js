import React, { createContext, useCallback, useContext, useState } from 'react';
import { Modal, View, StyleSheet, } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import CloseButton from '../Buttons/CloseButton';

import animationLibrary from '../../lib/animationConfig';
const enterTransition = animationLibrary.Stretch.entering;
const exitTransition = animationLibrary.Stretch.exiting;

const ModalContext = createContext();
export const useModalContext = () => useContext(ModalContext);

const ModalContainer = ({ modalVisible, callbackCancel, customHeight = null, children }) => {
    const [showContent, setShowContent] = useState(true);
    const closeAnimationPromise = () => {
        return new Promise((resolve, reject) => {
            setShowContent(false);
            setTimeout(() => {
                resolve();
            }, 300)
        })
    }
    const closeModalAnimated = useCallback(() => {
        closeAnimationPromise().then(() => callbackCancel())
    }, [])

    return (
        <ModalContext.Provider value={{ closeModal: () => closeModalAnimated() }}>
            <Modal
                animationType={'fade'}
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    closeModalAnimated();
                }}
            >
                <View style={styles.centeredView}  >
                    {
                        showContent &&
                        <Animated.View style={customHeight ? [styles.whiteContainer, { maxHeight: customHeight }] : styles.whiteContainer} entering={enterTransition.delay(0)} exiting={exitTransition} layout={LinearTransition}>
                            <View style={styles.closeButtonContainer}>
                                <CloseButton onPressCallback={closeModalAnimated} />
                            </View>

                            {children}
                        </Animated.View>
                    }
                </View>
            </Modal>
        </ModalContext.Provider>
    );
};

export default ModalContainer;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.65)',
        paddingHorizontal: 10
    },

    whiteContainer: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginHorizontal: 5,
        borderRadius: 25,
        // flex: 1,
        flexDirection: 'column',
        minHeight: '20%',
        // height: '25%',
        maxHeight: '60%',
        width: '100%',
        overflow: 'hidden'
    },
    closeButtonContainer: { justifyContent: 'flex-end', flexDirection: 'row', marginBottom: 3 },
    // footer: {
    //     alignItems: 'center',
    //     justifyContent: 'space-around',
    //     flexDirection: 'row'
    // }
})