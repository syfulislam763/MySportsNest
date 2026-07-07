import React, { memo, useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Heart, Bookmark, MoreVertical } from 'lucide-react-native';
import { Post } from '@/utils/main_app_types';
import {useNavigation} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '@/navigations/types';
import { get_feed_details } from '../HomeFeedAPI';

type NavigationProps = StackNavigationProp<MainStackParamList>;



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
    scrollSignal: number;
    onHide: (id: number) => void;
    onLike: (id: number) => void;
    onBookmark: (id: number) => void;
};

const PostCard = memo(({
    item,
    scrollSignal,
    onHide,
    onLike,
    onBookmark,
}: Props) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const navigation = useNavigation<NavigationProps>();
    // Close tooltip whenever the parent signals a scroll event
    useEffect(() => {
        if (scrollSignal > 0) setTooltipOpen(false);
    }, [scrollSignal]);

    return (
        <View className="py-4 mb-4 border-b border-b-white">
            {/* Header Row */}
            <View className="flex-row items-start justify-between mb-3">
                <View className="flex-row items-start flex-1">
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('FeedContent', { item_id: item.id });
                    }}>
                        {item.publisher_logo ? (
                            <Image
                                source={{ uri: item.publisher_logo }}
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
                                {item.publisher_name}
                            </Text>
                            <Text className="text-white/60 text-sm font-oswald-regular ml-2">
                                {/* {'@name'} */}
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

                {/* Three-dot tooltip — fully self-contained */}
                <View style={{ position: 'relative' }}>
                    <TouchableOpacity onPress={() => setTooltipOpen((prev) => !prev)}>
                        <MoreVertical size={24} color="white" />
                    </TouchableOpacity>

                    {tooltipOpen && (
                        <TouchableOpacity
                            onPress={() => {
                                setTooltipOpen(false);
                                onHide(item.id);
                            }}
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
                                width: 200,
                            }}
                        >
                            <Text style={{ color: '#e53935', fontSize: 13, fontFamily: 'Oswald-Medium' }}>
                                Hide Source
                            </Text>
                            <Text style={{  fontSize: 10, fontFamily: 'Oswald-Medium' }}>
                                By hiding this source, you will no longer receive Nest Feed posts from this source.
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Content Row */}
            <View className="flex-row items-center justify-between">
                <View className="h-12 w-12" />
                <View className="flex-1 ml-3">
                    <TouchableOpacity onPress={() => {
                         navigation.navigate('FeedContent', { item_id: item.id });
                    }}>
                        <Text className="text-white text-lg font-oswald-medium mb-2 leading-6">
                        {item.title}
                    </Text>
                    </TouchableOpacity>
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