import React, { useState } from 'react';
import WhiteBottomWrapper from '../../../components/Wrappers/WhiteBottomWrapper';
import OpacityWrapper from '../../../components/Wrappers/OpacityWrapper';
import RedButton from '../../../components/Buttons/RedButton';
import { View, StyleSheet } from 'react-native';
import ModalContainer from '../../../components/Modals/ModalContainer';
import WarningModalContent from '../../../components/Modals/WarningModal/WarningModalContent';
import { authAPI } from '../../../lib/authAPI';
import { useAuthContext } from '../../../context/AuthContextProvider';
import AuthModal from '../../AuthModal/AuthModal';

const ProfileSettings = () => {
    const [showWarningModal, setShowWarningModal] = useState({ show: false, type: null, message: null });

    const { signOut, data } = useAuthContext();
    return (
        <>

            {
                data.user?.uid
                    ? <WhiteBottomWrapper keyId={'cardProfileSettingsOptions'}>
                        <OpacityWrapper keyId={'opacityProfileSettingsOptions'}>

                            <View style={styles.cardBody}>
                                <View style={{ alignItems: 'center', rowGap: 10 }}>
                                    <RedButton
                                        key={'signOutButton'}
                                        title={'Sign Out'}
                                        variant={'solid'}
                                        size='md'
                                        callback={() => setShowWarningModal({ show: true, type: 'SignOut', message: 'You will be sign out. Please confirm.' })}
                                    />
                                    <RedButton
                                        key={'deleteButton'}
                                        title={'Delete Account'}
                                        variant={'outline'}
                                        size='md'
                                        callback={() => setShowWarningModal({ show: true, type: 'Delete', message: 'You will be logged out and the account will be deleted. Means all your data will be lost. Please confirm.' })}
                                    />
                                </View>
                            </View>

                        </OpacityWrapper>
                    </WhiteBottomWrapper>
                    : <AuthModal />
            }

            {
                showWarningModal.show &&

                <ModalContainer callbackCancel={() => setShowWarningModal({ show: false, message: null, type: null })}>
                    {
                        showWarningModal.type == 'SignOut' &&
                        <WarningModalContent
                            message={showWarningModal.message}
                            buttons={[{ title: 'Confirm', type: 'outline', callback: async () => await signOut() }, { title: 'Cancel', type: 'solid' }]}
                        />
                    }
                    {
                        showWarningModal.type == 'Delete' &&
                        <WarningModalContent
                            message={showWarningModal.message}
                            buttons={[{ title: 'Yes, delete it', type: 'outline', callback: () => authAPI.deleteUser() }, { title: 'Cancel', type: 'solid' }]}
                        />
                    }


                </ModalContainer>
            }
        </>
    );
};

export default ProfileSettings;


const styles = StyleSheet.create({
    cardBody: {
        paddingHorizontal: 10,
        flex: 1,
    },
    // settingsItem: { backgroundColor: 'white', overflow: 'hidden', borderRadius: 10, rowGap: 2, marginBottom: 0 }
})