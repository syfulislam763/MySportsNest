import React, { useCallback, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';

import WrapperComponent from '@/components/WrapperComponent';
import NestMenu from '@/components/NestMenu';
import LiveBar from '@/components/LiveBar';
import WeeklyCalendar from './WeeklyCalendar';
import { Post } from '@/utils/main_app_types';

import { useNestFeed } from '@/hooks/useNestFeed';
import PostCard from './NestFeedComps/PostCard';
import SortDropdown from './NestFeedComps/SortDropdown';
import FilterDropdown from './NestFeedComps/FilterDropdown';
import SearchResults from './NestFeedComps/SearchResult';
import NestFeedHeader from './NestFeedComps/NestFeedHeader';
import SortFilter from './NestFeedComps/SortFilter';

const { width, height } = Dimensions.get('window');
const nestImage = require('../../../assets/img/Nest.png');

const NestFeedScreen = () => {
    const {
        searchQuery, setSearchQuery,
        searchResults,
        selectedItems,
        menuOpen, setMenuOpen,
        sortOpen, filterOpen,
        selectedSort,
        selectedFilters,
        posts,
        scrollSignal,
        onScrollBeginDrag,
        activeTab, setActiveTab,
        profile,
        navigation,
        handle_Like,
        handle_feedback,
        handleHidePost,
        handleSort,
        handleApplyFilter,
        toggleFilter,
        toggleSearchItem,
        clearSearch,
        clearSort,
        clearFilter,
        toggleSort,
        toggleFilterPanel,
        closeAllDropdowns,
    } = useNestFeed();

    //console.log('NestFeedScreen render', JSON.stringify(posts, null, 2));

    const renderPost = useCallback(
        ({ item }: { item: Post }) => (
            <PostCard
                item={item}
                scrollSignal={scrollSignal}
                onHide={handleHidePost}
                onLike={handle_Like}
                onBookmark={handle_feedback}
            />
        ),
        // scrollSignal must be in deps so cards receive the latest value on scroll
        [scrollSignal, handleHidePost, handle_Like, handle_feedback]
    );

    const keyExtractor = useCallback((_: Post, idx: number) => idx.toString(), []);

    const [sortHide, setSortHide] = useState(false);
    const [filterHide, setFilterHide] = useState(false);


    return (
        <View className="flex-1">
            <WrapperComponent
                title=""
                bg_color="bg-[#5e5e5e]"
                container_bg="bg-[#5e5e5e]"
                headerComponent={() => (
                    <NestFeedHeader
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        profilePicture={profile?.profile_picture}
                        onProfilePress={() => navigation.navigate('ProfileSettingsScreen')}
                        setActiveTab={val => {
                            setActiveTab(val);
                        }}
                    />
                )}
            >
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={() => setActiveTab('feed')}
                        className="mr-4 items-center"
                    >
                        <Text
                            className={`${
                                activeTab === 'feed' ? 'text-[#7ac7ea]' : 'text-white'
                            } text-lg font-oswald-medium`}
                        >
                            Nest Feed
                        </Text>
                        {activeTab === 'feed' && (
                            <View className="h-1 w-32 bg-[#7ac7ea] rounded-full mt-1" />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setActiveTab('calendar')}
                        className="mr-4 items-center"
                    >
                        <Text
                            className={`${
                                activeTab === 'calendar' ? 'text-[#7ac7ea]' : 'text-white'
                            } text-lg font-oswald-medium`}
                        >
                            Nest Calendar
                        </Text>
                        {activeTab === 'calendar' && (
                            <View className="h-1 w-32 bg-[#7ac7ea] rounded-full mt-1" />
                        )}
                    </TouchableOpacity>
                </View>

                {(sortOpen || filterOpen || menuOpen) && (
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={closeAllDropdowns}
                        style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            zIndex: 10,
                        }}
                    />
                )}

                {activeTab === 'calendar' ? (
                    <WeeklyCalendar />
                ) : (
                    <View className="pb-3 relative">
                        
                        <SortFilter scrollSignal={scrollSignal}/>

                        {/* Posts list */}
                        <FlatList
                            data={posts}
                            renderItem={renderPost}
                            keyExtractor={keyExtractor}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingTop: 8, paddingBottom: 200 }}
                            onScrollBeginDrag={onScrollBeginDrag}
                            // Performance knobs
                            removeClippedSubviews={true}
                            maxToRenderPerBatch={8}
                            windowSize={10}
                            initialNumToRender={6}
                        />
                    </View>
                )}

                <TouchableOpacity
                    className="absolute bottom-24 w-28 h-28 rounded-full items-center justify-center"
                    style={{ right: width / 2 - 50 }}
                    onPress={() => setMenuOpen(true)}
                >
                    <Image
                        source={nestImage}
                        className="w-full h-full"
                        style={{ objectFit: 'cover' }}
                    />
                </TouchableOpacity>

                <NestMenu
                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen}
                    buttonPosition={{ x: width / 2, y: height - 100 }}
                />

                {searchQuery ? (
                    <SearchResults
                        results={searchResults}
                        selectedItems={selectedItems}
                        onToggleItem={toggleSearchItem}
                        onClearSearch={clearSearch}
                    />
                ) : null}
            </WrapperComponent>

            <LiveBar />
        </View>
    );
};

export default NestFeedScreen;