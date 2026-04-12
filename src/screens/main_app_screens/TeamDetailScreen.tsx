import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { ArrowLeft, Search, ChevronRight, ChevronDown } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigations/types';
import { RouteProp, useNavigation } from '@react-navigation/native';
import WrapperComponent from '@/components/WrapperComponent';
import { Post } from '@/utils/main_app_types';
import { Heart, MoreVertical, Bookmark } from 'lucide-react-native';
import BackButton from '@/components/BackButton';
import { useRoute } from '@react-navigation/native';
import { setLoadingFalse, setLoadingTrue } from '@/context/useLoadingStore';
import { feedback_post, get_entity_details, get_entity_feed, get_entity_fixture, get_entity_roster, get_entity_standings, get_entity_status, like_post } from './HomeFeedAPI';
import { Check,Plus } from 'lucide-react-native';
import { OnboardingAPI, add_nest_entity, remove_nest_entity } from '@/screens/onboarding_screens/onboardingApi';

type NavigationPropsType = NativeStackNavigationProp<MainStackParamList>
type EntityIdType = RouteProp<MainStackParamList, "TeamDetailScreen">

const { width } = Dimensions.get('window');

interface Entity {
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
}

export interface TeamProfile {
  entity: Entity;
  league: string | null;
  venue_name: string;
  venue_city: string;
  venue_capacity: number | null;
  total_wins: number;
  total_losses: number;
  win_percentage: string;
  website_url: string;
  twitter_handle: string;
  youtube_channel_id: string;
}

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

type Tab = 'Feed' | 'Stats' | 'Roster' | 'Fixtures' | 'Standings';

type TabsType = {
    tab: Tab
    hidden: boolean
}

