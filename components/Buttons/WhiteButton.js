import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const WhiteButton = ({ title, variant = 'solid', callback }) => {
    return (
        <TouchableOpacity
            style={[styles.containerButton.default, styles.containerButton[variant]]}
            onPress={callback}
        >

            <Text style={[styles.titleText.default, styles.titleText[variant]]}>
                {title}
            </Text>

        </TouchableOpacity>
    );
};

export default WhiteButton;

const buttonFontSize = 16;


const styles = StyleSheet.create({
    containerButton:
    {
        default: {
            width: 249,
            height: 57,
            borderWidth: 0,
            margin: 2,
            borderRadius: 35,
            // borderRadius: '35%',
            alignItems: 'center',
            justifyContent: 'center'
        },
        solid: {
            backgroundColor: 'white',
        },

        outline: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: 'white',
            color: '#fe3a59'
        },
        link: {
            backgroundColor: 'transparent',
            borderWidth: 0,
        }
    },

    titleText: {
        default: {
            textTransform: 'uppercase',
            fontSize: buttonFontSize || 16,
        },
        solid: {
            color: '#fe3a59',

        },
        outline: {
            color: 'white',
        },
        link: {
            color: 'white',
        }
    }

})