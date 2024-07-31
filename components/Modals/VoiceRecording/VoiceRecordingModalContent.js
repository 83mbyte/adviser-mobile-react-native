import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

import TitleHeading from '../../TitleHeading/TitleHeading';
import RedButton from '../../Buttons/RedButton';

import { useModalContext } from '../ModalContainer';

const VocieRecordingModalContent = ({ setRecordedUri }) => {

    const modalContext = useModalContext();

    const [recording, setRecording] = useState(null);
    const [permissionResponse, requestPermission] = Audio.usePermissions();


    const startRecording = async () => {


        try {

            if (permissionResponse.status !== 'granted') {
                console.log('Requesting permission..');
                await requestPermission();
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log('Starting recording..');
            // const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
            const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.LOW_QUALITY);
            setRecording(recording);

        } catch (error) {
            console.error('Failed to start recording', error);
            throw new Error('Failed to start recording.. Please try again.')
        }
    }
    const stopRecording = async () => {
        modalContext.closeModal();
        console.log('Stopping recording..');
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync(
            {
                allowsRecordingIOS: false,
            }
        );
        const uri = recording.getURI();

        setRecording(undefined);
        // console.log('Recording stopped and stored at', uri);
        setRecordedUri(uri);
    }



    return (
        <>
            <View style={styles.header}>
                <TitleHeading value={'Voice message'} />

            </View>
            <View style={styles.body}>
                <Text>By clicking START, your voice recording will be started.</Text>
            </View>
            <View style={styles.footer}>
                <RedButton title={recording ? 'Stop' : 'Start'} size='sm' callback={recording ? stopRecording : startRecording} />
                {
                    !recording && <RedButton title={'CANCEL'} variant={'outline'} size='sm' callback={modalContext.closeModal} />}
            </View>
        </>

    );
};

export default VocieRecordingModalContent;

const styles = StyleSheet.create({

    header: { marginBottom: 10 },
    body: { marginTop: 10, marginBottom: 20 },
    footer: {
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row'
    }
});