import React from 'react';
import { View, Text } from 'react-native';

const StatBar = ({ label, home, away }: { label: string; home: string | number | null; away: string | number | null }) => {
    if (home === null && away === null) return null;
    const hVal = parseFloat(String(home ?? 0));
    const aVal = parseFloat(String(away ?? 0));
    const total = hVal + aVal || 1;
    const hPct = (hVal / total) * 100;

    return (
        <View className="mb-3">
            <View className="flex-row justify-between mb-1">
                <Text className="text-white text-sm font-oswald-semiBold">{home ?? 0}</Text>
                <Text className="text-gray-400 text-xs font-oswald-regular">{label}</Text>
                <Text className="text-white text-sm font-oswald-semiBold">{away ?? 0}</Text>
            </View>
            <View className="flex-row h-1.5 rounded-full overflow-hidden bg-[#3a3a3a]">
                <View className="bg-[#7ac7ea] rounded-full" style={{ width: `${hPct}%` }} />
                <View className="bg-[#ef4444] flex-1 rounded-full" />
            </View>
        </View>
    );
};

export default StatBar;