import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Modal } from 'react-native';
import { Search, Plus, Check } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingAPI, add_nest_entity, remove_nest_entity } from '@/screens/onboarding_screens/onboardingApi';
import { setLoadingTrue, setLoadingFalse } from '@/context/useLoadingStore';

type TrendingItem = {
    id: number;
    type: string;
    name: string;
    slug: string;
    sport: string;
    logo_url: string;
    cover_image_url: string;
    description: string;
    country: string;
    follower_count: number;
    has_api_data: boolean;
    in_nest: boolean;
    created_at: string;
};

type NEST_ITEM = {
    id: number;
    entity: TrendingItem;
    position: number;
    notify_on_games: boolean;
    notify_on_news: boolean;
    added_at: string;
};

type AddToNestModalProps = {
    visible: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onConfirm: () => void;
};

const AddToNestModal = ({ visible, onClose, onConfirm }: AddToNestModalProps) => {
    const [activeTab, setActiveTab] = useState('Trending Teams');
    const [filterItem, setFilterItem] = useState('teams');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [trendingData, setTrendingData] = useState<any>({});
    const insets = useSafeAreaInsets();

    const tabs = [
        { label: 'Trending Teams', key: 'teams' },
        { label: 'Popular Athletes', key: 'athletes' },
        { label: 'Leagues by Region', key: 'leagues' },
    ];

    const fetchAll = async () => {
        setLoadingTrue();
        try {
            const [trendingRes, nestRes] = await Promise.all([
                OnboardingAPI.get_trending_data(null),
                OnboardingAPI.get_nest_data(),
            ]);
            setTrendingData(trendingRes.data);
            const selectedEntity = (nestRes?.data?.entities ?? []).map((it: NEST_ITEM) => it.entity.id);
            setSelectedItems(selectedEntity);
        } catch (e: any) {
            console.log('err', JSON.stringify(e, null, 2));
        } finally {
            setLoadingFalse();
        }
    };

    const handle_search = (value: string) => {
        setSearchQuery(value);
        OnboardingAPI.get_trending_data(value || null).then(res => {
            if (res?.data) setTrendingData(res.data);
        }).catch(() => {});
    };

    const toggleItem = (id: number) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(prev => prev.filter(item => item !== id));
            setLoadingTrue();
            remove_nest_entity({ entity_id: id }, () => setLoadingFalse());
        } else {
            setSelectedItems(prev => [...prev, id]);
            setLoadingTrue();
            add_nest_entity({ entity_id: id }, () => setLoadingFalse());
        }
    };

    useEffect(() => {
        if (visible) fetchAll();
    }, [visible]);

    const filteredData: TrendingItem[] = trendingData[filterItem] ?? [];

    const renderItem = ({ item }: { item: TrendingItem }) => {
        const isSelected = selectedItems.includes(item.id);
        return (
            <TouchableOpacity
                className={`flex-row items-center border rounded-2xl p-4 mb-3 ${isSelected ? 'border-[#7ac7ea]/90' : 'border-gray-200'} bg-white/10`}
                onPress={() => toggleItem(item.id)}
            >
                {item.logo_url ? (
                    <Image
                        source={{ uri: item.logo_url }}
                        className="w-12 h-12 rounded-full mr-3"
                        style={{ resizeMode: 'cover' }}
                    />
                ) : (
                    <View className="w-12 h-12 rounded-full bg-white mr-3" />
                )}
                <View className="flex-1">
                    <Text className="text-black text-base font-oswald-semiBold">{item.name}</Text>
                    <Text className="text-gray-500 text-sm font-oswald-regular">
                        {item.type} • {item.follower_count}
                    </Text>
                </View>
                <View
                    className="w-8 h-8 rounded-full items-center justify-center"
                    style={{ backgroundColor: isSelected ? '#7ac7ea' : 'transparent' }}
                >
                    {isSelected ? <Check size={20} color="white" /> : <Plus size={24} color="#7ac7ea" />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => onClose(false)}
        >
            <SafeAreaView className="flex-1 bg-white/10">
                <View className="bg-white/90 mt-20 pt-5 rounded-tl-[40px] rounded-tr-[40px] flex-1">
                    
                    <View className="pb-4 px-4">
                        <View className="flex-row items-center justify-center mb-4">
                            <Text className="text-black text-xl font-oswald-semiBold">Add to Nest</Text>
                        </View>

                        <View className="bg-gray-200 rounded-xl px-4 py-3 flex-row items-center mb-4">
                            <TextInput
                                className="flex-1 text-sm font-oswald-regular"
                                placeholder="Search teams, athletes, leagues..."
                                placeholderTextColor="#a0a0a0"
                                value={searchQuery}
                                onChangeText={handle_search}
                            />
                            <Search size={20} color="#a0a0a0" />
                        </View>

                        <View className="flex-row items-center justify-between mb-4">
                            {tabs.map((tab) => (
                                <TouchableOpacity
                                    key={tab.key}
                                    className={`mr-3 px-4 py-2 rounded-xl ${activeTab === tab.label ? 'bg-[#7ac7ea]' : 'bg-gray-100'}`}
                                    onPress={() => {
                                        setActiveTab(tab.label);
                                        setFilterItem(tab.key);
                                    }}
                                >
                                    <Text className={`text-sm font-oswald-regular ${activeTab === tab.label ? 'text-white' : 'text-gray-600'}`}>
                                        {tab.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text className="text-black text-lg font-oswald-semiBold mb-3">{activeTab}</Text>
                    </View>

                    <FlatList
                        data={filteredData}
                        renderItem={renderItem}
                        keyExtractor={(item) => String(item.id)}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
                    />
                </View>

                <View
                    className="absolute bottom-0 left-0 right-0 bg-white/90 border-t border-gray-200 px-4 py-4 flex-row items-center justify-between"
                    style={{ paddingBottom: insets.bottom + 10 }}
                >
                    <TouchableOpacity onPress={() => onClose(false)} className="flex-1 mr-2">
                        <Text className="text-[#7ac7ea] text-center text-base font-oswald-semiBold py-3">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onConfirm} className="flex-1 ml-2 bg-[#7ac7ea]/90 rounded-full">
                        <Text className="text-white text-center text-base font-oswald-semiBold py-3">Confirm</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

export default AddToNestModal;