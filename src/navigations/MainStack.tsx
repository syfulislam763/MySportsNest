import React from 'react';
import { StyleSheet, View } from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import WelcomeMyNestScreen from '@/screens/onboarding_screens/WelcomeMyNestScreen';
import ScoreVisibilityScreen from '@/screens/onboarding_screens/ScoreVisivilityScreen';

const Stack = createNativeStackNavigator();

const MainStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{headerShown:false}}
        >
            <Stack.Screen name="WelcomeMyNestScreen" component={WelcomeMyNestScreen}/>
            <Stack.Screen name='ScoreVisibilityScreen' component={ScoreVisibilityScreen} />

        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({})

export default MainStack;
