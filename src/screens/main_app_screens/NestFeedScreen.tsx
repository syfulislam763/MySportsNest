import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Image, Dimensions, Modal } from 'react-native';
import { Search, ChevronDown, SlidersHorizontal, Heart, Bookmark, MoreVertical, Plus, X } from 'lucide-react-native';
import WrapperComponent from '@/components/WrapperComponent';
import NestMenu from '@/components/NestMenu';
import LiveBar from '@/components/LiveBar';
import { Post } from '@/utils/main_app_types';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '@/navigations/types';
import { useNavigation } from '@react-navigation/native';
import WeeklyCalendar from './WeeklyCalendar';
import { setLoadingFalse, setLoadingTrue } from '@/context/useLoadingStore';
import { feedback_post, get_home_feed, like_post } from './HomeFeedAPI';
import { useAuthStore } from '@/context/useAuthStore';
import { BASE_URL } from '@/constants/Path';
import { Check} from 'lucide-react-native';
import { OnboardingAPI, add_nest_entity, remove_nest_entity } from '@/screens/onboarding_screens/onboardingApi';

type NavigationProps = StackNavigationProp<MainStackParamList>

const { width, height } = Dimensions.get('window');

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
type SearchEntity = {
    id: number;
    type: string;
    name: string;
    slug: string;
    sport: string;
    logo_url: string;
    cover_image_url: string;
    description: string;
    country: string;
    follower_count: number;
    has_api_data: boolean;
    in_nest: boolean;
    created_at: string;
};

const NestFeedScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchEntity[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState('');
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [views, setViews] = useState<Boolean>(false);
    // tooltip: stores the post id whose tooltip is open, or null
    const [openTooltipId, setOpenTooltipId] = useState<number | null>(null);
    const profile = useAuthStore((s) => s.profile)

    const navigation = useNavigation<NavigationProps>()

    const appIcon = require("../../../assets/img/appIcon.png");
    const profilePic = require("../../../assets/temp/test_p1.jpg");
    const nest = require("../../../assets/img/Nest.png");

    const sortOptions = ['Latest', 'Oldest', 'Most Liked', 'Least Liked'];
    const filterOptions = ['Teams', 'Athletes', 'Leagues', 'News', 'Videos', 'Articles'];

    const [activeTab, setActiveTab] = useState<string>("feed");

    const handle_Like = (id:number) => {
        let query = null;
        if(selectedFilters.length>0 && selectedSort){
            query = `type=${selectedFilters[0].toLowerCase()}&sort=${selectedSort.toLowerCase()}`;
        }else if(selectedFilters.length>0) {
            query = `type=${selectedFilters[0].toLowerCase()}}`
        }else if(selectedSort){
            query = `sort=${selectedSort.toLowerCase()}`
        }else {
            query = null;
        }
    

        like_post(id, (res) => {
            if(res){
                setViews(res?.data?.liked)
                handle_get_feed_posts(query);
            }
        })
    }

    const handle_feedback = (id:number) => {
        let query = null;
        if(selectedFilters.length>0 && selectedSort){
            query = `type=${selectedFilters[0].toLowerCase()}&sort=${selectedSort.toLowerCase()}`;
        }else if(selectedFilters.length>0) {
            query = `type=${selectedFilters[0].toLowerCase()}}`
        }else if(selectedSort){
            query = `sort=${selectedSort.toLowerCase()}`
        }else {
            query = null;
        }
    

        feedback_post(id, (res) => {
            if(res){
                handle_get_feed_posts(query);
            }
        })
    }
    const toggleSearchItem = (id: number) => {
        if (selectedItems.includes(id)) {
            setSelectedItems((prev) => prev.filter((i) => i !== id));
            setLoadingTrue();
            remove_nest_entity({ entity_id: id }, () => { setLoadingFalse(); });
        } else {
            setSelectedItems((prev) => [...prev, id]);
            setLoadingTrue();
            add_nest_entity({ entity_id: id }, () => { setLoadingFalse(); });
        }
    };
    
    
    const handle_get_feed_posts = (query: string | null) => {
        setLoadingTrue();
        get_home_feed(query, (res) => {
            setLoadingFalse()
            if(res){
                setPosts(res?.data?.results ??[])
                //console.log("feed", JSON.stringify(res.data, null, 2))
            }
        })
    }


    const handle_search = (value: string) => {
        setSearchQuery(value);
        if (!value) {
            setSearchResults([]);
            return;
        }
        OnboardingAPI.get_trending_data(value).then((res) => {
            const all: SearchEntity[] = [
                ...(res?.data?.teams ?? []),
                ...(res?.data?.athletes ?? []),
                ...(res?.data?.leagues ?? []),
            ];
            setSearchResults(all);
            const nestIds = all.filter((i) => i.in_nest).map((i) => i.id);
            setSelectedItems((prev) => Array.from(new Set([...prev, ...nestIds])));
        }).catch(() => {});
    };

    const handleSort = (sortString:string) => {
        setLoadingTrue();
        setSelectedSort(sortString);
        setSortOpen(false);
        const q = selectedFilters.length>0? `type=${selectedFilters[0].toLowerCase()}&sort=${sortString.toLowerCase()}`:`sort=${sortString.toLowerCase()}`
        handle_get_feed_posts(q)
        
    }

    const handleFilter = () => {
        setLoadingTrue();
        const q = selectedSort? `type=${selectedFilters[0].toLowerCase()}&sort=${selectedSort.toLowerCase()}`:`type=${selectedFilters[0].toLowerCase()}`
        handle_get_feed_posts(q)
        setFilterOpen(false)
    }

    useEffect(() => {
        handle_get_feed_posts(null);
    }, [])

    const toggleFilter = (filter: string) => {
        if (selectedFilters.includes(filter)) {
            setSelectedFilters(selectedFilters.filter(f => f !== filter));
        } else {
            setSelectedFilters([filter]);
        }
    };

    const renderPost = ({ item }: { item: Post }) => (
        <View  className="py-4 mb-4 border-b border-b-white">
            <View className="flex-row items-start justify-between mb-3">
                <View className="flex-row items-start flex-1">
                    <TouchableOpacity onPress={() => navigation.navigate("TeamDetailScreen", {entity_id: item.id})}>
                        {item.source_logo?<Image source={{uri: item.source_logo}} className="w-12 h-12 rounded-full" style={{resizeMode: 'cover'}} />: <View className="w-12 h-12 rounded-full bg-white" ></View>}
                    </TouchableOpacity>
                    <View className="ml-3 flex-1">
                        <View className="flex-row items-center flex-wrap">
                            <Text className="text-white text-lg font-oswald-medium">{item.entity_names.length?item.entity_names[0]:""}</Text>
                            <Text className="text-white/60 text-sm font-oswald-regular ml-2">{"@name"}</Text>
                            <Text className="text-white/60 text-sm font-oswald-regular ml-1">•</Text>
                            <Text className="text-white/60 text-sm font-oswald-regular ml-1">{extractDateParts(item.published_at)}</Text>
                        </View>
                        <Text className="text-white/60 text-xs font-oswald-regular mt-1">{item.source_name}</Text>
                    </View>
                </View>

                {/* Three dots with tooltip */}
                <View style={{ position: 'relative' }}>
                    <TouchableOpacity
                        onPress={() => setOpenTooltipId(openTooltipId === item.id ? null : item.id)}
                    >
                        <MoreVertical size={24} color="white" />
                    </TouchableOpacity>

                    {openTooltipId === item.id && (
                        <TouchableOpacity
                            onPress={() => {
                                setPosts((prev) => prev.filter((p) => p.id !== item.id));
                                setOpenTooltipId(null);
                            }}
                            style={{
                                position: 'absolute',
                                top: 28,
                                right: 15,
                                backgroundColor: 'white',
                                borderTopLeftRadius: 15,
                                borderBottomRightRadius:15,
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

            <View className='flex-row items-center justify-between'>
                <View className='h-12 w-12'></View>
                <View className='flex-1 ml-3'>
                    <Text className="text-white text-lg font-oswald-medium mb-2 leading-6">{item.title}</Text>
                    <Text className="text-white text-sm font-oswald-regular mb-4 leading-5">{item.summary}</Text>
                    {item.thumbnail_url && <Image source={{uri:item.thumbnail_url}} className='w-full rounded-2xl mb-4' style={{height: 280, resizeMode: 'cover'}} />}

                    <View className="flex-row items-center justify-end">
                        <TouchableOpacity onPress={() => {
                            handle_Like(item.id)
                        }} className="flex-row items-center mr-5">
                            <Heart size={22} color="#7ac7ea" fill={item.is_liked?"#7ac7ea":"#ffff"} />
                            <Text className="text-white text-base font-oswald-regular ml-2">{item.views}</Text>
                        </TouchableOpacity>
                        <Bookmark onPress={()=> {
                            handle_feedback(item.id)
                        }} size={22} color={item.is_bookmarked?"#7ac7ea": "white"} fill={item.is_bookmarked?"#7ac7ea": "#5e5e5e"} />
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
                                    onChangeText={handle_search}
                                />
                                <View className="absolute right-4 top-3">
                                    <Search size={22} color="#5e5e5e" />
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity onPress={() => navigation.navigate("ProfileSettingsScreen")}>
                            <Image source={ {uri: BASE_URL+profile?.profile_picture || ""} } className="w-12 h-12 rounded-full" style={{resizeMode: 'cover'}} />
                        </TouchableOpacity>
                </View>}
            >


                <View className="flex-row items-center justify-between ">
                    <TouchableOpacity onPress={() => setActiveTab("feed")} className="mr-4 items-center">
                        <Text className={`${activeTab=="feed"?"text-[#7ac7ea]":"text-white"} text-lg font-oswald-medium`}>Nest Feed</Text>
                        {activeTab == "feed" && <View className="h-1 w-32 bg-[#7ac7ea] rounded-full mt-1" />}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab("calendar")} className="mr-4 items-center">
                        <Text className={`${activeTab=="calendar"?"text-[#7ac7ea]":"text-white"} text-lg font-oswald-medium`}>Nest Calendar</Text>
                        {activeTab == "calendar" && <View className="h-1 w-32 bg-[#7ac7ea] rounded-full mt-1" />}
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

                                {selectedSort && <View className='ml-1 flex-row items-center bg-slate-600 rounded-2xl px-1.5 py-1'>
                                    <Text className="text-white text-sm font-oswald-regular mr-1">{selectedSort}</Text>
                                    <X color={"white"} onPress={() => {
                                        if(selectedFilters.length>0){
                                            handle_get_feed_posts(`type=${selectedFilters[0].toLowerCase()}`);
                                        }else{
                                            handle_get_feed_posts(null);
                                        }
                                        setSelectedSort("")
                                    }} size={15}/>
                                </View>}
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

                                {selectedFilters.length > 0 && <View className='ml-1 flex-row items-center bg-slate-600 rounded-2xl px-1.5 py-1'>
                                    <Text className="text-white text-sm font-oswald-regular mr-1">{ selectedFilters[0] }</Text>
                                    <X color={"white"} onPress={() => {
                                        if(selectedSort){
                                            handle_get_feed_posts(`sort=${selectedSort.toLowerCase()}`);
                                        }else{
                                            handle_get_feed_posts(null);
                                        }
                                        setSelectedFilters([])
                                    }} size={15}/>
                                </View>}
                            </TouchableOpacity>
                        </View>

                        
                    

                        <FlatList
                            data={posts}
                            renderItem={renderPost}
                            keyExtractor={(item, idx) => idx.toString()}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingTop: 8, paddingBottom: 200 }}
                            // close tooltip when scrolling
                            onScrollBeginDrag={() => setOpenTooltipId(null)}
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

                    {sortOpen && (
                            <View className="absolute top-16 left-0 bg-white/90 rounded-xl p-2 z-50">
                                {sortOptions.map((option, idx) => (
                                    <TouchableOpacity
                                        key={idx.toString()}
                                        className="py-2 px-4"
                                        onPress={() => {
                                            handleSort(option)
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
                                {filterOptions.map((option, idx) => (
                                    <TouchableOpacity
                                        key={idx.toString()}
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
                                    onPress={() => handleFilter()}
                                >
                                    <Text className="text-white text-center text-sm font-oswald-medium">Apply</Text>
                                </TouchableOpacity>
                            </View>
                        )}






            {
                searchQuery && (
                <View className='absolute bg-[#5e5e5e] top-0 left-0 right-0 max-h-96 rounded-br-2xl rounded-bl-2xl shadow-slate-800'>
                    <View className='px-6 w-full'>
                    <FlatList
                        data={searchResults}
                        keyExtractor={(item) => String(item.id)}
                        style={{ width: '100%' }}
                        renderItem={({ item }) => {
                        const isSelected = selectedItems.includes(item.id);
                        return (
                            <TouchableOpacity
                                className={`flex-row items-center border rounded-2xl p-4 mb-3 ${
                                    isSelected ? 'border-[#7ac7ea]/90' : 'border-gray-200'
                                } bg-white/10`}
                                onPress={() => {
                                    setSearchQuery('');
                                    setSearchResults([]);
                                    navigation.navigate('TeamDetailScreen', {
                                        entity_id: Number(item.id),
                                        logo: item.logo_url
                                    })
                                }}
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
                                    onPress={() => toggleSearchItem(item.id)}
                                >
                                    {isSelected ? <Check size={20} color="white" /> : <Plus size={24} color="#7ac7ea" />}
                                </TouchableOpacity>
                                </TouchableOpacity>
                            );
                        }}
                        showsVerticalScrollIndicator={false}
                    />
                    </View>
                </View>
            )}





            </WrapperComponent>
            
            <LiveBar/>
        </View>
    );
}

export default NestFeedScreen;