import React, { useState } from 'react';
import { Modal, Text, View, StyleSheet, } from 'react-native';
import TitleHeading from '../../TitleHeading/TitleHeading';
import RedButton from '../../Buttons/RedButton';
import Animated, { StretchInY, StretchOutY } from 'react-native-reanimated';


const PopUpAnimated = ({ modalVisible, headerText, message, callbackAgree, callbackCancel }) => {
    const [showContent, setShowContent] = useState(true);

    const closeAnimationPromise = () => {
        return new Promise((resolve, reject) => {
            setShowContent(false);
            setTimeout(() => {
                resolve();
            }, 300)
        })
    }
    const closeModalAnimated = () => {
        closeAnimationPromise().then(() => callbackCancel())
    }
    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                closeModalAnimated();
            }}
        >
            <View style={styles.centeredView}>

                {
                    showContent &&
                    <Animated.View style={styles.whiteContainer}
                        entering={StretchInY} exiting={StretchOutY}>
                        <View style={styles.header}>
                            <TitleHeading value={headerText} />
                        </View>
                        <View style={styles.body}>
                            <Text>{message}</Text>
                        </View>
                        <View style={styles.footer}>

                            <RedButton title={'Agree'} variant='solid' size='sm' callback={callbackAgree} />
                            <RedButton title={'Cancel'} variant='outline' size='sm' callback={closeModalAnimated} />
                        </View>


                    </Animated.View>
                }
            </View>
        </Modal >
    );
};

export default PopUpAnimated;

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
        minWidth: '55%',
        maxWidth: '95%',
        rowGap: 15
    },
    footer: {
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row'
    }

})