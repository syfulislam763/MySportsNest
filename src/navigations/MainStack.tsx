import React from 'react';
import { StyleSheet, View } from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import WelcomeMyNestScreen from '@/screens/onboarding_screens/WelcomeMyNestScreen';
import ScoreVisibilityScreen from '@/screens/onboarding_screens/ScoreVisivilityScreen';
import NestFeedScreen from '@/screens/main_app_screens/NestFeedScreen';
import TeamDetailScreen from '@/screens/main_app_screens/TeamDetailScreen';
import ProfileSettingsScreen from '@/screens/profile_screens/ProfileSettingsScreen';
import GoAdFreeScreen from '@/screens/profile_screens/GoAdFreeScreen';
import EditProfileScreen from '@/screens/profile_screens/EditProfileScreen';
import YourNestSummary from '@/screens/profile_screens/YourNestSummary';
import NotificationSettings from '@/screens/profile_screens/NotificationSettings';
import ChangePassword from '@/screens/profile_screens/ChangePassword';
import EventDetailsScreen from '@/screens/main_app_screens/EventDetailsScreen';

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
            
            <Stack.Screen name='ProfileSettingsScreen' component={ProfileSettingsScreen}/>

            <Stack.Screen name='GoAdFreeScreen' component={GoAdFreeScreen} />

            <Stack.Screen name='EditProfileScreen' component={EditProfileScreen} />

            <Stack.Screen name='YourNestSummary' component={YourNestSummary}/>

            <Stack.Screen name='NotificationSettings' component={NotificationSettings} />

            <Stack.Screen name='ChangePassword' component={ChangePassword} />

            <Stack.Screen name='EventDetailsScreen' component={EventDetailsScreen} />

        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({})

export default MainStack;
