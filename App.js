import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ImageBackground } from 'react-native';
import { AuthContextProvider } from './context/AuthContextProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

import Start from './screens/Start';
import SettingsContextProvider from './context/SettingsContextProvider';
import HistoryContextProvider from './context/HistoryContextProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const bgImage = require('./assets/splash_no_logo.png');
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent'
  },
};
export default function App() {
  return (
    <AuthContextProvider>
      <SettingsContextProvider>
        <HistoryContextProvider>
          <ImageBackground source={bgImage} style={styles.backgroundContainer}>
            <SafeAreaProvider style={{ flex: 1, flexDirection: 'row' }}>

              <GestureHandlerRootView style={{ flex: 1 }}>
                <NavigationContainer theme={MyTheme} >
                  <Start />
                </NavigationContainer>
              </GestureHandlerRootView>

            </SafeAreaProvider>
            <StatusBar style="auto" />
          </ImageBackground>
        </HistoryContextProvider>
      </SettingsContextProvider>
    </AuthContextProvider>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  container: {
    flex: 1,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
