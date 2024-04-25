import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const SubtitleHeading = ({ value }) => {
    return (
        <View style={styles.subTitleContainer}>
            <View style={styles.line}></View>
            <View style={styles.title}>
                <Text style={styles.subTitleText}>{value}</Text>
            </View>
            <View style={styles.line}></View>
        </View>
    );
};

export default SubtitleHeading;

const styles = StyleSheet.create({
    subTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 0,
        width: '100%',
    },
    line: {
        backgroundColor: '#fe3a59',
        width: 10,
        height: 1,
        marginHorizontal: 5

    },
    subTitleText: {
        color: '#fe3a59',
        textTransform: 'uppercase',
        fontSize: 12
    },
})