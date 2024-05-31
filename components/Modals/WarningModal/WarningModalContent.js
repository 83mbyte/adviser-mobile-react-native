import React from 'react';
import { useModalContext } from '../ModalContainer';
import { View, Text, StyleSheet } from 'react-native';
import TitleHeading from '../../TitleHeading/TitleHeading';
import RedButton from '../../Buttons/RedButton';


const WarningModalContent = ({ title, message, buttons }) => {

    const modalContext = useModalContext();

    return (
        <>
            <View style={styles.header}>
                <TitleHeading value={title ? title : 'Warning'} />
            </View>
            <View style={styles.body}>
                <Text>{message}</Text>
            </View>
            <View style={styles.footer}>
                {
                    buttons.map((button, index) => {
                        return (
                            <RedButton
                                key={index}
                                title={button.title}
                                variant={button.type}
                                size='sm'
                                callback={button.callback ? () => { button.callback(); modalContext.closeModal() } : modalContext.closeModal}
                            />
                        )
                    })
                }
            </View>
        </>
    );
};


export default WarningModalContent;

const styles = StyleSheet.create({

    header: { marginBottom: 10 },
    body: { marginTop: 10, marginBottom: 20 },
    footer: {
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row'
    }
});