import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Modal, View, StyleSheet, useWindowDimensions, } from 'react-native';
import Animated from 'react-native-reanimated';



import CloseButton from '../../Buttons/CloseButton';
import animationLibrary from '../../../lib/animationConfig';
import ZoomImageModalContent from './ZoomImageModalContent';

const enterTransition = animationLibrary.Stretch.entering;
const exitTransition = animationLibrary.Stretch.exiting;

const ModalContext = createContext();
export const useModalContext = () => useContext(ModalContext);


const ZoomImageModalContainer = ({ modalVisible, callbackCancel, imageSize, imageSource }) => {

    let screenWidth = useWindowDimensions().width;

    const [showContent, setShowContent] = useState(true);

    const [imageDetails, setImageDetails] = useState(null);
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
    }, []);

    useEffect(() => {
        const calculateImageViewSize = (size, screenWidth) => {
            let containerHeight = '50%'; // as default      
            switch (size) {
                case '1024x1024':
                    //  newHeight = oldHeight/ ( oldWidth/newWidth );
                    containerHeight = Math.ceil(1024 / (1024 / screenWidth));
                    setImageDetails({
                        container: { height: containerHeight },
                        image: {
                            rotate: false,
                            width: screenWidth - 2,
                            height: containerHeight - 2
                        }
                    })
                    break;
                case '1024x1792':
                    // newHeight = oldHeight/ ( oldWidth/newWidth ); 
                    containerHeight = Math.ceil(1792 / (1024 / screenWidth));
                    setImageDetails({
                        container: { height: containerHeight },
                        image: {
                            rotate: false,
                            width: screenWidth - 2,
                            height: containerHeight - 2
                        }
                    })
                    break;
                case '1792x1024':
                    // newHeight = oldHeight/ ( oldWidth/newWidth );
                    containerHeight = Math.ceil(1792 / (1024 / screenWidth));
                    setImageDetails({
                        container: { height: containerHeight },
                        image: {
                            rotate: true,
                            width: screenWidth - 2,
                            height: containerHeight - 2
                        }
                    })
                    break;

                default:
                    break;
            }

        }
        if (imageSize) {
            calculateImageViewSize(imageSize, screenWidth)
        }
        return () => {
            newHeight = null;
            imageDimension = null;
        }
    }, [])

    return (
        <ModalContext.Provider value={{ closeModal: () => closeModalAnimated() }}>
            {
                imageDetails &&
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
                            <Animated.View style={{ width: '100%', }} entering={enterTransition.delay(0)} exiting={exitTransition}>

                                <View style={styles.closeButtonContainer}>
                                    <View style={styles.closeButtonWhiteContainer}>
                                        <CloseButton onPressCallback={closeModalAnimated} />
                                    </View>
                                </View>

                                <View style={[styles.whiteArea, { height: imageDetails.container.height, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }]}>


                                    <ZoomImageModalContent imageSource={imageSource} imageDetails={imageDetails} />

                                </View>
                            </Animated.View>
                        }
                    </View>
                </Modal>

            }
        </ModalContext.Provider >
    )
}

export default ZoomImageModalContainer;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.65)',
        paddingHorizontal: 0
    },

    whiteArea: {
        backgroundColor: 'white',
        width: '100%',
        padding: 1,
    },
    closeButtonWhiteContainer: {
        backgroundColor: 'white', paddingHorizontal: 8, paddingBottom: 3, paddingTop: 6, borderTopRightRadius: 8, borderTopLeftRadius: 8,
    },


    closeButtonContainer: { justifyContent: 'flex-end', flexDirection: 'row', marginTop: 0, marginBottom: 0, paddingRight: 10, },

})