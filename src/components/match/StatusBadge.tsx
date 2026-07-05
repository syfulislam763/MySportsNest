import React from 'react';
import { View, Text } from 'react-native';

const StatusBadge = ({ status }: { status: string }) => {
    const isLive = status === 'live';
    return (
        <View className={`px-3 py-0.5 rounded-full ${isLive ? 'bg-red-500' : 'bg-gray-600'}`}>
            <Text className="text-white text-xs font-oswald-semiBold uppercase tracking-widest">
                {isLive ? '● LIVE' : 'FT'}
            </Text>
        </View>
    );
};

export default StatusBadge;