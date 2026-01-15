import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { MapPin, Tv } from 'lucide-react-native';
import WrapperComponent from '@/components/WrapperComponent';
import BackButton from '@/components/BackButton';

type TabType = 'overview' | 'stats';

interface PlayerStat {
    id: string;
    name: string;
    stat: string;
    image: any;
}

const EventDetailsScreen = () => {
    const [activeTab, setActiveTab] = useState<TabType>('overview');

    const playerImage = require('../../../assets/temp/test_p1.jpg');

    return (
        <WrapperComponent
            title=""
            bg_color="bg-[#5e5e5e]"
            container_bg="bg-[#5e5e5e]"
            headerComponent={() => (
                <View className="flex-row items-center mb-4 mx-5">
                    <BackButton />
                    <Text className="text-white text-xl font-oswald-semiBold ml-4">
                        Event Details
                    </Text>
                </View>
            )}
        >
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                <View className="">
                    <View className="w-full h-32 rounded-xl overflow-hidden mb-3">
                        <Image 
                            source={playerImage}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </View>

                    <Text className="text-white text-center text-sm font-oswald-regular mb-4">
                        May 12, 2024 - 7:00 PM (PDT) - Upcoming
                    </Text>

                    <View className="flex-row mb-6">
                        <TouchableOpacity
                            onPress={() => setActiveTab('overview')}
                            className="flex-1"
                        >
                            <Text
                                className={`text-center text-base font-oswald-semiBold pb-3 ${
                                    activeTab === 'overview' ? 'text-white' : 'text-gray-400'
                                }`}
                            >
                                Overview
                            </Text>
                            {activeTab === 'overview' && (
                                <View className="h-0.5 bg-[#7ac7ea]" />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setActiveTab('stats')}
                            className="flex-1"
                        >
                            <Text
                                className={`text-center text-base font-oswald-semiBold pb-3 ${
                                    activeTab === 'stats' ? 'text-white' : 'text-gray-400'
                                }`}
                            >
                                Stats
                            </Text>
                            {activeTab === 'stats' && (
                                <View className="h-0.5 bg-[#7ac7ea]" />
                            )}
                        </TouchableOpacity>
                    </View>

                    {activeTab === 'overview' ? (
                        <View>
                            <Text className="text-white text-lg font-oswald-bold mb-4">
                                Event Timeline
                            </Text>

                            <View className="mb-6">
                                <View className="flex-row mb-4">
                                    <View className="items-center mr-4">
                                        <View className="w-8 h-8 bg-white rounded items-center justify-center">
                                            <Text className="text-[#5e5e5e] text-xs font-oswald-bold">H1</Text>
                                        </View>
                                        <View className="w-0.5 h-10 bg-white/30 my-1" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white text-base font-oswald-semiBold">
                                            Game Start
                                        </Text>
                                        <Text className="text-gray-300 text-sm font-oswald-regular">
                                            7:00 PM
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row mb-4">
                                    <View className="items-center mr-4">
                                        <View className="w-8 h-8 bg-white rounded items-center justify-center">
                                            <Text className="text-[#5e5e5e] text-xs font-oswald-bold">H2</Text>
                                        </View>
                                        <View className="w-0.5 h-10 bg-white/30 my-1" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white text-base font-oswald-semiBold">
                                            Half Time
                                        </Text>
                                        <Text className="text-gray-300 text-sm font-oswald-regular">
                                            8:30 PM
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row">
                                    <View className="items-center mr-4">
                                        <View className="w-8 h-8 bg-white rounded items-center justify-center">
                                            <Text className="text-[#5e5e5e] text-xs font-oswald-bold">H3</Text>
                                        </View>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white text-base font-oswald-semiBold">
                                            Game End
                                        </Text>
                                        <Text className="text-gray-300 text-sm font-oswald-regular">
                                            10:00 PM
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <Text className="text-white text-lg font-oswald-bold mb-3">
                                Venue
                            </Text>
                            <View className="flex-row items-center mb-6">
                                <MapPin size={20} color="white" />
                                <View className="ml-3">
                                    <Text className="text-white text-base font-oswald-semiBold">
                                        Crypto.com Arena
                                    </Text>
                                    <Text className="text-gray-300 text-sm font-oswald-regular">
                                        Los Angeles, CA
                                    </Text>
                                </View>
                            </View>

                            <Text className="text-white text-lg font-oswald-bold mb-3">
                                Broadcaster
                            </Text>
                            <View className="flex-row items-center mb-6">
                                <Tv size={20} color="white" />
                                <Text className="text-white text-base font-oswald-semiBold ml-3">
                                    ESPN
                                </Text>
                            </View>

                            <Text className="text-white text-lg font-oswald-bold mb-3">
                                Related News
                            </Text>
                            <View className="mb-6">
                                <Text className="text-[#7ac7ea] text-sm font-oswald-semiBold mb-2">
                                    NBA
                                </Text>
                                <Text className="text-white text-base font-oswald-semiBold mb-2">
                                    Lakers' star player out for the season
                                </Text>
                                <Text className="text-gray-300 text-sm font-oswald-regular">
                                    Injury sidelines key player, impacting team's playoff chances.
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <View>
                            <Text className="text-white text-lg font-oswald-bold mb-4">
                                Scoreboard
                            </Text>

                            <View className="bg-[#4a4a4a] rounded-xl p-4 mb-6">
                                <View className="flex-row items-center justify-between mb-2">
                                    <View className="flex-row items-center">
                                        <View className="w-8 h-8 bg-white rounded-full mr-3" />
                                        <Text className="text-white text-base font-oswald-semiBold">
                                            Lakers 102 - Warriors 98
                                        </Text>
                                    </View>
                                </View>
                                <Text className="text-gray-400 text-sm font-oswald-regular">
                                    Final Score
                                </Text>
                            </View>

                            <Text className="text-white text-lg font-oswald-bold mb-4">
                                Quarter Breakdown
                            </Text>

                            <View className="mb-6">
                                <View className="flex-row justify-between mb-4">
                                    <View className="flex-1 mr-2">
                                        <Text className="text-gray-400 text-sm font-oswald-semiBold mb-1">
                                            Q1
                                        </Text>
                                        <Text className="text-white text-base font-oswald-bold">
                                            26-22
                                        </Text>
                                    </View>
                                    <View className="flex-1 ml-2">
                                        <Text className="text-gray-400 text-sm font-oswald-semiBold mb-1">
                                            Q2
                                        </Text>
                                        <Text className="text-white text-base font-oswald-bold">
                                            28-24
                                        </Text>
                                    </View>
                                </View>

                                <View className="w-full h-px bg-gray-600 mb-4" />

                                <View className="flex-row justify-between">
                                    <View className="flex-1 mr-2">
                                        <Text className="text-gray-400 text-sm font-oswald-semiBold mb-1">
                                            Q3
                                        </Text>
                                        <Text className="text-white text-base font-oswald-bold">
                                            24-26
                                        </Text>
                                    </View>
                                    <View className="flex-1 ml-2">
                                        <Text className="text-gray-400 text-sm font-oswald-semiBold mb-1">
                                            Q4
                                        </Text>
                                        <Text className="text-white text-base font-oswald-bold">
                                            25-26
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <Text className="text-white text-lg font-oswald-bold mb-4">
                                Key Player Stats
                            </Text>

                            <View className="mb-6">
                                <View className="flex-row items-center bg-[#4a4a4a] rounded-xl p-3 mb-3">
                                    <View className="w-12 h-12 rounded-full bg-white overflow-hidden">
                                        <Image 
                                            source={playerImage}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        />
                                    </View>
                                    <View className="flex-1 ml-3">
                                        <Text className="text-white text-base font-oswald-semiBold">
                                            LeBron James
                                        </Text>
                                        <Text className="text-gray-300 text-sm font-oswald-regular">
                                            Points: 32
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center bg-[#4a4a4a] rounded-xl p-3">
                                    <View className="w-12 h-12 rounded-full bg-white overflow-hidden">
                                        <Image 
                                            source={playerImage}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        />
                                    </View>
                                    <View className="flex-1 ml-3">
                                        <Text className="text-white text-base font-oswald-semiBold">
                                            Stephen Curry
                                        </Text>
                                        <Text className="text-gray-300 text-sm font-oswald-regular">
                                            Points: 28
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            <View className=" pb-5 pt-3">
                <TouchableOpacity className="bg-[#7ac7ea] rounded-xl py-4 mb-3">
                    <Text className="text-white text-center text-base font-oswald-semiBold">
                        Add to My Nest
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity className="bg-transparent border-2 border-white rounded-xl py-4">
                    <Text className="text-white text-center text-base font-oswald-semiBold">
                        Watch Live (URL)
                    </Text>
                </TouchableOpacity>
            </View>
        </WrapperComponent>
    );
};

export default EventDetailsScreen;