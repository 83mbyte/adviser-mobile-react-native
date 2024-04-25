import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const TextInputStyled = ({ label, value, keyboardType = 'default', secureTextEntry = false, multiline = false, isValid = true, errorText = null, onChangeText, }) => {


    return (

        <View style={styles.container} >


            <Text style={styles.labelText}>{label}:</Text>

            <TextInput

                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                multiline={multiline}
                style={multiline == true ? { ...styles.input, minHeight: 50 } : styles.input}
            />
            {
                !isValid &&
                <Text style={{ color: 'red', fontSize: 9 }}>{errorText}</Text>
            }

        </View>
    );
};

export default TextInputStyled;

const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'green',
        backgroundColor: '#fafafc',
        borderColor: '#f2f6fc',
        borderWidth: 1,
        minHeight: 73,
        padding: 15
    },
    labelText: {
        fontSize: 18,
        color: '#7d7d7e',
        margin: 0,
        padding: 0

    },

    input: {
        minHeight: 30,
        marginTop: 5,
        marginBottom: 2,
        padding: 0,
        color: '#21293b',
        borderWidth: 0,
        textAlignVertical: 'top',
        // backgroundColor: 'red'
    },
})