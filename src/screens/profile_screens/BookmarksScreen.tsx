import React, { useEffect, useState, useCallback } from 'react'
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from 'react-native'
import { Heart, Bookmark, MoreVertical } from 'lucide-react-native'
import api from '@/constants/Axios'
import WrapperComponent from '@/components/WrapperComponent';
import { useAuthStore } from '@/context/useAuthStore';
import BackButton from '@/components/BackButton';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Entity {
    id: number
    type: string
    name: string
    slug: string
    sport: string
    logo_url: string
    cover_image_url: string
    description: string
    country: string
    follower_count: number
    has_api_data: boolean
    in_nest: boolean
    created_at: string
}

interface FeedItem {
    id: number
    source_name: string
    source_logo: string
    entity_names: string[]
    entities: Entity[]
    title: string
    summary: string
    thumbnail_url: string
    url: string
    published_at: string
    is_breaking: boolean
    is_trending: boolean
    views: number
    is_bookmarked: boolean
    is_liked: boolean
}

interface BookmarkItem {
    id: number
    feed_item: FeedItem
    created_at: string
}

const extractDateParts = (dateStr: string): string => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHrs / 24)
    if (diffHrs < 1) return 'just now'
    if (diffHrs < 24) return `${diffHrs}h`
    if (diffDays < 7) return `${diffDays}d`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}



const BookmarksScreen = ({ navigation }: { navigation: any }) => {
    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [removingIds, setRemovingIds] = useState<Set<number>>(new Set())
    const updateProfile = useAuthStore((s) => s.updateProfile);
    const saved_posts_count = useAuthStore((s) => s.profile?.saved_posts_count)

    const fetchBookmarks = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true)
            const res = await api.get('/api/feed/bookmarks/')
            setBookmarks(res.data.results)
        } catch (err) {
            Alert.alert('Error', 'Failed to load bookmarks. Please try again.')
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [])

    useEffect(() => {
        fetchBookmarks()
    }, [fetchBookmarks])

    const handle_removeBookmark = async (feedItemId: number) => {
        // Optimistic UI — remove immediately
        setRemovingIds(prev => new Set(prev).add(feedItemId))
        const previous = [...bookmarks]
        setBookmarks(prev =>
            prev.filter(b => b.feed_item.id !== feedItemId)
        )
        try {
            const res = await api.post('/api/feed/bookmark/', { feed_item_id: feedItemId })
            updateProfile({saved_posts_count: saved_posts_count?saved_posts_count-1:0})
        } catch (err) {
            // Revert on failure
            setBookmarks(previous)
            Alert.alert('Error', 'Could not remove bookmark. Please try again.')
        } finally {
            setRemovingIds(prev => {
                const next = new Set(prev)
                next.delete(feedItemId)
                return next
            })
        }
    }

    const handle_like = async (feedItemId: number) => {
        setBookmarks(prev =>
            prev.map(b =>
                b.feed_item.id === feedItemId
                    ? {
                          ...b,
                          feed_item: {
                              ...b.feed_item,
                              is_liked: !b.feed_item.is_liked,
                          },
                      }
                    : b
            )
        )
        try {
            await api.post('/api/feed/like/', { feed_item_id: feedItemId })
        } catch (err) {
            // Revert
            setBookmarks(prev =>
                prev.map(b =>
                    b.feed_item.id === feedItemId
                        ? {
                              ...b,
                              feed_item: {
                                  ...b.feed_item,
                                  is_liked: !b.feed_item.is_liked,
                              },
                          }
                        : b
                )
            )
        }
    }

    const renderPost = ({ item }: { item: BookmarkItem }) => {
        const post = item.feed_item

        return (
            <View className="py-4 mb-4 border-b border-b-white">
                {/* Header row */}
                <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-row items-start flex-1">
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('TeamDetailScreen', {
                                    entity_id: post.entities?.[0]?.id,
                                })
                            }
                        >
                            {post.source_logo ? (
                                <Image
                                    source={{ uri: post.source_logo }}
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
                                    {post.entity_names.length ? post.entity_names[0] : ''}
                                </Text>
                                <Text className="text-white/60 text-sm font-oswald-regular ml-2">
                                    @{post.source_name}
                                </Text>
                                <Text className="text-white/60 text-sm font-oswald-regular ml-1">
                                    •
                                </Text>
                                <Text className="text-white/60 text-sm font-oswald-regular ml-1">
                                    {extractDateParts(post.published_at)}
                                </Text>
                            </View>
                            <Text className="text-white/60 text-xs font-oswald-regular mt-1">
                                {post.source_name}
                            </Text>
                        </View>
                    </View>
                    <MoreVertical size={24} color="white" />
                </View>

                {/* Body row */}
                <View className="flex-row items-start justify-between">
                    <View className="h-12 w-12" />
                    <View className="flex-1 ml-3">
                        <Text className="text-white text-lg font-oswald-medium mb-2 leading-6">
                            {post.title}
                        </Text>
                        <Text className="text-white text-sm font-oswald-regular mb-4 leading-5">
                            {post.summary}
                        </Text>

                        {!!post.thumbnail_url && (
                            <Image
                                source={{ uri: post.thumbnail_url }}
                                className="w-full rounded-2xl mb-4"
                                style={{ height: 280, resizeMode: 'cover' }}
                            />
                        )}

                        {/* Actions */}
                        <View className="flex-row items-center justify-end">
                            <TouchableOpacity
                                onPress={() => handle_like(post.id)}
                                className="flex-row items-center mr-5"
                            >
                                <Heart
                                    size={22}
                                    color="#7ac7ea"
                                    fill={post.is_liked ? '#7ac7ea' : 'transparent'}
                                />
                                <Text className="text-white text-base font-oswald-regular ml-2">
                                    {post.views}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => handle_removeBookmark(post.id)}
                                disabled={removingIds.has(post.id)}
                            >
                                <Bookmark
                                    size={22}
                                    color={post.is_bookmarked ? '#7ac7ea' : 'white'}
                                    fill={post.is_bookmarked ? '#7ac7ea' : '#5e5e5e'}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    // ── Loading state ────────────────────────────────────────────────────────
    if (loading) {
        return (
            <View className="flex-1 bg-black items-center justify-center">
                <ActivityIndicator size="large" color="#7ac7ea" />
            </View>
        )
    }

    // ── Empty state ──────────────────────────────────────────────────────────
    if (!bookmarks.length) {
        return (
            <View className="flex-1 bg-black items-center justify-center px-8">
                <Bookmark size={48} color="#7ac7ea" fill="transparent" />
                <Text className="text-white text-xl font-oswald-medium mt-4 text-center">
                    No saved posts yet
                </Text>
                <Text className="text-white/60 text-sm font-oswald-regular mt-2 text-center">
                    Tap the bookmark icon on any post to save it here.
                </Text>
            </View>
        )
    }

    // ── List ─────────────────────────────────────────────────────────────────
    return (
        <WrapperComponent
            bg_color={"bg-[#5e5e5e]"}
            container_bg={"bg-[#5e5e5e]"}
            headerComponent = {() => {
                return <View className="flex-row items-center mb-4 mx-5">
                    <BackButton />
                    <Text className="text-white text-xl font-oswald-semiBold ml-4">
                        Saved Posts
                    </Text>
                </View>
            }}
        >
       

            <FlatList
                data={bookmarks}
                keyExtractor={item => item.id.toString()}
                renderItem={renderPost}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => fetchBookmarks(true)}
                        tintColor="#7ac7ea"
                        colors={['#7ac7ea']}
                    />
                }
            />
        </WrapperComponent>
    )
}

export default BookmarksScreen