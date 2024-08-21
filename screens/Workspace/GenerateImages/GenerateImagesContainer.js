import React, { useEffect, useReducer, useState } from 'react';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';

import { uid } from 'uid';

import WhiteBottomWrapper from '../../../components/Wrappers/WhiteBottomWrapper';
import OpacityWrapper from '../../../components/Wrappers/OpacityWrapper';
import GenerateImagesInterface from './GenerateImagesInterface';

import { useHistoryContext } from '../../../context/HistoryContextProvider';
import ModalContainer from '../../../components/Modals/ModalContainer';
import WarningModalContent from '../../../components/Modals/WarningModal/WarningModalContent';

import { useSettingsContext } from '../../../context/SettingsContextProvider';
import { fsAPI } from '../../../lib/fsAPI';
import ZoomImageModalContainer from '../../../components/Modals/ZoomImage/ZoomImageModalContainer';
import VocieRecordingModalContent from '../../../components/Modals/VoiceRecording/VoiceRecordingModalContent';
import { useAuthContext } from '../../../context/AuthContextProvider';

const initialState = {
    showZoomImage: { showModal: false, imageSource: null, imageSize: null },
    showDeleteModal: { showoModal: false, imageToDelete: null },
    showStartNewModal: { showModal: false },
    showWarningModal: { showModal: false, message: null },
    showVoiceRecording: { showModal: false, recordedUri: null }
}

const reducer = (prevState, action) => {
    switch (action.type) {
        case 'TOGGLE-ZOOM-IMAGE':
            if (action.payload) {
                return { ...prevState, showZoomImage: action.payload }
            }
            return {
                ...prevState,
                showZoomImage: { showModal: false, imageSource: null, imageSize: null }
            }

        case 'TOGGLE-DELETE-MODAL':
            if (action.payload) {
                return {
                    ...prevState,
                    showDeleteModal: action.payload
                }
            }
            return {
                ...prevState,
                showDeleteModal: { showModal: false, imageToDelete: null }
            }
        case 'TOGGLE-START-NEW':
            return {
                ...prevState,
                showStartNewModal: { showModal: action.payload || false }
            }

        case 'TOGGLE-WARNING-MODAL':
            return {
                ...prevState,
                showWarningModal: action.payload ? action.payload : { showModal: false, message: null }
            }

        case 'TOGGLE-VOICE-RECORDING':
            return {
                ...prevState,
                showVoiceRecording: action.payload ? action.payload : { showModal: false, recordedUri: null }
            }
        default:
            return prevState;
    }

}

