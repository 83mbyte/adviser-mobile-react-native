import React from 'react';

import { View, StyleSheet } from 'react-native';
import BottomNavigation from '../../components/BottomNavigation/BottomNavigation';
import LogoApp from '../../components/LogoApp/LogoApp';
const Workspace = ({ navigation, route }) => {


    return (
        <View style={styles.container}>

            <View style={styles.logoContainer}>
                <LogoApp route={route} color='white' size='lg' delay={1000} />
            </View>

            <BottomNavigation navigation={navigation} />

        </View>
    );
};

export default Workspace;

const styles = StyleSheet.create({
    container: { backgroundColor: 'transparent', flex: 1, justifyContent: 'space-between' },
    logoContainer: { flex: 1, backgroundColor: 'transparent', justifyContent: 'center' },
})