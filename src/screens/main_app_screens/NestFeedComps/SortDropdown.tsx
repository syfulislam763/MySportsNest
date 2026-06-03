import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronDown, X } from 'lucide-react-native';
import { useNestFeed } from '@/hooks/useNestFeed';

const SORT_OPTIONS = ['Latest', 'Oldest', 'Most Liked', 'Least Liked'];

const SortDropdown = memo(() => {
    const { sortOpen, selectedSort, toggleSort, handleSort, clearSort, filterOpen, toggleFilterPanel } = useNestFeed();

    return (
        <View>
            <TouchableOpacity
                className="flex-row items-center mr-3 border border-white/30 rounded-full px-3 py-1"
                onPress={() => {
                    if(filterOpen){
                        toggleFilterPanel()
                    }
                    toggleSort()
                }}
            >
                <Text className="text-white text-sm font-oswald-regular mr-1">Sort</Text>
                <ChevronDown size={16} color="white" />

                {selectedSort ? (
                    <View className="ml-1 flex-row items-center bg-slate-600 rounded-2xl px-1.5 py-1">
                        <Text className="text-white text-sm font-oswald-regular mr-1">{selectedSort}</Text>
                        <X
                            color="white"
                            size={15}
                            onPress={(e) => {
                                e.stopPropagation?.();
                                clearSort();
                            }}
                        />
                    </View>
                ) : null}
            </TouchableOpacity>

            {sortOpen && (
                <View className="absolute top-10 left-0 bg-white/90 rounded-xl p-3 z-50" style={{ width: 200 }}>
                    {/* Close button header — matches FilterDropdown */}
                    <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-[#5e5e5e] text-base font-oswald-medium">Sort</Text>
                        <TouchableOpacity onPress={toggleSort}>
                            <X size={20} color="#5e5e5e" />
                        </TouchableOpacity>
                    </View>

                    {SORT_OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option}
                            className="py-2 px-1"
                            onPress={() => handleSort(option)}
                        >
                            <Text
                                className={`text-sm font-oswald-regular ${
                                    selectedSort === option ? 'text-[#7ac7ea]' : 'text-[#5e5e5e]'
                                }`}
                            >
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
});

SortDropdown.displayName = 'SortDropdown';
export default SortDropdown;