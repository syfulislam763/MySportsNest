import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Heart, Bookmark, MoreVertical } from 'lucide-react-native';
import { Post } from '@/utils/main_app_types';

const extractDateParts = (dateInput: string) => {
    const date = new Date(dateInput);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    const time = date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
    return `${day} ${month} ${year}, ${time}`;
};

type Props = {
    item: Post;
    openTooltipId: number | null;
    onToggleTooltip: (id: number) => void;
    onHide: (id: number) => void;
    onLike: (id: number) => void;
    onBookmark: (id: number) => void;
};

const PostCard = memo(({
    item,
    openTooltipId,
    onToggleTooltip,
    onHide,
    onLike,
    onBookmark,
}: Props) => {
    const isTooltipOpen = openTooltipId === item.id;

    return (
        <View className="py-4 mb-4 border-b border-b-white">
            {/* Header Row */}
            <View className="flex-row items-start justify-between mb-3">
                <View className="flex-row items-start flex-1">
                    <TouchableOpacity>
                        {item.source_logo ? (
                            <Image
                                source={{ uri: item.source_logo }}
                                className="w-12 h-12 rounded-full"
                                style={{ resizeMode: 'cover' }}
                            />
                        ) : (
                            <View className="w-12 h-12 rounded-full bg-white" />
                        )}
                    </TouchableOpacity>
                    <View className="ml-3 flex-1">
                        <View className="flex-row items-center flex-wrap">
                            <Text className="text-white text-lg font-oswald-medium">
                                {item.source_name}
                            </Text>
                            <Text className="text-white/60 text-sm font-oswald-regular ml-2">
                                {'@name'}
                            </Text>
                            <Text className="text-white/60 text-sm font-oswald-regular ml-1">•</Text>
                            <Text className="text-white/60 text-sm font-oswald-regular ml-1">
                                {extractDateParts(item.published_at)}
                            </Text>
                        </View>
                        <Text className="text-white/60 text-xs font-oswald-regular mt-1">
                            {item.source_name}
                        </Text>
                    </View>
                </View>

                {/* Three-dot tooltip */}
                <View style={{ position: 'relative' }}>
                    <TouchableOpacity onPress={() => onToggleTooltip(item.id)}>
                        <MoreVertical size={24} color="white" />
                    </TouchableOpacity>

                    {isTooltipOpen && (
                        <TouchableOpacity
                            onPress={() => onHide(item.id)}
                            style={{
                                position: 'absolute',
                                top: 28,
                                right: 15,
                                backgroundColor: 'white',
                                borderTopLeftRadius: 15,
                                borderBottomRightRadius: 15,
                                paddingVertical: 8,
                                paddingHorizontal: 14,
                                zIndex: 999,
                                elevation: 10,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 3 },
                                shadowOpacity: 0.2,
                                shadowRadius: 6,
                                minWidth: 80,
                            }}
                        >
                            <Text style={{ color: '#e53935', fontSize: 13, fontFamily: 'Oswald-Medium' }}>
                                Hide post
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Content Row */}
            <View className="flex-row items-center justify-between">
                <View className="h-12 w-12" />
                <View className="flex-1 ml-3">
                    <Text className="text-white text-lg font-oswald-medium mb-2 leading-6">
                        {item.title}
                    </Text>
                    <Text className="text-white text-sm font-oswald-regular mb-4 leading-5">
                        {item.summary}
                    </Text>
                    {item.thumbnail_url && (
                        <Image
                            source={{ uri: item.thumbnail_url }}
                            className="w-full rounded-2xl mb-4"
                            style={{ height: 280, resizeMode: 'cover' }}
                        />
                    )}
                    {/* Actions */}
                    <View className="flex-row items-center justify-end">
                        <TouchableOpacity
                            onPress={() => onLike(item.id)}
                            className="flex-row items-center mr-5"
                        >
                            <Heart
                                size={22}
                                color="#7ac7ea"
                                fill={item.is_liked ? '#7ac7ea' : '#ffff'}
                            />
                            <Text className="text-white text-base font-oswald-regular ml-2">
                                {item.views}
                            </Text>
                        </TouchableOpacity>
                        <Bookmark
                            onPress={() => onBookmark(item.id)}
                            size={22}
                            color={item.is_bookmarked ? '#7ac7ea' : 'white'}
                            fill={item.is_bookmarked ? '#7ac7ea' : '#5e5e5e'}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
});

PostCard.displayName = 'PostCard';
export default PostCard;