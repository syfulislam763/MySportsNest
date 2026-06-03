import React, { memo } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { Check, Plus } from 'lucide-react-native';
import { SearchEntity } from '@/hooks/useNestFeed';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '@/navigations/types';

type NavigationProps = StackNavigationProp<MainStackParamList>;

type Props = {
    results: SearchEntity[];
    selectedItems: number[];
    onToggleItem: (id: number) => void;
    onClearSearch: () => void;
};

const SearchResultItem = memo(({
    item,
    isSelected,
    onToggleItem,
    onNavigate,
}: {
    item: SearchEntity;
    isSelected: boolean;
    onToggleItem: (id: number) => void;
    onNavigate: (item: SearchEntity) => void;
}) => (
    <TouchableOpacity
        className={`flex-row items-center border rounded-2xl p-4 mb-3 ${
            isSelected ? 'border-[#7ac7ea]/90' : 'border-gray-200'
        } bg-white/10`}
        onPress={() => onNavigate(item)}
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
            <Text className="text-white text-sm font-oswald-regular">
                {item.type} • {item.follower_count}
            </Text>
        </View>
        <TouchableOpacity
            className="w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: isSelected ? '#7ac7ea' : 'transparent' }}
            onPress={() => onToggleItem(item.id)}
        >
            {isSelected ? (
                <Check size={20} color="white" />
            ) : (
                <Plus size={24} color="#7ac7ea" />
            )}
        </TouchableOpacity>
    </TouchableOpacity>
));

SearchResultItem.displayName = 'SearchResultItem';

const SearchResults = memo(({ results, selectedItems, onToggleItem, onClearSearch }: Props) => {
    const navigation = useNavigation<NavigationProps>();

    const handleNavigate = (item: SearchEntity) => {
        onClearSearch();
        navigation.navigate('TeamDetailScreen', {
            entity_id: Number(item.id),
            logo: item.logo_url,
        });
    };

    return (
        <View className="absolute bg-[#5e5e5e] top-0 left-0 right-0 max-h-96 rounded-br-2xl rounded-bl-2xl shadow-slate-800 z-50">
            <View className="px-6 w-full">
                <FlatList
                    data={results}
                    keyExtractor={(item) => String(item.id)}
                    style={{ width: '100%' }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <SearchResultItem
                            item={item}
                            isSelected={selectedItems.includes(item.id)}
                            onToggleItem={onToggleItem}
                            onNavigate={handleNavigate}
                        />
                    )}
                />
            </View>
        </View>
    );
});

SearchResults.displayName = 'SearchResults';
export default SearchResults;