const TeamDetailScreen = () => {
    const [activeTab, setActiveTab] = useState<Tab>('Feed');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchEntity[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [seasonOpen, setSeasonOpen] = useState(false);
    const [leagueOpen, setLeagueOpen] = useState(false);
    const [regionOpen, setRegionOpen] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState('2023/24');
    const [selectedLeague, setSelectedLeague] = useState('Premier League');
    const [selectedRegion, setSelectedRegion] = useState('Region');
    const [posts, setPosts] = useState<Post[]>([]);
    const [entityDetails, setEntityDetails] = useState<TeamProfile>();
    const [tabs, setTabs] = useState<Tab[]>(['Feed', 'Stats', 'Roster', 'Fixtures', 'Standings']);
    const [viewEntity, setViewEntity] = useState(0);
    const [isAddedToNest, setIsAddedToNest] = useState(false);
    

    //console.log("entity details", JSON.stringify(entityDetails, null, 2))

    const handle_get_entity_details = async (id:number) => {
        get_entity_details(id, (res) => {
            const isType = res?.data?.entity?.type  ?? ""
            if(isType == "athlete"){
                setTabs(['Feed', 'Stats', 'Roster'])
            }
            setEntityDetails(res.data)
            //console.log(JSON.stringify(res.data, null, 2), "df")
        })
    }

    useEffect(() => {
        handle_get_entity_details( viewEntity || route.params.entity_id)
    }, [viewEntity])

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

    const handle_Like = (id:number) => {
   
        like_post(id, (res) => {
            if(res){
                handle_get_entity_feed(viewEntity || route.params.entity_id)
            }
        })
    }
    
    const handle_feedback = (id:number) => {

        feedback_post(id, (res) => {
            if(res){
                handle_get_entity_feed(viewEntity || route.params.entity_id)
            }
        })
    }

    const handle_get_entity_feed = async (id:number) => {
        setLoadingTrue();
        get_entity_feed(id, (res) => {
            setLoadingFalse();
            setPosts(res?.data?.results ?? [])
            //console.log(JSON.stringify(res.data, null, 2), "df")
        })
    }
    const handle_get_entity_stats = async (id:number) => {
        setLoadingTrue();
        get_entity_status(id, (res) => {
            setLoadingFalse();
            console.log(JSON.stringify(res.data, null, 2), "stats")
        })
    }
    const handle_get_entity_roster = async (id:number) => {
        setLoadingTrue();
        get_entity_roster(id, (res) => {
            setLoadingFalse();
            console.log(JSON.stringify(res.data, null, 2), "roster")
        })
    }

    const handle_get_entity_fixture = async (id:number) => {
        setLoadingTrue();
        get_entity_fixture(id, (res) => {
            setLoadingFalse();

            console.log(JSON.stringify(res.data, null, 2), "fixture")
        })
    }

    const handle_get_entity_standings = async (id:number) => {
        setLoadingTrue();
        get_entity_standings(id, (res) => {
            setLoadingFalse();
            console.log(JSON.stringify(res.data, null, 2), "standings")
        })
    }


    const barcelona = require("../../../assets/img/barcelona.png")

    const navigation = useNavigation<NavigationPropsType>()
    const route = useRoute<EntityIdType>()

    const teamStats = [
        { id: '1', name: 'Tigers', logo: '🐯', wins: 15, losses: 5, draws: 2 },
        { id: '2', name: 'Lions', logo: '🦁', wins: 12, losses: 8, draws: 3 },
        { id: '3', name: 'Bears', logo: '🐻', wins: 10, losses: 10, draws: 2 },
        { id: '4', name: 'Wolves', logo: '🐺', wins: 10, losses: 10, draws: 2 },
        { id: '5', name: 'Eagles', logo: '🦅', wins: 8, losses: 12, draws: 3 },
    ];

    const roster = [
        { id: '1', number: 7, name: 'Lionel Messi', position: 'Forward', goals: 20, assists: 10, matches: 25 },
        { id: '2', number: 10, name: 'Cristiano Ronaldo', position: 'Forward', goals: 18, assists: 8, matches: 23 },
        { id: '3', number: 9, name: 'Neymar Jr', position: 'Forward', goals: 15, assists: 12, matches: 22 },
        { id: '4', number: 8, name: 'Kevin De Bruyne', position: 'Midfielder', goals: 8, assists: 15, matches: 25 },
        { id: '5', number: 4, name: 'Virgil van Dijk', position: 'Defender', goals: 2, assists: 1, matches: 24 },
    ];

    const fixtures = [
        { id: '1', league: 'La Liga', date: 'Nov 20, 2025', team1: 'Barcelona', team2: 'Real Madrid', score1: 2, score2: 1, logo1: '⚽', logo2: '⚽' },
        { id: '2', league: 'NBA', date: 'Nov 25, 2025', team1: 'Real Madrid', team2: 'Barcelona', time: '19:00', logo1: '⚽', logo2: '⚽' },
        { id: '3', league: 'ATP Finals', date: 'Nov 18, 2025', team1: 'Barcelona', team2: 'Real Madrid', score1: 1, score2: 2, logo1: '⚽', logo2: '⚽' },
    ];

    const standings = [
        { id: '1', team: 'Arsenal', logo: '⚽', p: 58, w: 28, d: 5, l: 5 },
        { id: '2', team: 'Liverpool', logo: '⚽', p: 38, w: 24, d: 10, l: 5 },
        { id: '3', team: 'Aston Villa', logo: '⚽', p: 38, w: 20, d: 8, l: 5 },
        { id: '4', team: 'Tottenham Hosp', logo: '⚽', p: 38, w: 28, d: 5, l: 5 },
        { id: '5', team: 'Manchester City', logo: '⚽', p: 38, w: 20, d: 5, l: 5 },
        { id: '6', team: 'Chelsea', logo: '⚽', p: 38, w: 28, d: 5, l: 5 },
    ];
    const handle_get_data = () => {
        switch (activeTab) {
            case 'Feed':
                handle_get_entity_feed(viewEntity || route.params.entity_id)
                return;
            case 'Stats':
                handle_get_entity_stats(viewEntity || route.params.entity_id)
                return ;
            case 'Roster':
                handle_get_entity_roster(viewEntity || route.params.entity_id)
                return ;
            case 'Fixtures':
                handle_get_entity_fixture(viewEntity || route.params.entity_id)
                return;
            case 'Standings':
                handle_get_entity_standings(viewEntity || route.params.entity_id)
                return ;
            default:
                return null;
        }
    };

    useEffect(() => {
        handle_get_data()
    }, [activeTab, viewEntity])


    const renderFeedContent = () => (
            <FlatList
                data={posts}
                renderItem={({ item }: { item: Post }) => (
                        <View className="py-4 mb-4 border-b border-b-white">
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
                                <MoreVertical size={24} color="white" />
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
                    )}
                keyExtractor={(item, idx) => idx.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
            />
    );

    const renderStatsContent = () => (
        <FlatList
            data={teamStats}
            ListHeaderComponent={() => (
                <Text className="text-white text-xl font-oswald-medium py-4">Team Stats</Text>
            )}
            renderItem={({ item }) => (
                <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-white/20">
                    <View className="flex-row items-center flex-1">
                        <View className="w-12 h-12 bg-gray-700 rounded-xl items-center justify-center">
                            <Text className="text-2xl">{item.logo}</Text>
                        </View>
                        <View className="ml-3 flex-1">
                            <Text className="text-white text-base font-oswald-medium">{item.name}</Text>
                            <Text className="text-white/60 text-sm font-oswald-regular">Wins: {item.wins} | Losses: {item.losses} | Draws: {item.draws}</Text>
                        </View>
                    </View>
                    <ChevronRight size={20} color="white" />
                </TouchableOpacity>
            )}
            keyExtractor={(item, idx) => idx.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
        />
    );

    const renderRosterContent = () => (
        <FlatList
            data={roster}
            renderItem={({ item }) => (
                <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-white/20">
                    <View className="flex-row items-center flex-1">
                        <View className="w-12 h-12 bg-blue-500 rounded-full" />
                        <View className="ml-3 flex-1">
                            <Text className="text-white text-base font-oswald-medium">#{item.number}  {item.name}</Text>
                            <Text className="text-white/60 text-sm font-oswald-regular">Position: {item.position}</Text>
                            <Text className="text-white/60 text-sm font-oswald-regular">Stats: {item.goals} Goals | {item.assists} Assist | {item.matches} Matches</Text>
                        </View>
                    </View>
                    <ChevronRight size={20} color="white" />
                </TouchableOpacity>
            )}
            keyExtractor={(item, idx) => idx.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
        />
    );

    const renderFixturesContent = () => (
        <FlatList
            data={fixtures}
            renderItem={({ item }) => (
                <View className="bg-[#4c4c4c] rounded-2xl p-4 mt-4">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-white text-sm font-oswald-regular">{item.league}</Text>
                        <Text className="text-white text-sm font-oswald-regular">{item.date}</Text>
                    </View>
                    <View className="flex-row items-center justify-between">
                        <View className="items-center flex-1">
                            <View className="w-16 h-16 bg-white rounded-xl items-center justify-center mb-2">
                                <Text className="text-3xl">{item.logo1}</Text>
                            </View>
                            <Text className="text-white text-sm font-oswald-regular text-center">{item.team1}</Text>
                        </View>
                        <View className="mx-4">
                            {item.time ? (
                                <Text className="text-white text-2xl font-oswald-semiBold">{item.time}</Text>
                            ) : (
                                <Text className="text-white text-2xl font-oswald-semiBold">{item.score1} - {item.score2}</Text>
                            )}
                        </View>
                        <View className="items-center flex-1">
                            <View className="w-16 h-16 bg-white rounded-xl items-center justify-center mb-2">
                                <Text className="text-3xl">{item.logo2}</Text>
                            </View>
                            <Text className="text-white text-sm font-oswald-regular text-center">{item.team2}</Text>
                        </View>
                    </View>
                </View>
            )}
            keyExtractor={(item, idx) => idx.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
        />
    );

    const renderStandingsContent = () => (
    <>
        <FlatList
            data={standings}
            ListHeaderComponent={() => (
                <>
                    <View className="flex-row items-center justify-between py-4 space-x-2">
                        <View>
                            <TouchableOpacity 
                                className="flex-row items-center bg-gray-700 rounded-xl px-4 py-2 mr-2"
                                onPress={() => {
                                    setSeasonOpen(!seasonOpen);
                                    setLeagueOpen(false);
                                    setRegionOpen(false);
                                }}
                            >
                                <Text className="text-white text-sm font-oswald-regular mr-2">📅</Text>
                                <Text className="text-white text-sm font-oswald-regular mr-1">{selectedSeason}</Text>
                                <ChevronDown size={16} color="white" />
                            </TouchableOpacity>
                        </View>

                        <View>
                            <TouchableOpacity 
                                className="flex-row items-center bg-[#7ac7ea] rounded-xl px-4 py-2 mr-2"
                                onPress={() => {
                                    setLeagueOpen(!leagueOpen);
                                    setSeasonOpen(false);
                                    setRegionOpen(false);
                                }}
                            >
                                <Text className="text-white text-sm font-oswald-regular mr-1">{selectedLeague}</Text>
                                <ChevronDown size={16} color="white" />
                            </TouchableOpacity>
                        </View>

                        <View>
                            <TouchableOpacity 
                                className="flex-row items-center bg-gray-700 rounded-xl px-4 py-2"
                                onPress={() => {
                                    setRegionOpen(!regionOpen);
                                    setSeasonOpen(false);
                                    setLeagueOpen(false);
                                }}
                            >
                                <Text className="text-white text-sm font-oswald-regular mr-1">{selectedRegion}</Text>
                                <ChevronDown size={16} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View>
                        <View className="flex-row items-center py-3 border-b border-white/20">
                            <Text className="text-white/60 text-xs font-oswald-medium flex-1">TEAM</Text>
                            <Text className="text-white/60 text-xs font-oswald-medium w-12 text-center">P</Text>
                            <Text className="text-white/60 text-xs font-oswald-medium w-12 text-center">W</Text>
                            <Text className="text-white/60 text-xs font-oswald-medium w-12 text-center">D</Text>
                            <Text className="text-white/60 text-xs font-oswald-medium w-12 text-center">L</Text>
                        </View>
                    </View>
                </>
            )}
            renderItem={({ item }) => (
                <View>
                    <View className="flex-row items-center py-4 border-b border-white/20">
                        <View className="flex-row items-center flex-1">
                            <Image 
                                source={barcelona}
                                className='h-10 w-10 rounded-full mr-1'
                                style={{ objectFit: 'contain' }}
                            />
                            <Text className="text-white text-sm font-oswald-medium">{item.team}</Text>
                        </View>
                        <Text className="text-white text-sm font-oswald-regular w-12 text-center">{item.p}</Text>
                        <Text className="text-white text-sm font-oswald-regular w-12 text-center">{item.w}</Text>
                        <Text className="text-white text-sm font-oswald-regular w-12 text-center">{item.d}</Text>
                        <Text className="text-white text-sm font-oswald-regular w-12 text-center">{item.l}</Text>
                    </View>
                </View>
            )}
            keyExtractor={(item, idx) => idx.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
        />
        
        {seasonOpen && (
            <View className="absolute top-20 left-0 bg-white rounded-xl p-2" style={{ width: 120, elevation: 10 }}>
                {['2023/24', '2022/23', '2021/22'].map((season, idx) => (
                    <TouchableOpacity
                        key={idx.toString()}
                        className="py-2 px-3"
                        onPress={() => {
                            setSelectedSeason(season);
                            setSeasonOpen(false);
                        }}
                    >
                        <Text className="text-sm font-oswald-regular text-gray-800">{season}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        )}
        
        {leagueOpen && (
            <View className="absolute top-20 left-32 bg-white rounded-xl p-2" style={{ width: 150, elevation: 10 }}>
                {['Premier League', 'La Liga', 'Serie A'].map((league, idx) => (
                    <TouchableOpacity
                        key={idx.toString()}
                        className="py-2 px-3"
                        onPress={() => {
                            setSelectedLeague(league);
                            setLeagueOpen(false);
                        }}
                    >
                        <Text className="text-sm font-oswald-regular text-gray-800">{league}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        )}
        
        {regionOpen && (
            <View className="absolute top-20 right-0 bg-white rounded-xl p-2" style={{ width: 120, elevation: 10 }}>
                {['Region', 'Europe', 'Asia', 'America'].map((region, idx) => (
                    <TouchableOpacity
                        key={idx.toString()}
                        className="py-2 px-3"
                        onPress={() => {
                            setSelectedRegion(region);
                            setRegionOpen(false);
                        }}
                    >
                        <Text className="text-sm font-oswald-regular text-gray-800">{region}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        )}
    </>
);

    const renderContent = () => {
        switch (activeTab) {
            case 'Feed':
                return renderFeedContent();
            case 'Stats':
                return renderStatsContent();
            case 'Roster':
                return renderRosterContent();
            case 'Fixtures':
                return renderFixturesContent();
            case 'Standings':
                return renderStandingsContent();
            default:
                return null;
        }
    };

    return (
        <WrapperComponent
                title={""}
                bg_color={"bg-[#5e5e5e]"}
                container_bg={"bg-[#5e5e5e]"}
                headerComponent={() => <View className="flex-row items-center justify-between mb-4 mx-5">
                        <BackButton/>
                        <View className="flex-1">
                            <View className=" mx-2">
                                <TextInput
                                    className="bg-white rounded-xl px-2 py-3 pr-12 text-sm font-oswald-regular"
                                    placeholder="Search to add a source for this team/league/athlete"
                                    placeholderTextColor="#a0a0a0"
                                    value={searchQuery}
                                    onChangeText={handle_search}
                                />
                                <View className="absolute right-4 top-3">
                                    <Search size={22} color="#5e5e5e" />
                                </View>
                            </View>
                        </View>

                </View>}
            >

        
            <View className=" pb-4 bg-[#5e5e5e] relative">
            
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                        {entityDetails?.entity?.logo_url?<View className='w-16 h-16 bg-white rounded-2xl mr-3 items-center justify-center'> 
                            <Image source={{uri: entityDetails?.entity?.logo_url}} className="w-12 h-12 rounded-full" style={{resizeMode: 'cover'}} />
                        </View>: <View className="w-16 h-16 bg-white rounded-2xl mr-3 items-center justify-center">
                            <Text className="text-3xl">🏀</Text>
                        </View>}
                        <View>
                            <Text className="text-white text-xl font-oswald-semiBold">{entityDetails?.entity?.name}</Text>
                            <Text className="text-white/60 text-sm font-oswald-medium">{entityDetails?.entity?.slug}</Text>
                        </View>
                    </View>
                    { !(entityDetails?.entity?.in_nest || isAddedToNest) && <TouchableOpacity onPress={() => {
                        if(entityDetails?.entity?.id){
                            add_nest_entity({entity_id: entityDetails?.entity?.id}, (res) => {
                                setIsAddedToNest(true)
                            })
                        }
                    }} className="bg-[#7ac7ea] rounded-full px-6 py-3">
                        <Text className="text-white text-sm font-oswald-semiBold">Add to Nest</Text>
                    </TouchableOpacity>}
                </View>
            </View>

            <View className="flex-row items-center justify-between border-b border-white/20 bg-[#5e5e5e]">
                {tabs.map((tab, idx) => (
                    <TouchableOpacity
                        key={idx.toString()}
                        className="mr-6 pb-3"
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text className={`text-base font-oswald-semiBold ${activeTab === tab ? 'text-[#7ac7ea]' : 'text-white/60'}`}>
                            {tab}
                        </Text>
                        {activeTab === tab && (
                            <View className="h-1 bg-[#7ac7ea] rounded-full mt-2" />
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            <View className="flex-1 bg-[#5e5e5e]">
                {renderContent()}
            </View>

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
                                        setViewEntity(item.id);
                                        setIsAddedToNest(false);
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
    );
    
};

export default TeamDetailScreen;