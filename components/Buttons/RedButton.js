import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const RedButton = ({ title, variant = 'solid', size = 'md', disabled = false, callback }) => {

    const buttonHeight = {
        sm: 47,
        md: 57,
        lg: 67
    };
    const buttonWidth = {
        sm: 139,
        md: 249,
        lg: 249
    };
    const buttonFontSize = {
        sm: 12,
        md: 16,
        lg: 20
    };

    return (
        <TouchableOpacity
            style={
                [
                    styles.containerButton.default, styles.containerButton[variant], disabled && styles.containerButton.disabled,
                    { height: buttonHeight[size], width: buttonWidth[size] }
                ]
            }
            onPress={callback}
            disabled={disabled}
        >
            <Text style={[styles.titleText.default, styles.titleText[variant], { fontSize: buttonFontSize[size] }]}>
                {title}
            </Text>

        </TouchableOpacity>

    );
};

export default RedButton;

const styles = StyleSheet.create({
    containerButton:
    {
        default: {
            width: 249,
            borderWidth: 0,
            margin: 2,
            borderRadius: '35%',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 20,
            paddingRight: 20
        },
        solid: {
            backgroundColor: '#ff5456'
        },

        outline: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: '#ff5456',
            color: '#fe3a59'
        },
        link: {
            backgroundColor: 'transparent',
            borderWidth: 0,
        },
        disabled: {
            opacity: 0.25
        }

    },

    titleText: {
        default: {
            textTransform: 'uppercase',
            fontSize: 16,
        },
        solid: {
            color: '#fff',

        },
        outline: {
            color: '#ff5456',
        },
        link: {
            color: 'white',
        }
    }

})