import React from 'react';
import { View, Text } from 'react-native';
import { CricketBatsman, CricketBowler, ScorecardEntry } from './match_types';

const CricketInnings = ({ entries }: { entries: ScorecardEntry[] }) => {
    const batsmen = entries.filter((e) => e.type === 'Batsman') as CricketBatsman[];
    const bowlers = entries.filter((e) => e.type === 'Bowler') as CricketBowler[];

    return (
        <View className="mb-4">
            <View className="bg-[#3a3a3a] rounded-xl overflow-hidden mb-3">
                <View className="flex-row bg-[#2d2d2d] px-3 py-2">
                    <Text className="text-gray-400 text-xs font-oswald-regular flex-1">Batter</Text>
                    <Text className="text-gray-400 text-xs font-oswald-regular w-10 text-right">R</Text>
                    <Text className="text-gray-400 text-xs font-oswald-regular w-10 text-right">B</Text>
                    <Text className="text-gray-400 text-xs font-oswald-regular w-8 text-right">4s</Text>
                    <Text className="text-gray-400 text-xs font-oswald-regular w-8 text-right">6s</Text>
                    <Text className="text-gray-400 text-xs font-oswald-regular w-14 text-right">SR</Text>
                </View>
                {batsmen.map((b, i) => (
                    <View key={i} className={`px-3 py-2.5 ${i < batsmen.length - 1 ? 'border-b border-[#444]' : ''}`}>
                        <View className="flex-row items-center">
                            <View className="flex-1 pr-2">
                                <Text className="text-white text-sm font-oswald-semiBold">
                                    {b.player}
                                    {b.status === 'not out' ? <Text className="text-[#7ac7ea]"> *</Text> : null}
                                </Text>
                                <Text className="text-gray-400 text-xs font-oswald-regular mt-0.5" numberOfLines={1}>
                                    {b.status}
                                </Text>
                            </View>
                            <Text className="text-white text-sm font-oswald-semiBold w-10 text-right">{b.R}</Text>
                            <Text className="text-gray-400 text-sm font-oswald-regular w-10 text-right">{b.B}</Text>
                            <Text className="text-gray-400 text-sm font-oswald-regular w-8 text-right">{b['4s']}</Text>
                            <Text className="text-gray-400 text-sm font-oswald-regular w-8 text-right">{b['6s']}</Text>
                            <Text className="text-gray-400 text-sm font-oswald-regular w-14 text-right">{b.SR}</Text>
                        </View>
                    </View>
                ))}
            </View>

            <View className="bg-[#3a3a3a] rounded-xl overflow-hidden">
                <View className="flex-row bg-[#2d2d2d] px-3 py-2">
                    <Text className="text-gray-400 text-xs font-oswald-regular flex-1">Bowler</Text>
                    <Text className="text-gray-400 text-xs font-oswald-regular w-10 text-right">O</Text>
                    <Text className="text-gray-400 text-xs font-oswald-regular w-10 text-right">R</Text>
                    <Text className="text-gray-400 text-xs font-oswald-regular w-10 text-right">W</Text>
                    <Text className="text-gray-400 text-xs font-oswald-regular w-12 text-right">ER</Text>
                </View>
                {bowlers.map((b, i) => (
                    <View key={i} className={`flex-row items-center px-3 py-2.5 ${i < bowlers.length - 1 ? 'border-b border-[#444]' : ''}`}>
                        <Text className="text-white text-sm font-oswald-regular flex-1">{b.player}</Text>
                        <Text className="text-gray-400 text-sm font-oswald-regular w-10 text-right">{b.O}</Text>
                        <Text className="text-gray-400 text-sm font-oswald-regular w-10 text-right">{b.R}</Text>
                        <Text className={`text-sm font-oswald-semiBold w-10 text-right ${Number(b.W) > 0 ? 'text-[#7ac7ea]' : 'text-gray-400'}`}>
                            {b.W}
                        </Text>
                        <Text className="text-gray-400 text-sm font-oswald-regular w-12 text-right">{b.ER}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default CricketInnings;