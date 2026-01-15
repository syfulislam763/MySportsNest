import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Image, Dimensions, Modal } from 'react-native';
import { Search, ChevronDown, SlidersHorizontal, Heart, Bookmark, MoreVertical, Plus, X } from 'lucide-react-native';
import WrapperComponent from '@/components/WrapperComponent';
import NestMenu from '@/components/NestMenu';
import LiveBar from '@/components/LiveBar';
import { posts } from '@/utils/dummy_data';
import { Post } from '@/utils/main_app_types';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '@/navigations/types';
import { useNavigation } from '@react-navigation/native';
import WeeklyCalendar from './WeeklyCalendar';

type NavigationProps = StackNavigationProp<MainStackParamList>

const { width, height } = Dimensions.get('window');

const NestFeedScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState('Latest');
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    const navigation = useNavigation<NavigationProps>()

    const appIcon = require("../../../assets/img/appIcon.png");
    const profilePic = require("../../../assets/temp/test_p1.jpg");
    const nest = require("../../../assets/img/Nest.png");

    const sortOptions = ['Latest', 'Oldest', 'Most Liked', 'Least Liked'];
    const filterOptions = ['Teams', 'Athletes', 'Leagues', 'News', 'Videos', 'Articles'];

    const [activeTab, setActiveTab] = useState<string>("feed")
    

    const toggleFilter = (filter: string) => {
        if (selectedFilters.includes(filter)) {
            setSelectedFilters(selectedFilters.filter(f => f !== filter));
        } else {
            setSelectedFilters([...selectedFilters, filter]);
        }
    };

    const renderPost = ({ item }: { item: Post }) => (
        <View className="p-4 mb-4 border-b border-b-white">
            <View className="flex-row items-start justify-between mb-3">
                <View className="flex-row items-start flex-1">
                    <Image source={item.avatar} className="w-12 h-12 rounded-full" style={{resizeMode: 'cover'}} />
                    <View className="ml-3 flex-1">
                        <View className="flex-row items-center flex-wrap">
                            <Text className="text-white text-lg font-oswald-medium">{item.user}</Text>
                            <Text className="text-white/60 text-sm font-oswald-regular ml-2">{item.handle}</Text>
                            <Text className="text-white/60 text-sm font-oswald-regular ml-1">•</Text>
                            <Text className="text-white/60 text-sm font-oswald-regular ml-1">{item.timestamp}</Text>
                        </View>
                        <Text className="text-white/60 text-xs font-oswald-regular mt-1">{item.source}</Text>
                    </View>
                </View>
                <MoreVertical size={24} color="white" />
            </View>

            <View className='flex-row items-center justify-between'>
                <View className='h-12 w-12'></View>
                <View className='flex-1 ml-3'>
                    <Text className="text-white text-lg font-oswald-medium mb-2 leading-6">{item.title}</Text>
                    <Text className="text-white text-sm font-oswald-regular mb-4 leading-5">{item.description}</Text>
                    {item.image && <Image source={item.image} className='w-full rounded-2xl mb-4' style={{height: 280, resizeMode: 'cover'}} />}

                    <View className="flex-row items-center justify-end">
                        <View className="flex-row items-center mr-5">
                            <Heart size={22} color="#7ac7ea" fill="#7ac7ea" />
                            <Text className="text-white text-base font-oswald-regular ml-2">{item.likes}</Text>
                        </View>
                        <Bookmark size={22} color="white" />
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <View className='flex-1'>
            <WrapperComponent
                title={""}
                bg_color={"bg-[#5e5e5e]"}
                container_bg={"bg-[#5e5e5e]"}
                headerComponent={() => <View className="flex-row items-center justify-between mb-4 mx-3">
                        <Image source={appIcon} className="w-14 h-14" style={{resizeMode: 'contain'}} />
                        
                        <View className="flex-1">
                            <View className=" mx-2">
                                <TextInput
                                    className="bg-white rounded-xl px-2 py-3 pr-12 text-sm font-oswald-regular"
                                    placeholder="Search teams, athletes, leagues..."
                                    placeholderTextColor="#a0a0a0"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                />
                                <View className="absolute right-4 top-3">
                                    <Search size={22} color="#5e5e5e" />
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity onPress={() => navigation.navigate("ProfileSettingsScreen")}>
                            <Image source={profilePic} className="w-12 h-12 rounded-full" style={{resizeMode: 'cover'}} />
                        </TouchableOpacity>
                </View>}
            >


                <View className="flex-row items-center justify-between ">
                    <TouchableOpacity onPress={() => setActiveTab("feed")} className="mr-4">
                        <Text className={`${activeTab=="feed"?"text-[#7ac7ea]":"text-white"} text-lg font-oswald-medium`}>Nest Feed</Text>
                        {activeTab == "feed" && <View className="h-1 bg-[#7ac7ea] rounded-full mt-1" />}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab("calendar")} className="mr-4">
                        <Text className={`${activeTab=="calendar"?"text-[#7ac7ea]":"text-white"} text-lg font-oswald-medium`}>Nest Calendar</Text>
                        {activeTab == "calendar" && <View className="h-1 bg-[#7ac7ea] rounded-full mt-1" />}
                    </TouchableOpacity>    
                </View>


                {activeTab == "calendar"? <WeeklyCalendar/> :
                
                    <View className="pb-3 relative">
                        
                        
                        <View className="flex-row items-center justify-start mt-3">
                            <TouchableOpacity 
                                className="flex-row items-center mr-3 border border-white/30 rounded-full px-3 py-1"
                                onPress={() => {
                                    setSortOpen(!sortOpen);
                                    setFilterOpen(false)
                                }}
                            >
                                <Text className="text-white text-sm font-oswald-regular mr-1">Sort</Text>
                                <ChevronDown size={16} color="white" />
                            </TouchableOpacity>

                            <TouchableOpacity 
                                className="flex-row items-center border border-white/30 rounded-full px-3 py-1"
                                onPress={() => {
                                    setFilterOpen(!filterOpen);
                                    setSortOpen(false);
                                }}
                            >
                                <SlidersHorizontal size={18} color="white" />
                                <Text className="text-white text-sm font-oswald-regular ml-1">Filter</Text>
                            </TouchableOpacity>
                        </View>

                        {sortOpen && (
                            <View className="absolute top-16 left-0 bg-white/90 rounded-xl p-2 z-50">
                                {sortOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        className="py-2 px-4"
                                        onPress={() => {
                                            setSelectedSort(option);
                                            setSortOpen(false);
                                        }}
                                    >
                                        <Text className={`text-sm font-oswald-regular ${selectedSort === option ? 'text-[#7ac7ea]' : 'text-[#5e5e5e]'}`}>
                                            {option}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {filterOpen && (
                            <View className="absolute top-16 left-20 bg-white/90 rounded-xl p-3 z-50" style={{
                                width: 200,
                            }}>
                                <View className="flex-row items-center justify-between mb-2">
                                    <Text className="text-[#5e5e5e] text-base font-oswald-medium">Filters</Text>
                                    <TouchableOpacity onPress={() => setFilterOpen(false)}>
                                        <X size={20} color="#5e5e5e" />
                                    </TouchableOpacity>
                                </View>
                                {filterOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        className="flex-row items-center py-2"
                                        onPress={() => toggleFilter(option)}
                                    >
                                        <View className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${selectedFilters.includes(option) ? 'bg-[#7ac7ea] border-[#7ac7ea]' : 'border-gray-400'}`}>
                                            {selectedFilters.includes(option) && (
                                                <View className="w-2 h-2 bg-white rounded-full" />
                                            )}
                                        </View>
                                        <Text className="text-sm font-oswald-regular text-[#5e5e5e]">
                                            {option}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                                <TouchableOpacity 
                                    className="bg-[#7ac7ea]/70 rounded-full py-2 mt-2"
                                    onPress={() => setFilterOpen(false)}
                                >
                                    <Text className="text-white text-center text-sm font-oswald-medium">Apply</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    

                        <FlatList
                            data={posts}
                            renderItem={renderPost}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingTop: 8, paddingBottom: 200 }}
                        />
                    </View>
                    
                
                
                }

                

                <TouchableOpacity 
                    className="absolute bottom-24 w-28 h-28 rounded-full items-center justify-center"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 8,
                        right: (width/2)-50
                    }}
                    onPress={() => setMenuOpen(true)}
                >
                    <Image source={nest} className="w-full h-full" style={{objectFit: 'cover'}} />
                </TouchableOpacity>
   
                <NestMenu 
                    menuOpen={menuOpen} 
                    setMenuOpen={setMenuOpen}
                    buttonPosition={{ x: width / 2, y: height - 100 }}
                />
            </WrapperComponent>
            
            <LiveBar/>
        </View>
    );
}

export default NestFeedScreen;