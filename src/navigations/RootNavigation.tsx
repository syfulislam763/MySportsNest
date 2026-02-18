import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuth } from '@/context/AuthProvider';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import { useAuthStore } from '@/context/useAuthStore';

const RootNavigation = () => {

    const isAuthenticated = useAuthStore(state => state.isAuthenticated)
   
    return isAuthenticated?<MainStack/>:<AuthStack/>
    
}

const styles = StyleSheet.create({})

export default RootNavigation;