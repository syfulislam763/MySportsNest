import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import WrapperComponent from '@/components/WrapperComponent';
import BackButton from '@/components/BackButton';
import { OnboardingAPI } from '../onboarding_screens/onboardingApi';
import { remove_nest_entity } from '../onboarding_screens/onboardingApi';
import { setLoadingFalse, setLoadingTrue } from '@/context/useLoadingStore';
import { useAuthStore } from '@/context/useAuthStore';


interface NestItem {
    id: string;
    name: string;
    type: 'Team' | 'League' | 'Athlete';
    image: any;
}

interface NEST_ITEM {
    entity: {
        id: number;
        name: string;
        logo_url: string;
    }
}

const YourNestSummary = () => {
    const [nestItems, setNestItems] = useState<NestItem[]>([]);
    const nestCount = useAuthStore((s) => s.profile?.nest_count);
    const updateProfile = useAuthStore((s) => s.updateProfile)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await OnboardingAPI.get_nest_data()
                const temp = (res?.data?.entities ?? []).map((it: NEST_ITEM) => ({
                    id: String(it.entity.id),
                    name: it.entity.name,
                    image: it.entity.logo_url,
                }))
                setNestItems(temp)
            } catch (_) {}
        }
        fetchData()
    }, [])

    const handleDelete = (id: string) => {
        setLoadingTrue();
        remove_nest_entity({ entity_id: Number(id) }, res => {
            setLoadingFalse();
            if (res) {
                setNestItems(prev => prev.filter(item => item.id !== id));
                updateProfile({nest_count: nestCount?nestCount-1:0})
            }
        })
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
                                    source={typeof item.image === 'string' ? { uri: item.image } : item.image}
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