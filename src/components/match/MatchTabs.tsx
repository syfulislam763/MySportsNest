import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';

const MatchTabs = ({
    tabs,
    activeTab,
    onSelect,
}: {
    tabs: string[];
    activeTab: number;
    onSelect: (i: number) => void;
}) => (
    <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-3"
        contentContainerStyle={{ paddingHorizontal: 4 }}
    >
        {tabs.map((tab, i) => (
            <TouchableOpacity
                key={tab}
                onPress={() => onSelect(i)}
                className={`mr-2 px-4 py-2 rounded-full ${activeTab === i ? 'bg-[#7ac7ea]' : 'bg-[#3a3a3a]'}`}
            >
                <Text className={`text-sm font-oswald-semiBold ${activeTab === i ? 'text-[#2d2d2d]' : 'text-white'}`} numberOfLines={1}>
                    {tab}
                </Text>
            </TouchableOpacity>
        ))}
    </ScrollView>
);

export default MatchTabs;