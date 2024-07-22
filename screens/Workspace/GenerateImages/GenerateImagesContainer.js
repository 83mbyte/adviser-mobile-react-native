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
import ZoomImageModalContent from '../../../components/Modals/ZoomImage/ZoomImageModalContent';
import WarningModalContent from '../../../components/Modals/WarningModal/WarningModalContent';

import { useSettingsContext } from '../../../context/SettingsContextProvider';
import { connectFunctionsEmulator, httpsCallable } from 'firebase/functions';
import { cloudFunctions } from '../../../firebaseConfig';
import { fsAPI } from '../../../lib/fsAPI';

const initialState = {
    showZoomImage: { showModal: false, imageSource: null },
    showDeleteModal: { showoModal: false, imageToDelete: null },
    showStartNewModal: { showModal: false },
    showWarningModal: { showModal: false, message: null }
}

const reducer = (prevState, action) => {
    switch (action.type) {
        case 'TOGGLE-ZOOM-IMAGE':
            if (action.payload) {
                return { ...prevState, showZoomImage: action.payload }
            }
            return {
                ...prevState,
                showZoomImage: { showModal: false, imageSource: null }
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
        default:
            return prevState;
    }

}

const GenerateImagesContainer = ({ navigation, route }) => {
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

    const zoomButtonPress = (imageSource) => {
        dispatch({
            type: 'TOGGLE-ZOOM-IMAGE',
            payload: { showModal: true, imageSource: imageSource }
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
        // if (attachmentsArray.length > 0 && (!value || value == '' || value == undefined)) {
        //     setShowWarningModal({ show: true, message: `You are trying to send attachments only. There is no message/instruction provided, it may cause to unexpected results.` });
        //     return { type: 'Error', message: 'No comments to the image provided.' }
        // }
        if (!value || value == '' || value == undefined) {

            dispatch({ type: 'TOGGLE-WARNING-MODAL', payload: { showModal: true, message: `You are trying to submit an empty message. It is not allowed.` } })
            // setShowWarningModal({ show: true, message: `You are trying to submit an empty message. It is not allowed.` });
            return { message: 'No message to send.', type: 'Error' }
        }

        return { type: 'Success', message: 'No warnings detected.' }
    }


    const submitImagesForm = async (value) => {

        const noWarnings = checkForWarnings(value);

        if (noWarnings.type == 'Success') {
            try {
                setIsLoading(true);
                // DEV emulator
                connectFunctionsEmulator(cloudFunctions, process.env.EXPO_PUBLIC_EMULATOR_PATH, 5001)

                const requestToGenerateImage = httpsCallable(cloudFunctions, 'requestToGenerateImage', { limitedUseAppCheckTokens: true });

                return await requestToGenerateImage({ size, quality, style, prompt: value })
                    .then(async (funcResp) => {

                        if (funcResp.data.status == 'Success') {

                            let resp = await fsAPI.downloadImageToUserFolder(funcResp.data.payload, historyId);
                            if (resp) {
                                if (resp.status == 'Success') {

                                    addImagesHistoryItem({
                                        historyId,
                                        data: {
                                            id: uid(),
                                            title: value,
                                            source: resp.payload,
                                            mime: resp.mime
                                        }
                                    })
                                    setIsLoading(false);
                                    return { status: 'Success' }
                                } else if (resp.status == 'Error') {
                                    throw new Error('Unable to store an image to the application storage.. Please try again.')
                                }
                            }
                        }

                        if (funcResp.data.status == 'Error') {
                            throw new Error('There is something wrong. Try to modify your request please.')
                        }
                    })

            } catch (error) {
                console.log('Error while trying to generate image');
                dispatch({ type: 'TOGGLE-WARNING-MODAL', payload: { showModal: true, message: error.message } })
                setIsLoading(false);
            }
            finally {
                setIsLoading(false)
            }
        }
    }

    useEffect(() => {
        if (!historyId) {
            setHistoryId()
        }
    }, [])

    return (


        <>
            <WhiteBottomWrapper route={route} key={'cardGenerateImages'}>
                <OpacityWrapper key={'opacityGenerateImages'}>
                    {/* DEV */}
                    {/* <GenerateImagesInterface navigation={navigation} data={(history && Object.keys(history).length > 0) ? history[historyId] : Object.values(history)[0]} zoomButtonPress={zoomButtonPress} downloadButtonPress={downloadButtonPress} deleteButtonPress={deleteButtonPress} /> */}
                    {/* PROD */}
                    <GenerateImagesInterface navigation={navigation} data={history && Object.keys(history) > 0 ? history[historyId] : []} zoomButtonPress={zoomButtonPress} downloadButtonPress={downloadButtonPress} deleteButtonPress={deleteButtonPress} startNewButtonPress={startNewButtonPress} submitImagesForm={submitImagesForm} historyIndexes={historyIndexes} settingsButtonPress={settingsButtonPress} historyButtonPress={historyButtonPress} isLoading={isLoading} />

                </OpacityWrapper>


            </WhiteBottomWrapper>
            {
                utilityState.showZoomImage.showModal &&
                <ModalContainer modalVisible={utilityState.showZoomImage.showModal} callbackCancel={() => dispatch({ type: 'TOGGLE-ZOOM-IMAGE' })} customHeight={'50%'}>
                    <ZoomImageModalContent imageSource={utilityState.showZoomImage.imageSource} />
                </ModalContainer>

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
        </>
    );
};

export default GenerateImagesContainer;