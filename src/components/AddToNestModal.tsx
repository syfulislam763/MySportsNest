import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Modal } from 'react-native';
import { X, Search } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TrendingItem = {
    id: string;
    name: string;
    type: 'Team' | 'Athlete' | 'League';
    followers: string;
    image: any;
    isSelected: boolean;
};

type AddToNestModalProps = {
    visible: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onConfirm: () => void;
};

const AddToNestModal = ({ visible, onClose, onConfirm }: AddToNestModalProps) => {
    const [activeTab, setActiveTab] = useState('Trending Teams');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState<string[]>(['1', '2', '3']);
    const insets = useSafeAreaInsets();

    const barcelona = require("../../assets/temp/test_p1.jpg");

    const trendingData: TrendingItem[] = [
        { id: '1', name: 'Manchester United', type: 'Team', followers: '5.2M followers', image: barcelona, isSelected: true },
        { id: '2', name: 'Cristiano Ronaldo', type: 'Athlete', followers: '8.9M followers', image: barcelona, isSelected: true },
        { id: '3', name: 'LeBron James', type: 'Athlete', followers: '8.9M followers', image: barcelona, isSelected: true },
        { id: '4', name: 'Manchester', type: 'League', followers: '6.5M followers', image: barcelona, isSelected: false },
        { id: '5', name: 'Los Angeles Lakers', type: 'Team', followers: '5.2M followers', image: barcelona, isSelected: false },
        { id: '6', name: 'FC Barcelona', type: 'Team', followers: '5.2M followers', image: barcelona, isSelected: false },
        { id: '7', name: 'Lionel Messi', type: 'League', followers: '6.5M followers', image: barcelona, isSelected: false },
        { id: '8', name: 'New York Yankees', type: 'Team', followers: '5.2M followers', image: barcelona, isSelected: false },
    ];

    const tabs = ['Trending Teams', 'Popular Athletes', 'Leagues by Region'];

    const toggleSelection = (id: string) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const renderTrendingItem = ({ item }: { item: TrendingItem }) => (
        <TouchableOpacity 
            className={`flex-row items-center justify-between bg-white/10 border  rounded-2xl p-4 mb-3 ${selectedItems.includes(item.id)? "border-[#7ac7ea]/90": "border-gray-200"}`}
            onPress={() => toggleSelection(item.id)}
        >
            <View className="flex-row items-center flex-1">
                <Image 
                    source={item.image}
                    className="w-12 h-12 rounded-full mr-3"
                    style={{ resizeMode: 'cover' }}
                />
                <View className="flex-1">
                    <Text className="text-black text-base font-oswald-semiBold">{item.name}</Text>
                    <Text className="text-gray-500 text-sm font-oswald-regular">{item.type} • {item.followers}</Text>
                </View>
            </View>
            <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${selectedItems.includes(item.id) ? 'bg-[#7ac7ea] border-[#7ac7ea]' : 'border-gray-400'}`}>
                {selectedItems.includes(item.id) && (
                    <View className="w-3 h-3 bg-white rounded-full" />
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => onClose(false)}
        >
            <SafeAreaView className="flex-1 bg-white/10">
                <View className='bg-white/90 mt-20 pt-5 rounded-tl-[40px] rounded-tr-[40px]'>
                    <View className="pb-4 px-4 ">
                        <View className="flex-row items-center justify-center mb-4">
                            <View className="w-10" />
                            <Text className="text-black text-xl font-oswald-semiBold">Add to Nest</Text>
                            {/* <TouchableOpacity onPress={() => onClose(false)}>
                                <X size={24} color="black" />
                            </TouchableOpacity> */}
                        </View>

                        <View className="bg-gray-200 rounded-xl px-4 py-3 flex-row items-center mb-4">
                            <TextInput
                                className="flex-1 text-sm font-oswald-regular"
                                placeholder="Search teams, athletes, leagues..."
                                placeholderTextColor="#a0a0a0"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                            <Search size={20} color="#a0a0a0" />
                        </View>

                        <View className="flex-row items-center justify-between mb-4">
                            {tabs.map((tab) => (
                                <TouchableOpacity
                                    key={tab}
                                    className={`mr-3 px-4 py-2 rounded-xl ${activeTab === tab ? 'bg-[#7ac7ea]' : 'bg-gray-100'}`}
                                    onPress={() => setActiveTab(tab)}
                                >
                                    <Text className={`text-sm font-oswald-regular ${activeTab === tab ? 'text-white' : 'text-gray-600'}`}>
                                        {tab}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text className="text-black text-lg font-oswald-semiBold mb-3">Trending</Text>
                    </View>

                    <FlatList
                        data={trendingData}
                        renderItem={renderTrendingItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 270 }}
                    />

                    
                </View>
                <View 
                    className="absolute bottom-0 left-0 right-0 bg-white/90 border-t border-gray-200 px-4 py-4 flex-row items-center justify-between"
                    style={{
                        paddingBottom: insets.bottom + 10
                    }}
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