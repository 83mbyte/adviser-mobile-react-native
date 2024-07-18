import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import { View, StyleSheet, TouchableOpacity, Text, } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

import TitleHeading from '../../TitleHeading/TitleHeading';
import { useModalContext } from '../ModalContainer';
import { useAttachContext } from '../../../context/AttachContextProvider';

const ImagePickerModalContent = () => {

    const modalContext = useModalContext();
    const attachContextData = useAttachContext();
    const attachmentsArray = attachContextData.data.attachmentsArray;


    const createAttachment = async (mode) => {
        let result = {};

        try {

            if (mode === 'gallery') {
                await ImagePicker.requestMediaLibraryPermissionsAsync();
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1
                })

            } else {
                await ImagePicker.requestCameraPermissionsAsync();
                result = await ImagePicker.launchCameraAsync({
                    cameraType: ImagePicker.CameraType.front,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.85,
                    // quality: 1, // no compression
                    mediaTypes: ImagePicker.MediaTypeOptions.Images
                });
            }

            if (!result.canceled) {
                //save image
                await saveImage(result.assets[0].uri);
            }

        } catch (error) {
            alert('Error uploading image: ' + error.message);
            modalContext.closeModal();
        }

    }

    const saveImage = async (image) => {
        try {

            if (attachmentsArray.length < 3) {

                attachContextData.addAttachment(image);
            }
            modalContext.closeModal();

        } catch (error) {
        }
    }

    return (
        <>
            <View style={styles.header}>
                <TitleHeading value={'Attach image'} />
            </View>

            <View style={styles.body}>
                <View style={styles.row}>

                    <TouchableOpacity style={styles.buttonContainer} onPress={() => createAttachment('camera')}>
                        <Ionicons name="camera-sharp" size={36} color='#ff5456' />
                        <Text>Camera</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonContainer} onPress={() => createAttachment('gallery')}>
                        <Entypo name="images" size={36} color='#ff5456' />
                        <Text> Gallery</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

export default ImagePickerModalContent;

const styles = StyleSheet.create({

    header: { marginBottom: 10 },
    body: { marginVertical: 10 },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    buttonContainer: {
        flexDirection: 'column',
        backgroundColor: '#FBFBFB', alignItems: 'center', rowGap: 5, marginHorizontal: 5, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 15
        // width: 50
    },

    // footer: {
    //     alignItems: 'center',
    //     justifyContent: 'space-around',
    //     flexDirection: 'row'
    // }
})