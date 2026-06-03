import React, { memo } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { Search } from 'lucide-react-native';
import { BASE_URL } from '@/constants/Path';

type Props = {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    profilePicture?: string | null;
    onProfilePress: () => void;
};

const appIcon = require('../../../../assets/img/appIcon.png');

const NestFeedHeader = memo(({ searchQuery, onSearchChange, profilePicture, onProfilePress }: Props) => (
    <View className="flex-row items-center justify-between mb-4 mx-3">
        <Image
            source={appIcon}
            className="w-14 h-14"
            style={{ resizeMode: 'contain' }}
        />

        <View className="flex-1 mx-2">
            <TextInput
                className="bg-white rounded-xl px-2 py-3 pr-12 text-sm font-oswald-regular"
                placeholder="Search teams, athletes, leagues..."
                placeholderTextColor="#a0a0a0"
                value={searchQuery}
                onChangeText={onSearchChange}
            />
            <View className="absolute right-4 top-3">
                <Search size={22} color="#5e5e5e" />
            </View>
        </View>

        <TouchableOpacity onPress={onProfilePress}>
            <Image
                source={
                    profilePicture
                        ? { uri: BASE_URL + profilePicture }
                        : require('../../../../assets/temp/test_p1.jpg')
                }
                className="w-12 h-12 rounded-full"
                style={{ resizeMode: 'cover' }}
            />
        </TouchableOpacity>
    </View>
));

NestFeedHeader.displayName = 'NestFeedHeader';
export default NestFeedHeader;