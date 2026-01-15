import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import WrapperComponent from '@/components/WrapperComponent';
import BackButton from '@/components/BackButton';

interface NestItem {
    id: string;
    name: string;
    type: 'Team' | 'League' | 'Athlete';
    image: any;
}

const YourNestSummary = () => {
    const nestItems: NestItem[] = [
        {
            id: '1',
            name: 'Manchester United',
            type: 'Team',
            image: require('../../../assets/temp/test_p1.jpg'),
        },
        {
            id: '2',
            name: 'New York Yankees',
            type: 'Team',
            image: require('../../../assets/temp/test_p1.jpg'),
        },
        {
            id: '3',
            name: 'Lionel Messi',
            type: 'League',
            image: require('../../../assets/temp/test_p1.jpg'),
        },
        {
            id: '4',
            name: 'FC Barcelona',
            type: 'Team',
            image: require('../../../assets/temp/test_p1.jpg'),
        },
        {
            id: '5',
            name: 'Los Angeles Lakers',
            type: 'Team',
            image: require('../../../assets/temp/test_p1.jpg'),
        },
        {
            id: '6',
            name: 'Manchester',
            type: 'League',
            image: require('../../../assets/temp/test_p1.jpg'),
        },
        {
            id: '7',
            name: 'LeBron James',
            type: 'Athlete',
            image: require('../../../assets/temp/test_p1.jpg'),
        },
        {
            id: '8',
            name: 'Cristiano Ronaldo',
            type: 'Athlete',
            image: require('../../../assets/temp/test_p1.jpg'),
        },
    ];

    const handleDelete = (id: string) => {
        console.log('Delete item:', id);
    };

    return (
        <WrapperComponent
            title=""
            bg_color="bg-[#5e5e5e]"
            container_bg="bg-[#5e5e5e]"
            headerComponent={() => (
                <View className="flex-row items-center mb-4 mx-5">
                    <BackButton />
                    <Text className="text-white text-xl font-oswald-semiBold ml-4">Your Nest Summary</Text>
                </View>
            )}
        >
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                <View className="flex-1">
                    {nestItems.map((item) => (
                        <View
                            key={item.id}
                            className="flex-row items-center bg-[#4a4a4a] rounded-xl p-4 mb-3"
                        >
                            <View className="w-12 h-12 rounded-full bg-white items-center justify-center overflow-hidden">
                                <Image 
                                    source={item.image}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            </View>

                            <View className="flex-1 ml-4">
                                <Text className="text-white text-base font-oswald-semiBold">
                                    {item.name}
                                </Text>
                                <Text className="text-gray-400 text-sm font-oswald-regular mt-0.5">
                                    {item.type}
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => handleDelete(item.id)}
                                className="p-2"
                            >
                                <Trash2 size={24} color="#ef4444" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </WrapperComponent>
    );
};

export default YourNestSummary;