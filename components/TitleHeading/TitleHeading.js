import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TitleHeading = ({ value }) => {
    View
    return (
        <View style={styles.titleContainer}>
            <View style={styles.line}></View>
            <View  >
                <Text style={styles.titleText}>{value}</Text>
            </View>
            <View style={styles.line}></View>
        </View>
    );
};

export default TitleHeading;

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 0

    },
    line: {
        backgroundColor: '#fe3a59',
        flex: 1,
        height: 1,
        marginHorizontal: 14
    },
    titleText: {
        color: '#fe3a59',
        textTransform: 'uppercase',
        fontSize: 19
    },
})