import React, { useState } from 'react';
import { View, Text, Switch, ScrollView } from 'react-native';
import WrapperComponent from '@/components/WrapperComponent';
import BackButton from '@/components/BackButton';

interface NotificationItem {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
}

const NotificationSettings = () => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([
        {
            id: '1',
            title: 'Nest Event Start',
            description: 'Get notified when an event in your Nest begins',
            enabled: true,
        },
        {
            id: '2',
            title: 'Breaking News From Your Nest',
            description: 'Get Notified when your Nest has important news',
            enabled: true,
        },
        {
            id: '3',
            title: 'Added Source Post Alert',
            description: 'Updates from verified journalists',
            enabled: false,
        },
        {
            id: '4',
            title: 'Highlights Available',
            description: 'When event highlights become available',
            enabled: true,
        },
        {
            id: '5',
            title: 'Final Score Updates',
            description: 'Get notified when an event in your Nest has a final score',
            enabled: true,
        },
        {
            id: '6',
            title: '3-Post Activity Alert',
            description: 'Get notified when an entity in your Nest has 3 new posts',
            enabled: true,
        },
    ]);

    const toggleSwitch = (id: string) => {
        setNotifications(prevNotifications =>
            prevNotifications.map(item =>
                item.id === id ? { ...item, enabled: !item.enabled } : item
            )
        );
    };

    return (
        <WrapperComponent
            title=""
            bg_color="bg-[#5e5e5e]"
            container_bg="bg-[#5e5e5e]"
            headerComponent={() => (
                <View className="flex-row items-center mb-4 mx-5">
                    <BackButton />
                    <Text className="text-white text-xl font-oswald-semiBold ml-4">
                        Notification Settings
                    </Text>
                </View>
            )}
        >
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                <View className=" bg-[#4a4a4a] rounded-3xl p-6 mb-6">
                    <Text className="text-white text-2xl font-oswald-bold mb-6">
                        Alerts
                    </Text>
                    
                    {notifications.map((item, index) => (
                        <View key={item.id}>
                            <View className="flex-row justify-between items-start py-4">
                                <View className="flex-1 pr-4">
                                    <Text className="text-white text-base font-oswald-semiBold mb-1">
                                        {item.title}
                                    </Text>
                                    <Text className="text-gray-300 text-sm font-oswald-regular">
                                        {item.description}
                                    </Text>
                                </View>
                                
                                <Switch
                                    trackColor={{ false: '#767577', true: '#7ac7ea' }}
                                    thumbColor={item.enabled ? '#ffffff' : '#f4f3f4'}
                                    onValueChange={() => toggleSwitch(item.id)}
                                    value={item.enabled}
                                />
                            </View>
                            
                            {index < notifications.length - 1 && (
                                <View className="h-[1px] bg-gray-600" />
                            )}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </WrapperComponent>
    );
};

export default NotificationSettings;