const GenerateImagesContainer = ({ navigation, route }) => {
    const user = useAuthContext();
    const accessToken = user.data.user.accessToken;

    const historyContextData = useHistoryContext();
    const history = historyContextData.data.imagesHistory.history;
    const historyIndexes = historyContextData.data.imagesHistory.historyIndexes;
    // DEV  historyId
    // const historyId = 123;  // DEV
    //PROD
    const historyId = historyContextData.data.imagesHistory.currentId;

    const setHistoryId = () => historyContextData.setImagesHistoryId();
    const addImagesHistoryItem = (obj) => historyContextData.addImagesHistoryItem(obj);

    const settingsContextData = useSettingsContext();
    const { quality, size, style } = settingsContextData.data.imagesSettings;

    const [utilityState, dispatch] = useReducer(reducer, initialState);
    const [isLoading, setIsLoading] = useState(false);

    const deleteButtonPress = (item) => {
        dispatch({ type: 'TOGGLE-DELETE-MODAL', payload: { showModal: true, imageToDelete: item } });
    }

    const zoomButtonPress = (imageSource, imageSize) => {
        dispatch({
            type: 'TOGGLE-ZOOM-IMAGE',
            payload: { showModal: true, imageSource: imageSource, imageSize: imageSize }
        });
    };



    const deleteImageItem = () => {
        historyContextData.deleteImageItem({ historyId, imageSource: utilityState.showDeleteModal.imageToDelete });
    }

    const downloadButtonPress = async (downloadURL, mime) => {
        // A filename extension as .PNG extension, because the images to download will be as .PNG files..
        const filename = `${Date.now().toString().substring(6)}.png`;

        try {
            saveImageToDevice(downloadURL, filename, mime)
        } catch (error) {
            console.log('error in try to saveImageToDevice  ', error)
        }

    };

    const saveImageToDevice = async (fileUri, filename, mimeType) => {
        if (Platform.OS === 'android') {
            const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

            if (permissions.granted) {
                const base64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });

                await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimeType)
                    .then(async (uri) => {
                        await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
                    })
                    .catch((err) => console.log('Error while saving: ', err));

            } else {
                shareAsync(fileUri);
            }

        } else {
            shareAsync(fileUri);
        }
    }

    const startNewButtonPress = (value) => {
        dispatch({ type: 'TOGGLE-START-NEW', payload: value || false })
    }

    const settingsButtonPress = () => {
        navigation.navigate('Images Settings', { settingsStatePath: 'imagesSettings' });
    }

    const historyButtonPress = () => {
        navigation.navigate('Images History');
    }

    const checkForWarnings = (value) => {
        if (!historyId) {
            dispatch({
                type: 'TOGGLE-WARNING-MODAL', payload: { showModal: true, message: `Unexpected error.` }
            });
            return { type: 'Error', message: 'Something wrong..' }
        }
         
        if (!value || value == '' || value == undefined) {

            dispatch({ type: 'TOGGLE-WARNING-MODAL', payload: { showModal: true, message: `You are trying to submit an empty message. It is not allowed.` } })

            return { message: 'No message to send.', type: 'Error' }
        }

        return { type: 'Success', message: 'No warnings detected.' }
    }

    const micButtonPress = () => {
        dispatch({
            type: 'TOGGLE-VOICE-RECORDING',
            payload: { showModal: true, recordedUri: null }
        })
    }



    const transcribeAudio = async (uri) => {
        let filesData = uri.split('/');
        let ext = filesData[filesData.length - 1].split('.')[1];

        const formData = new FormData();
        formData.append('accessToken', accessToken);
        formData.append('file', {
            uri: uri,
            name: `transcribe.${ext}`,
            type: `audio/${ext}`,
        });

        try {

            // PROD
            return await fetch(process.env.EXPO_PUBLIC_FUNC_TRANSCRIBE_PATH_PROD, {

            // DEV 
            // return await fetch(process.env.EXPO_PUBLIC_EMULATOR_FUNC_TRANSCRIBE_PATH_DEV, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
                .then((res) => res.json())
                .then(resp => {
                    if (resp?.status !== 'Success') {
                        if (resp.message) {
                            throw new Error(`${resp.message}`);
                        } else {
                            throw new Error(`Error while trying to transcribe audio..`);
                        }
                    }

                    dispatch({ type: 'TOGGLE-VOICE-RECORDING' });
                    return { status: 'Success', payload: resp.payload };
                })
                .catch((error) => {
                    throw new Error(error.message);
                });

        } catch (error) {
            //console.log('erro in try catch   ', error);
            dispatch({ type: 'TOGGLE-VOICE-RECORDING' });
            throw new Error(error.message);
        }

    }


    const submitImagesForm = async (value) => {

        const noWarnings = checkForWarnings(value);

        if (noWarnings.type == 'Success') {
            const payload = { accessToken, size, quality, style, prompt: value, };

            setIsLoading(true);
            try {
                // await fetch( process.env.EXPO_PUBLIC_EMULATOR_FUNC_GENERATE_IMAGE_DEV,  // DEV
                
                await fetch(process.env.EXPO_PUBLIC_FUNC_GENERATE_IMAGE_PROD, //PORD
                    { method: 'POST',body: JSON.stringify(payload)})
                    
                    .then((fetchRes) => fetchRes.json())
                    .then(async (result) => {
                        if (result.status == 'Success') {

                            let resp = await fsAPI.downloadImageToUserFolder(result.payload, historyId);
                            if (resp) {
                                if (resp.status == 'Success') {

                                    addImagesHistoryItem({
                                        historyId,
                                        data: {
                                            id: uid(),
                                            title: value,
                                            source: resp.payload,
                                            mime: resp.mime,
                                            size: size
                                        }
                                    })
                                    setIsLoading(false);
                                    return { status: 'Success' }

                                } else if (resp.status == 'Error') {
                                    throw new Error('Unable to store an image to the application storage.. Please try again.')
                                }
                            }
                        }

                        if (result.status == 'Error') {
                            throw new Error(result.message ? result.message : 'There is something wrong. Try to modify your request please.')
                        }
                    })
            } catch (error) {
               // console.log('Error while trying to generate image ', error);
                dispatch({ type: 'TOGGLE-WARNING-MODAL', payload: { showModal: true, message: error.message } })
                setIsLoading(false);
            }
        }

    }

    useEffect(() => {
        if (!historyId) {
            setHistoryId()
        }
    }, []);

    useEffect(() => {
        const transcribeThenSubmit = async (recordedUri) => {

            try {
                setIsLoading(true);
                let res = await transcribeAudio(recordedUri);
                if (!res || res.status != 'Success') {
                    throw new Error(res?.message ? res.message : 'no results from transcribeAudio');
                }
                await submitImagesForm(res.payload);
                if (isLoading == true) {
                    setIsLoading(false);
                }

            } catch (error) {
                // console.log('Error..');
                dispatch({ type: 'TOGGLE-WARNING-MODAL', payload: { showModal: true, message: error.message } });
                setIsLoading(false);
            }
        }

        if (utilityState.showVoiceRecording.recordedUri && utilityState.showVoiceRecording.recordedUri != undefined) {

            transcribeThenSubmit(utilityState.showVoiceRecording.recordedUri);
        }
    }, [utilityState.showVoiceRecording.recordedUri]);

    return (


        <>
            <WhiteBottomWrapper route={route} key={'cardGenerateImages'}>
                <OpacityWrapper key={'opacityGenerateImages'}>

                    <GenerateImagesInterface
                        navigation={navigation}
                        data={history && Object.keys(history) > 0 ? history[historyId] : []}
                        zoomButtonPress={zoomButtonPress}
                        downloadButtonPress={downloadButtonPress}
                        deleteButtonPress={deleteButtonPress}
                        startNewButtonPress={startNewButtonPress}
                        submitImagesForm={submitImagesForm}
                        historyIndexes={historyIndexes}
                        settingsButtonPress={settingsButtonPress}
                        historyButtonPress={historyButtonPress}
                        isLoading={isLoading}
                        micButtonPress={micButtonPress}
                    />

                </OpacityWrapper>


            </WhiteBottomWrapper>
            {
                utilityState.showZoomImage.showModal &&
                <ZoomImageModalContainer modalVisible={utilityState.showZoomImage.showModal} callbackCancel={() => dispatch({ type: 'TOGGLE-ZOOM-IMAGE' })} imageSize={utilityState.showZoomImage.imageSize} imageSource={utilityState.showZoomImage.imageSource}>
                </ZoomImageModalContainer>

            }

            {
                utilityState.showDeleteModal.showModal &&
                <ModalContainer modalVisible={utilityState.showDeleteModal.showModal} callbackCancel={() => dispatch({ type: 'TOGGLE-DELETE-MODAL' })}>
                    <WarningModalContent
                        title='Are you sure?'
                        message='By clicking AGREE, the image will be removed permanently.'
                        buttons={[
                            { title: 'Agree', type: 'solid', callback: deleteImageItem },
                            { title: 'Cancel', type: 'outline', }
                        ]}
                    />
                </ModalContainer>
            }

            {
                // new chat modal
                utilityState.showStartNewModal.showModal &&  //create throw utility state
                <ModalContainer callbackCancel={() => startNewButtonPress(false)} >
                    <WarningModalContent
                        title='New Image Generator'
                        message={'By clicking AGREE, you will close the current Generate Images window and open a new one.'}
                        buttons={[
                            {
                                title: 'AGREE',
                                type: 'solid',
                                callback: () => setHistoryId(),
                            },
                            { title: 'Cancel', type: 'outline' }
                        ]}
                    />
                </ModalContainer>
            }

            {
                // empty message modal
                utilityState.showWarningModal.showModal &&
                <ModalContainer modalVisible={utilityState.showWarningModal.showModal} callbackCancel={() => dispatch({ type: 'TOGGLE-WARNING-MODAL' })}>
                    <WarningModalContent
                        // message={'You are trying to send attachments only. There is no message/instruction provided, it may cause to unexpected results.'}
                        message={utilityState.showWarningModal.message}
                        buttons={[{ title: 'OK', type: 'solid' }]}
                    />
                </ModalContainer>
            }
            {
                // voice recording
                utilityState.showVoiceRecording.showModal &&
                <ModalContainer modalVisible={utilityState.showVoiceRecording.showModal} callbackCancel={() => dispatch({ type: 'TOGGLE-VOICE-RECORDING' })}>
                    <VocieRecordingModalContent setRecordedUri={(value) => dispatch({ type: 'TOGGLE-VOICE-RECORDING', payload: { showModal: false, recordedUri: value } })} />
                </ModalContainer>
            }
        </>
    );
};

export default GenerateImagesContainer;