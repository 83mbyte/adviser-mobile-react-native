import React from 'react';
import { Modal, Text, View, StyleSheet, } from 'react-native';
import TitleHeading from '../../TitleHeading/TitleHeading';
import RedButton from '../../Buttons/RedButton';


const PopUp = ({ modalVisible, setModalVisible, setHistoryId, headerText, message }) => {
    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
                <View style={styles.whiteContainer}>
                    <View style={styles.header}>
                        <TitleHeading value={headerText} />
                    </View>
                    <View style={styles.body}>
                        <Text>{message}</Text>
                    </View>
                    <View style={styles.footer}>

                        <RedButton title={'Agree'} variant='solid' size='sm' callback={() => { setHistoryId({ path: 'chatHistory' }), setModalVisible(false) }} />
                        <RedButton title={'Cancel'} variant='outline' size='sm' callback={() => setModalVisible(false)} />
                    </View>

                </View>
            </View>
        </Modal>
    );
};

export default PopUp;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.65)'
    },

    whiteContainer: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginHorizontal: 5,
        borderRadius: 15,
        minWidth: '55%',
        maxWidth: '95%',
        rowGap: 15
    },
    footer: {
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row'
    }

})