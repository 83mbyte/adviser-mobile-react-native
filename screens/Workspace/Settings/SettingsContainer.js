import React from 'react';
import WhiteBottomWrapper from '../../../components/Wrappers/WhiteBottomWrapper';
import OpacityWrapper from '../../../components/Wrappers/OpacityWrapper';
import SettingsList from './SettingsList';

const SettingsContainer = ({ navigation, route }) => {
    return (

        <WhiteBottomWrapper route={route} keyId={'cardSettings'}>
            <OpacityWrapper key={'opacitySettings'}>

                <SettingsList navigation={navigation} />

            </OpacityWrapper>
        </WhiteBottomWrapper>
    );
};

export default SettingsContainer;