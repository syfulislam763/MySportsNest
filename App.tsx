import { ScreenContent } from '@/components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import FontLoader from '@/hooks/FontLoader';
import { AuthProvider } from '@/context/AuthProvider';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigation from '@/navigations/RootNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import './global.css';
import ToastContainer from '@/components/ToastContainer';

export default function App() {
  return (
    <FontLoader>
      <NavigationContainer>
        <SafeAreaProvider>
          <AuthProvider>
            <GestureHandlerRootView>
              <RootNavigation/>
              <ToastContainer/>
            </GestureHandlerRootView>
          </AuthProvider>
        </SafeAreaProvider>
      </NavigationContainer>
    </FontLoader>
  );
}
