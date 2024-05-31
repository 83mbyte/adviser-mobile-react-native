import React, { useEffect, useReducer } from 'react';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';

import WhiteBottomWrapper from '../../../components/Wrappers/WhiteBottomWrapper';
import OpacityWrapper from '../../../components/Wrappers/OpacityWrapper';
import GenerateImagesInterface from './GenerateImagesInterface';

import { useHistoryContext } from '../../../context/HistoryContextProvider';
import ModalContainer from '../../../components/Modals/ModalContainer';
import ZoomImageModalContent from '../../../components/Modals/ZoomImage/ZoomImageModalContent';
import WarningModalContent from '../../../components/Modals/WarningModal/WarningModalContent';



const initialState = {
    showZoomImage: { showModal: false, imageSource: null },
    showDeleteModal: { showoModal: false, imageToDelete: null },
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
        default:
            return prevState;
    }

}

const GenerateImagesContainer = ({ navigation, route }) => {
    const historyContextData = useHistoryContext();

    const history = historyContextData.data.imagesHistory.history;
    // DEV  historyId
    const historyId = 123;  // DEV
    //PROD
    // const historyId = historyContextData.data.imagesHistory.currentId;


    const setHistoryId = (obj) => historyContextData.setHistoryId(obj);

    const [utilityState, dispatch] = useReducer(reducer, initialState);

    const deleteButtonPress = (item) => {
        dispatch({ type: 'TOGGLE-DELETE-MODAL', payload: { showModal: true, imageToDelete: item } });
    }


    const zoomButtonPress = (imageSource) => {
        dispatch({
            type: 'TOGGLE-ZOOM-IMAGE',
            payload: { showModal: true, imageSource: imageSource }
        });
    };


    const deleteImageFromHistory = () => {
        historyContextData.deleteImageFromHistory({ key: historyId, imageSource: utilityState.showDeleteModal.imageToDelete });
    }

    const downloadButtonPress = async (downloadURL) => {
        // A filename extension as .PNG extension, because the images to download will be as .PNG files..
        const filename = `${Date.now().toString().substring(6)}.png`;

        const result = await FileSystem.downloadAsync(downloadURL, FileSystem.documentDirectory + filename)
            .catch(error => {
                console.error(error);
            });
        if (result && result.status === 200) {
            saveImageToDevice(result.uri, filename, result.headers["Content-Type"])
        } else {
            console.log('something went wrong..')
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

    useEffect(() => {
        if (!historyId) {
            setHistoryId({ path: 'imagesHistory' })
        }
    }, [])

    return (


        <>
            <WhiteBottomWrapper route={route} key={'cardGenerateImages'}>
                <OpacityWrapper key={'opacityGenerateImages'}>
                    {/* DEV */}
                    <GenerateImagesInterface navigation={navigation} data={(history && Object.keys(history).length > 0) ? history[historyId] : Object.values(history)[0]} zoomButtonPress={zoomButtonPress} downloadButtonPress={downloadButtonPress} deleteButtonPress={deleteButtonPress} />
                    {/* PROD */}
                    {/* <GenerateImagesInterface data={history && Object.keys(history) > 0 ? history[historyId] : []} zoomButtonPress={zoomButtonPress} downloadButtonPress={downloadButtonPress} deleteButtonPress={deleteButtonPress} /> */}

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
                            { title: 'Agree', type: 'solid', callback: deleteImageFromHistory },
                            { title: 'Cancel', type: 'outline', }
                        ]}
                    />
                </ModalContainer>

            }
        </>
    );
};

export default GenerateImagesContainer;