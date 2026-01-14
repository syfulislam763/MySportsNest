import React from 'react';
import { StyleSheet, View } from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import WelcomeMyNestScreen from '@/screens/onboarding_screens/WelcomeMyNestScreen';
import ScoreVisibilityScreen from '@/screens/onboarding_screens/ScoreVisivilityScreen';
import NestFeedScreen from '@/screens/main_app_screens/NestFeedScreen';
import TeamDetailScreen from '@/screens/main_app_screens/TeamDetailScreen';

const Stack = createNativeStackNavigator();

const MainStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{headerShown:false}}
        >
            <Stack.Screen name="WelcomeMyNestScreen" component={WelcomeMyNestScreen}/>
            <Stack.Screen name='ScoreVisibilityScreen' component={ScoreVisibilityScreen} />

            <Stack.Screen name='NestFeedScreen' component={NestFeedScreen} />
            
            <Stack.Screen name='TeamDetailScreen' component={TeamDetailScreen}/>


        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({})

export default MainStack;
