import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { MainStackParamList } from '@/navigations/types';
import WrapperComponent from '@/components/WrapperComponent';
import BackButton from '@/components/BackButton';
import { toast } from '@/context/useToastStore';
import { get_feed_details } from './HomeFeedAPI';

type FeedContentRouteProp = RouteProp<MainStackParamList, 'FeedContent'>;

interface FeedItem {
    title: string;
    content: string;
    thumbnail_url?: string;
}

const cleanContent = (raw: string, title: string) => {
    const titleIndex = raw.indexOf(`# ${title}`);
    let body = titleIndex >= 0 ? raw.slice(titleIndex + title.length + 2) : raw;

    const stopMarkers = ['ABOUT THE AUTHOR', 'Top News', '**See Less**'];
    for (const marker of stopMarkers) {
        const stopIndex = body.indexOf(marker);
        if (stopIndex >= 0) {
            body = body.slice(0, stopIndex);
            break;
        }
    }

    body = body
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\[([^\]]*)\]\(.*?\)/g, '$1')
        .replace(/#+\s?/g, '')
        .replace(/\*\*/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    return body.split('\n\n').filter((p) => p.trim().length > 0);
};

const FeedContent = () => {
    const route = useRoute<FeedContentRouteProp>();
    const [item, setItem] = useState<FeedItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const { item_id } = route.params;
        if (!item_id) {
            setLoading(false);
            return;
        }
        get_feed_details(item_id, (res) => {
            if (res) {
                setItem({ title: res.title, content: res.content, thumbnail_url: res.thumbnail_url });
            } else {
                toast.error('Failed to load article.');
            }
            setLoading(false);
        });
    }, [route.params.item_id]);

    const paragraphs = item ? cleanContent(item.content, item.title) : [];

    return (
        <WrapperComponent
            title=""
            bg_color="bg-[#5e5e5e]"
            container_bg="bg-[#5e5e5e]"
            headerComponent={() => (
                <View className="flex-row items-center mb-4 mx-5">
                    <BackButton />
                    <Text
                        className="text-white text-xl font-oswald-semiBold ml-4 flex-1"
                        numberOfLines={1}
                    >
                        {'Article'}
                    </Text>
                </View>
            )}
        >
            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#7ac7ea" />
                </View>
            ) : !item ? (
                <View className="flex-1 items-center justify-center px-8">
                    <Text className="text-white text-xl font-oswald-semiBold text-center">
                        Article not found
                    </Text>
                    <Text className="text-gray-400 text-sm font-oswald-regular mt-2 text-center">
                        This article may have been removed.
                    </Text>
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5">
                    <Text className="text-white text-2xl font-oswald-semiBold leading-8 mb-4">
                        {item.title}
                    </Text>

                    {item.thumbnail_url && (
                        <Image
                            source={{ uri: item.thumbnail_url }}
                            className="w-full rounded-2xl mb-5"
                            style={{ height: 220, resizeMode: 'cover' }}
                        />
                    )}

                    <View className="mb-8">
                        {paragraphs.map((p, i) => (
                            <Text
                                key={i}
                                className="text-white/90 text-base font-oswald-regular leading-6 mb-4"
                            >
                                {p}
                            </Text>
                        ))}
                    </View>
                </ScrollView>
            )}
        </WrapperComponent>
    );
};

export default FeedContent;