import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import Section from '../../../components/Section/Section';
import SectionInnerBlock from '../../../components/Section/SectionInnerBlock';
import SwitchStyled from '../../../components/Switch/SwitchStyled';
import { useSettingsContext } from '../../../context/SettingsContextProvider';
import DividerStyled from '../../../components/Divider/DividerStyled';


const ShowSettings = ({ settingsDataArray, settingsStatePath }) => {
    const settingsContextData = useSettingsContext();
    const settingsPath = settingsContextData.data[settingsStatePath];

    return (
        <ScrollView style={{ width: '100%', paddingHorizontal: 20, }}>

            {
                (settingsDataArray && settingsDataArray.length > 0) &&
                settingsDataArray.map((section) => {

                    return (
                        <Section title={section.sectionTitle} key={section.id} animationDelayExtra={75 * section.id}  >
                            {
                                section.options.map((option, index) => {

                                    return (
                                        <SectionInnerBlock subtitle={option.subtitle} key={`${section.id}_${index}`}>
                                            {
                                                option.optionDescription && <Text style={styles.settingDescription}>{option.optionDescription}</Text>
                                            }

                                            {
                                                option.elements.map((element, elIndex) => {

                                                    return (
                                                        <View key={`${section.id}_${index}_el_${elIndex}`} style={{ margin: 0, padding: 0 }}>
                                                            <View style={styles.sectionRow} key={`el_${elIndex}`}>
                                                                <Text style={styles.settingLabelText}>{element.labelText}</Text>
                                                                <SwitchStyled value={settingsPath[option.stateKey] == element.value} onValueChange={() => settingsContextData[option.dispatcherName]({ type: option.dispatcherType, value: element.value })} />

                                                            </View>
                                                            {
                                                                element.description
                                                                    ?
                                                                    <Text style={styles.settingDescription}>{element.description}</Text>
                                                                    : <DividerStyled color='transparent' />
                                                            }
                                                        </View>
                                                    )
                                                })
                                            }
                                        </SectionInnerBlock>
                                    )
                                })
                            }
                        </Section>

                    )
                })
            }
        </ScrollView>
    );
};

export default ShowSettings;

const styles = StyleSheet.create({
    sectionRow: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 0,
    },
    sectionDescription: {
        fontSize: 15,
        marginBottom: 10
    }
    ,
    settingLabelText: {

    },
    settingDescription: {
        fontSize: 10,
        marginTop: 2,
        marginBottom: 10,
        color: '#C0C0C0'
    },
})