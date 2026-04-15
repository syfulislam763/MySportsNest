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
import LoadingContainer from '@/components/LoadingContainer';

export default function App() {
  return (
    <FontLoader>
      <NavigationContainer>
        <SafeAreaProvider>
          <AuthProvider>
            <GestureHandlerRootView>
              <RootNavigation/>
              <ToastContainer/>
              <LoadingContainer/>
            </GestureHandlerRootView>
          </AuthProvider>
        </SafeAreaProvider>
      </NavigationContainer>
    </FontLoader>
  );
}



/* 
  - here is documentation for adding adMob in react native expo
  - https://docs.page/invertase/react-native-google-mobile-ads~389
 


*/