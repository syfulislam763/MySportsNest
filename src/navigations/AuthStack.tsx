import React from 'react';
import { StyleSheet, View } from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import WelcomePage from '@/screens/auth_screens/WelcomePage';
import SignInScreen from '@/screens/auth_screens/SignInScreen';
import SignUpScreen from '@/screens/auth_screens/SignUpScreen';
import OTPVerificationScreen from '@/screens/auth_screens/OTPVerificationScreen';
import ForgotPasswordScreen from '@/screens/auth_screens/ForgotPasswordScreen';
import CreateNewPasswordScreen from '@/screens/auth_screens/CreateNewPasswordScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{headerShown:false}}
        >
            <Stack.Screen name="WelcomePage" component={WelcomePage}/>
            <Stack.Screen name="SignInScreen" component={SignInScreen}/>
            <Stack.Screen name="SignUpScreen" component={SignUpScreen}/>
            <Stack.Screen name='OTPVerificationScreen' component={OTPVerificationScreen}/>
            <Stack.Screen name='ForgotPasswordScreen' component={ForgotPasswordScreen}/>
            <Stack.Screen name='CreateNewPasswordScreen' component={CreateNewPasswordScreen} />

        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({})

export default AuthStack;
