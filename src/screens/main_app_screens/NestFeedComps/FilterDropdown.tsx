import React, { memo, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SlidersHorizontal, X } from 'lucide-react-native';
import { useNestFeed } from '@/hooks/useNestFeed';

const FILTER_OPTIONS = ['Teams', 'Athletes', 'Leagues', 'News', 'Videos', 'Articles'];

type Props = {
    isOpen: boolean;
    selectedFilters: string[];
    onToggle: () => void;
    onToggleFilter: (filter: string) => void;
    onApply: () => void;
    onClear: () => void;
    onClose: () => void;
};

const FilterDropdown = memo(({scrollSignal, filterHide, setSortHide}: {scrollSignal:number, filterHide?: boolean, setSortHide: (val: boolean)=> boolean} | any) => {
    const {filterOpen, selectedFilters, toggleFilterPanel, toggleFilter, handleApplyFilter, clearFilter, resetFilterSort} = useNestFeed()

    useEffect(() => {
        resetFilterSort();
    }, [scrollSignal, filterHide])
    return (
    <View>
        <TouchableOpacity
            className="flex-row items-center border border-white/30 rounded-full px-3 py-1"
            onPress={() => {
                toggleFilterPanel();
                setSortHide((p:boolean) => !p)
            }}
        >
            <SlidersHorizontal size={18} color="white" />
            <Text className="text-white text-sm font-oswald-regular ml-1">Filter</Text>

            {selectedFilters.length > 0 && (
                <View className="ml-1 flex-row items-center bg-slate-600 rounded-2xl px-1.5 py-1">
                    <Text className="text-white text-sm font-oswald-regular mr-1">
                        {selectedFilters[0]}
                    </Text>
                    <X
                        color="white"
                        size={15}
                        onPress={(e) => {
                            e.stopPropagation?.();
                            clearFilter()
                        }}
                    />
                </View>
            )}
        </TouchableOpacity>

        {filterOpen && (
            <View
                className="absolute top-10 left-0 bg-white/90 rounded-xl p-3 z-50"
                style={{ width: 200 }}
            >
                <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-[#5e5e5e] text-base font-oswald-medium">Filters</Text>
                    <TouchableOpacity onPress={toggleFilterPanel}>
                        <X size={20} color="#5e5e5e" />
                    </TouchableOpacity>
                </View>

                {FILTER_OPTIONS.map((option) => (
                    <TouchableOpacity
                        key={option}
                        className="flex-row items-center py-2"
                        onPress={() => toggleFilter(option)}
                    >
                        <View
                            className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
                                selectedFilters.includes(option)
                                    ? 'bg-[#7ac7ea] border-[#7ac7ea]'
                                    : 'border-gray-400'
                            }`}
                        >
                            {selectedFilters.includes(option) && (
                                <View className="w-2 h-2 bg-white rounded-full" />
                            )}
                        </View>
                        <Text className="text-sm font-oswald-regular text-[#5e5e5e]">{option}</Text>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity
                    className="bg-[#7ac7ea]/70 rounded-full py-2 mt-2"
                    onPress={handleApplyFilter}
                >
                    <Text className="text-white text-center text-sm font-oswald-medium">Apply</Text>
                </TouchableOpacity>
            </View>
        )}
    </View>
)
});

FilterDropdown.displayName = 'FilterDropdown';
export default FilterDropdown;