import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

import { useSettingsContext } from '../../../context/SettingsContextProvider';


import WhiteBottomWrapper from '../../../components/Wrappers/WhiteBottomWrapper';
import OpacityWrapper from '../../../components/Wrappers/OpacityWrapper';

import SwitchStyled from '../../../components/Switch/SwitchStyled';
import SubtitleHeading from '../../../components/SubtitleHeading/SubtitleHeading';
import TitleHeading from '../../../components/TitleHeading/TitleHeading';


import { DATA_CHAT_SETTINGS, DATA_IMAGES_SETTINGS } from '../../../lib/settingsOptionsLib';

const SettingsOptions = ({ route }) => {
    let settingsDataArray = [];
    const { settingsStatePath } = route.params;
    const [settingsUpdated, setSettingsUpdated] = useState(false);

    const settingsContextData = useSettingsContext();
    const settingsState = settingsContextData.data[settingsStatePath];
    const stateUpdateDispatcher = (obj) => settingsContextData.setSettings(obj);

    switch (settingsStatePath) {
        case 'chatSettings':
            settingsDataArray = [...DATA_CHAT_SETTINGS];
            break;
        case 'imagesSettings':
            settingsDataArray = [...DATA_IMAGES_SETTINGS];
            break;
        default:
            break;
    }

    useEffect(() => {
        const onExitSaveSettingsOnServer = () => {
            if (settingsUpdated === true) {
                settingsContextData.updateSettingsOnServer(settingsStatePath, settingsState);
                setSettingsUpdated(false);
            }
        }

        return () => onExitSaveSettingsOnServer();
    })

    return (
        <WhiteBottomWrapper keyId={'cardSettingsOptions'}>
            <OpacityWrapper keyId={'opacitySettingsOptions'}>

                <ScrollView style={styles.scrollView}>

                    {
                        (settingsDataArray && settingsDataArray.length > 0) &&
                        settingsDataArray.map((section) => {

                            return (

                                <View key={section.id} style={styles.sectionContainer}>
                                    <View style={{ marginBottom: 0, marginTop: 10, }}>
                                        <TitleHeading value={section.sectionTitle} />
                                    </View>
                                    {
                                        (section.options && section.options.length > 0) &&
                                        section.options.map((option, index) => {

                                            return (


                                                <View key={index}>
                                                    {/* option subtitle */}
                                                    <View style={{ marginBottom: 5, marginTop: 20 }}>
                                                        {
                                                            (option.subtitle && option.subtitle.length > 0) &&
                                                            <SubtitleHeading value={option.subtitle} />
                                                        }
                                                    </View>

                                                    {/* option items */}
                                                    <View style={styles.sectionOptionsContainer}>
                                                        {
                                                            (option.elements && option.elements.length > 0) &&
                                                            option.elements.map((el) => {

                                                                return (
                                                                    <SettingOptionItem
                                                                        labelText={el.labelText}
                                                                        itemDescription={el.description ? el.description : null}
                                                                        key={`option_${el.id}`}
                                                                        isSelected={settingsState[option.stateKey] == el.value}
                                                                        onValueChange={() => {
                                                                            stateUpdateDispatcher({
                                                                                type: option.dispatcherType,
                                                                                value: el.value
                                                                            });
                                                                            setSettingsUpdated(true);
                                                                        }}
                                                                    />
                                                                )
                                                            })
                                                        }

                                                    </View>
                                                </View>
                                            )

                                        })
                                    }
                                </View>

                            )
                        })
                    }
                </ScrollView>

            </OpacityWrapper>
        </WhiteBottomWrapper >
    );
};

export default SettingsOptions;

const SettingOptionItem = ({ labelText, itemDescription, isSelected, onValueChange }) => {
    return (
        <View style={styles.settingOptionItemContainer}>
            <View style={styles.settingOptionRow}>
                <Text>{labelText}</Text>
                <SwitchStyled value={isSelected}
                    onValueChange={onValueChange}
                />
            </View>
            {
                itemDescription &&
                <Text style={styles.settingDescription}>{itemDescription}</Text>
            }
        </View>
    )
}




const styles = StyleSheet.create({
    scrollView: { width: '100%', paddingHorizontal: 20, },
    sectionContainer: { paddingBottom: 10, marginTop: 10, marginBottom: 10 },
    sectionOptionsContainer: { backgroundColor: 'white', overflow: 'hidden', flex: 1, borderRadius: 10, rowGap: 2, marginBottom: 0 },
    settingOptionItemContainer: { backgroundColor: 'rgba(0,0,0,0.025)', flex: 1, padding: 10, },
    settingOptionRow: { flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center' },
    settingDescription: {
        fontSize: 11,
        marginTop: 5,
        marginBottom: 5,
        color: '#A0A0A0'
    },
})