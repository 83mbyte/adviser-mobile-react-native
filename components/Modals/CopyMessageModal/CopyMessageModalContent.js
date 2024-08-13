import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';

import TitleHeading from '../../TitleHeading/TitleHeading';
// import SubtitleHeading from '../../SubtitleHeading/SubtitleHeading';

const CopyMessageModalContent = ({ message }) => {

    return (
        <>
            <View style={styles.header}>
                <TitleHeading value={'Select to copy'} />
                {/* <SubtitleHeading value={'Highlight it to copy'} /> */}
            </View>
            <ScrollView style={styles.body} bounces={false}  >
                {
                    message
                        ? <TextInput
                            multiline={true}
                            value={message}
                            editable={false}
                            style={{ marginBottom: 5, marginBottom: 3, borderWidth: 0 }}
                        />
                        : <Text>error..</Text>
                }
            </ScrollView>
        </>
    );
};

export default CopyMessageModalContent;

const styles = StyleSheet.create({

    header: { marginBottom: 10 },
    body: { marginBottom: 3, marginTop: 0, overflow: 'hidden', },
    footer: {
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row'
    }
});