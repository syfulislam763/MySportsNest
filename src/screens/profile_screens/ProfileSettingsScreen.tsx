import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Switch } from 'react-native';
import { ArrowLeft, Edit2, ChevronRight, Bell, Moon, Lock, Share2, HelpCircle, Shield, Trash2, LogOut } from 'lucide-react-native';
import WrapperComponent from '@/components/WrapperComponent';
import BackButton from '@/components/BackButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '@/navigations/types';
import { useNavigation } from '@react-navigation/native';

type NavigationProps = StackNavigationProp<MainStackParamList>

const ProfileSettingsScreen = () => {
    const [showLiveScores, setShowLiveScores] = useState(true);
    const [themeEnabled, setThemeEnabled] = useState(false);

    const navigation = useNavigation<NavigationProps>()

    const profilePic = require("../../../assets/temp/test_p1.jpg");

    const stats = [
        { label: 'In Your Nest', value: '42' },
        { label: 'Saved Posts', value: '42' },
        { label: 'Streak', value: '12 Days', highlight: true },
    ];

    const personalInfo = [
        { icon: '👤', label: 'Annette Black' },
        { icon: '✉️', label: 'john-doe@example.com' },
    ];

    const preferenceItems = [
        { label: 'Your Nest Summary', hasArrow: true, onPress: () => {navigation.navigate("YourNestSummary")} },
        { 
            label: 'Show Live Scores', 
            subtitle: 'Enable to see live match scores in your feed.',
            hasSwitch: true,
            switchValue: showLiveScores,
            onSwitchChange: setShowLiveScores
        },
        { label: 'Source Management', icon: '📰', hasArrow: true, onPress: () => {} },
    ];

    const generalItems = [
        { label: 'Notifications', icon: Bell, hasArrow: true, onPress: () => { navigation.navigate("NotificationSettings")} },
        // { 
        //     label: 'Theme', 
        //     subtitle: 'Light (Coming soon)',
        //     icon: Moon,
        //     hasSwitch: true,
        //     switchValue: themeEnabled,
        //     onSwitchChange: setThemeEnabled
        // },
        { label: 'Change Password', icon: Lock, hasArrow: true, onPress: () => { navigation.navigate("ChangePassword")} },
    ];

    const supportItems = [
        { label: 'Share App Link', icon: Share2, hasArrow: true, onPress: () => {} },
        { label: 'Help Center', icon: HelpCircle, hasArrow: true, onPress: () => {} },
        { label: 'Privacy policy', icon: Shield, hasArrow: true, onPress: () => {} },
        { label: 'Delete Account', icon: Trash2, color: '#ef4444', onPress: () => {} },
        { label: 'Logout', icon: LogOut, color: '#ef4444', onPress: () => {} },
    ];

    return (
        <WrapperComponent
            title=""
            bg_color="bg-[#5e5e5e]"
            container_bg="bg-[#5e5e5e]"
            headerComponent={() => (
                <View className="flex-row items-center mb-4 mx-5">
                    <BackButton />
                    <Text className="text-white text-xl font-oswald-semiBold ml-4">Profile & Settings</Text>
                </View>
            )}
        >
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                <View className="pb-6">
                    <View className="flex-row items-center mb-6">
                        <Image 
                            source={profilePic}
                            className="w-20 h-20 rounded-full mr-4"
                            style={{ resizeMode: 'cover' }}
                        />
                        <View className="flex-1">
                            <Text className="text-white text-2xl font-oswald-semiBold">John Doe</Text>
                            <Text className="text-white/70 text-sm font-oswald-regular">john-doe@example.com</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center justify-between mb-6">
                        {stats.map((stat, index) => (
                            <View 
                                key={index}
                                className="flex-1 border border-white/30 rounded-2xl p-4 mr-2"
                                style={index === stats.length - 1 ? { marginRight: 0 } : {}}
                            >
                                <Text className="text-white/70 text-xs font-oswald-regular mb-1">{stat.label}</Text>
                                <Text className={`text-2xl font-oswald-semiBold ${stat.highlight ? 'text-[#7ac7ea]' : 'text-white'}`}>
                                    {stat.value}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <View className="bg-[#7ac7ea] rounded-xl p-5 mb-6">
                        <View className="flex-row items-center mb-3">
                            <View className="w-12 h-12 bg-white/30 rounded-full items-center justify-center mr-3">
                                <Text className="text-white text-2xl">👑</Text>
                            </View>
                            <View className="flex-1">
                                <Text className="text-white text-xl font-oswald-semiBold">Go Ad-Free</Text>
                                <Text className="text-white/90 text-sm font-oswald-regular">Enjoy Sports Nest without interruptions</Text>
                            </View>
                        </View>
                        <View className="flex-row items-center mb-4">
                            <Text className="text-white text-lg font-oswald-semiBold">$4.99 </Text>
                            <Text className="text-white/90 text-sm font-oswald-regular">/ month  or  </Text>
                            <Text className="text-white text-lg font-oswald-semiBold">$50.00 </Text>
                            <Text className="text-white/90 text-sm font-oswald-regular">/ year</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate("GoAdFreeScreen")} className="bg-white rounded-xl py-3">
                            <Text className="text-[#7ac7ea] text-center text-base font-oswald-semiBold">Subscribe Now</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="bg-gray-700 rounded-xl p-5 mb-6">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-white text-lg font-oswald-semiBold">Personal Information</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("EditProfileScreen")}>
                                <Edit2 size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                        {personalInfo.map((info, index) => (
                            <View 
                                key={index}
                                className={`flex-row items-center py-3 ${index < personalInfo.length - 1 ? 'border-b border-white/10' : ''}`}
                            >
                                <Text className="text-2xl mr-3">{info.icon}</Text>
                                <Text className="text-white text-base font-oswald-regular">{info.label}</Text>
                            </View>
                        ))}
                    </View>

                    <View className="bg-gray-700 rounded-xl p-5 mb-6">
                        <Text className="text-white text-lg font-oswald-semiBold mb-4">Manage Preferences</Text>
                        {preferenceItems.map((item, index) => (
                            <View key={index}>
                                {item.hasSwitch ? (
                                    <View className={`py-4 ${index < preferenceItems.length - 1 ? 'border-b border-white/10' : ''}`}>
                                        <View className="flex-row items-center justify-between mb-1">
                                            <Text className="text-white text-base font-oswald-regular">{item.label}</Text>
                                            <Switch
                                                value={item.switchValue}
                                                onValueChange={item.onSwitchChange}
                                                trackColor={{ false: '#4b5563', true: '#7ac7ea' }}
                                                thumbColor="white"
                                            />
                                        </View>
                                        {item.subtitle && (
                                            <Text className="text-white/60 text-sm font-oswald-regular">{item.subtitle}</Text>
                                        )}
                                    </View>
                                ) : (
                                    <TouchableOpacity 
                                        className={`flex-row items-center justify-between py-4 ${index < preferenceItems.length - 1 ? 'border-b border-white/10' : ''}`}
                                        onPress={item.onPress}
                                    >
                                        <View className="flex-row items-center flex-1">
                                            {item.icon && <Text className="text-2xl mr-3">{item.icon}</Text>}
                                            <Text className="text-white text-base font-oswald-regular">{item.label}</Text>
                                        </View>
                                        {item.hasArrow && <ChevronRight size={20} color="white" />}
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </View>

                    <View className="bg-gray-700 rounded-xl p-5 mb-6">
                        <Text className="text-white text-lg font-oswald-semiBold mb-4">General</Text>
                        {generalItems.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <View key={index}>
                                    {
                                    // item.hasSwitch ? (
                                    //     <View className={`py-4 ${index < generalItems.length - 1 ? 'border-b border-white/10' : ''}`}>
                                    //         <View className="flex-row items-center justify-between mb-1">
                                    //             <View className="flex-row items-center flex-1">
                                    //                 <IconComponent size={20} color="white" />
                                    //                 <Text className="text-white text-base font-oswald-regular ml-3">{item.label}</Text>
                                    //             </View>
                                    //             <Switch
                                    //                 value={item.switchValue}
                                    //                 onValueChange={item.onSwitchChange}
                                    //                 trackColor={{ false: '#4b5563', true: '#7ac7ea' }}
                                    //                 thumbColor="white"
                                    //             />
                                    //         </View>
                                    //         {item.subtitle && (
                                    //             <Text className="text-white/60 text-sm font-oswald-regular ml-8">{item.subtitle}</Text>
                                    //         )}
                                    //     </View>
                                    // ) : 
                                    (
                                        <TouchableOpacity 
                                            className={`flex-row items-center justify-between py-4 ${index < generalItems.length - 1 ? 'border-b border-white/10' : ''}`}
                                            onPress={item.onPress}
                                        >
                                            <View className="flex-row items-center flex-1">
                                                <IconComponent size={20} color="white" />
                                                <Text className="text-white text-base font-oswald-regular ml-3">{item.label}</Text>
                                            </View>
                                            {item.hasArrow && <ChevronRight size={20} color="white" />}
                                        </TouchableOpacity>
                                    )}
                                </View>
                            );
                        })}
                    </View>

                    <View className="bg-gray-700 rounded-xl p-5 mb-6">
                        <Text className="text-white text-lg font-oswald-semiBold mb-4">Share & Support</Text>
                        {supportItems.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <TouchableOpacity 
                                    key={index}
                                    className={`flex-row items-center justify-between py-4 ${index < supportItems.length - 1 ? 'border-b border-white/10' : ''}`}
                                    onPress={item.onPress}
                                >
                                    <View className="flex-row items-center flex-1">
                                        <IconComponent size={20} color={item.color || 'white'} />
                                        <Text className={`text-base font-oswald-regular ml-3 ${item.color ? `text-[#ef4444]` : 'text-white'}`}>
                                            {item.label}
                                        </Text>
                                    </View>
                                    {item.hasArrow && <ChevronRight size={20} color={item.color || 'white'} />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
        </WrapperComponent>
    );
};

export default ProfileSettingsScreen;