import React from 'react';
import { StyleSheet, View } from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import WelcomePage from '@/screens/auth_screens/WelcomePage';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{headerShown:false}}
        >
            <Stack.Screen name="WelcomePage" component={WelcomePage}/>

        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({})

export default AuthStack;
