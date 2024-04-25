import React from 'react';

import WhiteBottomWrapper from '../../../../components/Wrappers/WhiteBottomWrapper';
import ShowSettings from '../ShowSettings';


//descriptions/text data 
import { imageSettingsDescription } from '../../../../lib/textData';


const DATA = [
    {
        id: 1,
        sectionTitle: 'Image Size',
        options: [
            {
                subtitle: null,
                dispatcherName: 'setImageSettings',
                dispatcherType: 'SET_IMAGE_SIZE',
                stateKey: 'size',
                elements: [
                    {
                        labelText: imageSettingsDescription.imageSize[1].labelText,
                        value: imageSettingsDescription.imageSize[1].value
                    },
                    {
                        labelText: imageSettingsDescription.imageSize[2].labelText,
                        value: imageSettingsDescription.imageSize[2].value
                    },
                    {
                        labelText: imageSettingsDescription.imageSize[3].labelText,
                        value: imageSettingsDescription.imageSize[3].value
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        sectionTitle: 'Image Style',
        options: [
            {
                subtitle: null,
                dispatcherName: 'setImageSettings',
                dispatcherType: 'SET_IMAGE_STYLE',
                stateKey: 'style',
                elements: [
                    {
                        labelText: imageSettingsDescription.imageStyle[1].labelText,
                        value: imageSettingsDescription.imageStyle[1].value,
                        description: imageSettingsDescription.imageStyle[1].description
                    },
                    {
                        labelText: imageSettingsDescription.imageStyle[2].labelText,
                        value: imageSettingsDescription.imageStyle[2].value,
                    }
                ]
            }
        ]
    },
    {
        id: 3,
        sectionTitle: 'Image Quality',
        options: [
            {
                subtitle: null,
                dispatcherName: 'setImageSettings',
                dispatcherType: 'SET_IMAGE_QUALITY',
                stateKey: 'quality',
                elements: [
                    {
                        labelText: imageSettingsDescription.imageQuality[1].labelText,
                        value: imageSettingsDescription.imageQuality[1].value,

                    },
                    {
                        labelText: imageSettingsDescription.imageQuality[2].labelText,
                        value: imageSettingsDescription.imageQuality[2].value,
                        description: imageSettingsDescription.imageQuality[2].description
                    }
                ]
            }
        ]
    }
]

const ImageSettings = ({ route }) => {

    return (
        <WhiteBottomWrapper route={route} keyId={'Image_Settings'}>

            <ShowSettings settingsDataArray={DATA} settingsStatePath='imageSettings' />

        </WhiteBottomWrapper>
    );
};

export default ImageSettings;
