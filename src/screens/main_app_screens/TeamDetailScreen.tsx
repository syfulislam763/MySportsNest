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

interface StandingRow {
    rank: number;
    team_id: number;
    team_name: string;
    logo: string;
    points: number;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goals_for: number;
    goals_against: number;
    goal_diff: number;
    form: string;
    is_highlighted: boolean;
}

interface StandingsData {
    league: Entity;
    season: string;
    standings: StandingRow[];
}

interface FixtureEntity {
    id: number;
    name: string;
    logo_url: string;
    type: string;
    sport: string;
}

interface Fixture {
    id: number;
    sport: string;
    status: string;
    status_detail: string;
    home_entity: FixtureEntity;
    away_entity: FixtureEntity;
    league: { id: number; name: string; logo_url: string };
    home_score: number | null;
    away_score: number | null;
    start_time: string;
    venue_name: string;
    venue_city: string;
}

interface FixturesData {
    entity: Entity;
    fixtures_count: number;
    fixtures: Fixture[];
}

interface TeamStatsData {
    team: Entity;
    season: string;
    stats: {
        win: number;
        draw: number;
        lose: number;
        form: string;
        rank: number;
        played: number;
        points: number;
        goal_diff: number;
        goals_for: number;
        goals_against: number;
    };
}

interface AthleteStatsData {
    athlete: Entity;
    season: string;
    stats: {
        age: number | null;
        goals: number | null;
        height: string | null;
        rating: number | null;
        weight: string | null;
        assists: number | null;
        minutes: number | null;
        shots_on: number | null;
        red_cards: number | null;
        passes_key: number | null;
        appearances: number | null;
        nationality: string | null;
        shots_total: number | null;
        passes_total: number | null;
        yellow_cards: number | null;
        pass_accuracy: number | null;
        dribbles_success: number | null;
    };
}

interface RosterPlayer {
    id: number;
    name: string;
    position: string;
    jersey_number: number | null;
    photo: string;
    height_cm: number | null;
    weight_kg: number | null;
    nationality: string;
}

interface TeamRosterData {
    team: Entity;
    roster_count: number;
    roster: RosterPlayer[];
}

interface AthleteRosterData {
    id: number;
    name: string;
    photo: string;
    date_of_birth: string | null;
    age: number | null;
    nationality: string;
    height_cm: number | null;
    weight_kg: number | null;
    current_team: Entity | null;
    position: string;
    jersey_number: number | null;
    twitter: string;
    instagram: string;
    bio: string;
}

const FormBadge = ({ letter }: { letter: string }) => {
    const color = letter === 'W' ? '#4ade80' : letter === 'L' ? '#f87171' : '#facc15';
    return (
        <View style={{ width: 18, height: 18, borderRadius: 4, backgroundColor: color, alignItems: 'center', justifyContent: 'center', marginRight: 2 }}>
            <Text style={{ color: 'white', fontSize: 10, fontFamily: 'Oswald-Bold' }}>{letter}</Text>
        </View>
    );
};

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
    const [entityType, setEntityType] = useState<'team' | 'league' | 'athlete'>('team');
    const [statsData, setStatsData] = useState<TeamStatsData | AthleteStatsData | StandingsData | null>(null);
    const [rosterData, setRosterData] = useState<TeamRosterData | AthleteRosterData | null>(null);
    const [fixturesData, setFixturesData] = useState<FixturesData | null>(null);
    const [standingsData, setStandingsData] = useState<StandingsData | null>(null);

    //console.log("entity details", JSON.stringify(entityDetails, null, 2))

    const handle_get_entity_details = async (id:number) => {
        get_entity_details(id, (res) => {
            const isType = res?.data?.entity?.type ?? ""
            if(isType == "athlete"){
                setTabs(['Feed', 'Stats', 'Roster'])
                setEntityType('athlete')
            } else if (isType == "league") {
                setTabs(['Feed', 'Stats', 'Fixtures', 'Standings'])
                setEntityType('league')
            } else {
                setTabs(['Feed', 'Stats', 'Roster', 'Fixtures', 'Standings'])
                setEntityType('team')
            }
            setEntityDetails(res.data)
            console.log(JSON.stringify(res.data, null, 2), "df")
        })
    }

    useEffect(() => {
        handle_get_entity_details(viewEntity || route.params.entity_id)
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
        //setLoadingTrue();
        get_entity_feed(id, (res) => {
            //setLoadingFalse();
            setPosts(res?.data?.results ?? [])
            console.log(JSON.stringify(res.data, null, 2), "feed")
        })
    }
    const handle_get_entity_stats = async (id:number) => {
        setLoadingTrue();
        get_entity_status(id, (res) => {
            setLoadingFalse();
            setStatsData(res.data ?? null);
            //console.log(JSON.stringify(res.data, null, 2), "stats")
        })
    }
    const handle_get_entity_roster = async (id:number) => {
        setLoadingTrue();
        get_entity_roster(id, (res) => {
            setLoadingFalse();
            setRosterData(res.data ?? null);
            //console.log(JSON.stringify(res.data, null, 2), "roster")
        })
    }

    const handle_get_entity_fixture = async (id:number) => {
        setLoadingTrue();
        get_entity_fixture(id, (res) => {
            setLoadingFalse();
            setFixturesData(res.data ?? null);
            //console.log(JSON.stringify(res.data, null, 2), "fixture")
        })
    }

    const handle_get_entity_standings = async (id:number) => {
        setLoadingTrue();
        get_entity_standings(id, (res) => {
            setLoadingFalse();
            setStandingsData(res.data ?? null);
            //console.log(JSON.stringify(res.data, null, 2), "standings")
        })
    }


    const barcelona = require("../../../assets/img/barcelona.png")

    const navigation = useNavigation<NavigationPropsType>()
    const route = useRoute<EntityIdType>()
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

    console.log(":ddd:")

    const renderFeedContent = () => {

        if(posts.length <= 0){
            return <View className='mt-5'>
                <Text className='font-oswald-semiBold text-white text-sm'>No post has been found!</Text>
            </View>
        }
        return (
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
    )
    };

    const renderStatsContent = () => {
        if (entityType === 'team') {
            const data = statsData as TeamStatsData | null;
            if (!data?.stats) return null;
            const s = data.stats;
            return (
                <View className="py-4">
                    <Text className="text-white text-xl font-oswald-medium mb-4">Season {data.season} Stats</Text>
                    <View className="bg-[#4c4c4c] rounded-2xl p-4 mb-4">
                        <View className="flex-row justify-between mb-3">
                            <View className="items-center flex-1">
                                <Text className="text-white text-2xl font-oswald-bold">{s.points}</Text>
                                <Text className="text-white/60 text-xs font-oswald-regular mt-1">Points</Text>
                            </View>
                            <View className="items-center flex-1">
                                <Text className="text-white text-2xl font-oswald-bold">#{s.rank}</Text>
                                <Text className="text-white/60 text-xs font-oswald-regular mt-1">Rank</Text>
                            </View>
                            <View className="items-center flex-1">
                                <Text className="text-white text-2xl font-oswald-bold">{s.played}</Text>
                                <Text className="text-white/60 text-xs font-oswald-regular mt-1">Played</Text>
                            </View>
                        </View>
                        <View className="flex-row justify-between mb-4">
                            <View className="items-center flex-1">
                                <Text className="text-[#4ade80] text-xl font-oswald-bold">{s.win}</Text>
                                <Text className="text-white/60 text-xs font-oswald-regular mt-1">Wins</Text>
                            </View>
                            <View className="items-center flex-1">
                                <Text className="text-[#facc15] text-xl font-oswald-bold">{s.draw}</Text>
                                <Text className="text-white/60 text-xs font-oswald-regular mt-1">Draws</Text>
                            </View>
                            <View className="items-center flex-1">
                                <Text className="text-[#f87171] text-xl font-oswald-bold">{s.lose}</Text>
                                <Text className="text-white/60 text-xs font-oswald-regular mt-1">Losses</Text>
                            </View>
                        </View>
                        <View className="flex-row justify-between border-t border-white/10 pt-3 mb-4">
                            <View className="items-center flex-1">
                                <Text className="text-white text-lg font-oswald-bold">{s.goals_for}</Text>
                                <Text className="text-white/60 text-xs font-oswald-regular mt-1">Goals For</Text>
                            </View>
                            <View className="items-center flex-1">
                                <Text className="text-white text-lg font-oswald-bold">{s.goals_against}</Text>
                                <Text className="text-white/60 text-xs font-oswald-regular mt-1">Goals Against</Text>
                            </View>
                            <View className="items-center flex-1">
                                <Text className={`text-lg font-oswald-bold ${s.goal_diff >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>{s.goal_diff > 0 ? `+${s.goal_diff}` : s.goal_diff}</Text>
                                <Text className="text-white/60 text-xs font-oswald-regular mt-1">Goal Diff</Text>
                            </View>
                        </View>
                        <View>
                            <Text className="text-white/60 text-xs font-oswald-regular mb-2">Form</Text>
                            <View className="flex-row">
                                {s?.form?.split('').map((letter, i) => <FormBadge key={i} letter={letter} />)}
                            </View>
                        </View>
                    </View>
                </View>
            );
        }

        if (entityType === 'league') {
            const data = statsData as StandingsData | null;
            if (!data?.standings) return null;
            return renderStandingsTable(data.standings, data.season);
        }

        if (entityType === 'athlete') {
            const data = statsData as AthleteStatsData | null;
            if (!data?.stats) return null;
            const s = data.stats;
            const statItems = [
                { label: 'Appearances', value: s.appearances },
                { label: 'Goals', value: s.goals },
                { label: 'Assists', value: s.assists },
                { label: 'Minutes', value: s.minutes },
                { label: 'Yellow Cards', value: s.yellow_cards },
                { label: 'Red Cards', value: s.red_cards },
                { label: 'Rating', value: s.rating },
                { label: 'Shots Total', value: s.shots_total },
                { label: 'Shots On Target', value: s.shots_on },
                { label: 'Key Passes', value: s.passes_key },
                { label: 'Pass Accuracy', value: s.pass_accuracy },
                { label: 'Dribbles', value: s.dribbles_success },
                { label: 'Age', value: s.age },
                { label: 'Height', value: s.height },
                { label: 'Nationality', value: s.nationality },
            ].filter((i) => i.value !== null && i.value !== undefined);
            return (
                <View className="py-4">
                    <Text className="text-white text-xl font-oswald-medium mb-4">Season {data.season} Stats</Text>
                    <View className="bg-[#4c4c4c] rounded-2xl px-4 py-2">
                        {statItems.map((item, idx) => (
                            <View key={idx} className="flex-row items-center justify-between py-3 border-b border-white/10">
                                <Text className="text-white/60 text-sm font-oswald-regular">{item.label}</Text>
                                <Text className="text-white text-sm font-oswald-semiBold">{String(item.value)}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            );
        }

        return null;
    };

    const renderRosterContent = () => {
        if (entityType === 'team') {
            const data = rosterData as TeamRosterData | null;
            const players = data?.roster ?? [];
            return (
                <FlatList
                    data={players}
                    renderItem={({ item }) => (
                        <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-white/20">
                            <View className="flex-row items-center flex-1">
                                {item.photo ? (
                                    <Image source={{ uri: item.photo }} className="w-12 h-12 rounded-full" style={{ resizeMode: 'cover' }} />
                                ) : (
                                    <View className="w-12 h-12 bg-blue-500 rounded-full" />
                                )}
                                <View className="ml-3 flex-1">
                                    <Text className="text-white text-base font-oswald-medium">#{item.jersey_number ?? '—'}  {item.name}</Text>
                                    <Text className="text-white/60 text-sm font-oswald-regular">Position: {item.position}</Text>
                                    {item.nationality ? <Text className="text-white/60 text-sm font-oswald-regular">{item.nationality}</Text> : null}
                                </View>
                            </View>
                            <ChevronRight size={20} color="white" />
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => String(item.id)}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            );
        }

        if (entityType === 'athlete') {
            const data = rosterData as AthleteRosterData | null;
            if (!data) return null;
            return (
                <View className="py-4">
                    <View className="flex-row items-center mb-6">
                        {data.photo ? (
                            <Image source={{ uri: data.photo }} style={{ width: 72, height: 72, borderRadius: 36, resizeMode: 'cover' }} />
                        ) : (
                            <View className="w-18 h-18 bg-blue-500 rounded-full" />
                        )}
                        <View className="ml-4 flex-1">
                            <Text className="text-white text-xl font-oswald-semiBold">{data.name}</Text>
                            <Text className="text-white/60 text-sm font-oswald-regular">{data.position}{data.jersey_number ? ` • #${data.jersey_number}` : ''}</Text>
                            {data.nationality ? <Text className="text-white/60 text-sm font-oswald-regular">{data.nationality}</Text> : null}
                        </View>
                    </View>
                    {data.current_team && (
                        <View className="bg-[#4c4c4c] rounded-2xl p-4 mb-4">
                            <Text className="text-white/60 text-xs font-oswald-regular mb-3">Current Team</Text>
                            <View className="flex-row items-center">
                                {data.current_team.logo_url ? (
                                    <Image source={{ uri: data.current_team.logo_url }} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
                                ) : null}
                                <Text className="text-white text-base font-oswald-semiBold ml-3">{data.current_team.name}</Text>
                            </View>
                        </View>
                    )}
                    <View className="bg-[#4c4c4c] rounded-2xl px-4 py-2">
                        {data.age ? <View className="flex-row justify-between py-3 border-b border-white/10"><Text className="text-white/60 text-sm font-oswald-regular">Age</Text><Text className="text-white text-sm font-oswald-semiBold">{data.age}</Text></View> : null}
                        {data.height_cm ? <View className="flex-row justify-between py-3 border-b border-white/10"><Text className="text-white/60 text-sm font-oswald-regular">Height</Text><Text className="text-white text-sm font-oswald-semiBold">{data.height_cm} cm</Text></View> : null}
                        {data.weight_kg ? <View className="flex-row justify-between py-3 border-b border-white/10"><Text className="text-white/60 text-sm font-oswald-regular">Weight</Text><Text className="text-white text-sm font-oswald-semiBold">{data.weight_kg} kg</Text></View> : null}
                        {data.bio ? <View className="py-3"><Text className="text-white/60 text-xs font-oswald-regular mb-1">Bio</Text><Text className="text-white text-sm font-oswald-regular">{data.bio}</Text></View> : null}
                    </View>
                </View>
            );
        }

        return null;
    };

    const renderFixturesContent = () => {
        const fixtures = fixturesData?.fixtures ?? [];
        return (
            <FlatList
                data={fixtures}
                renderItem={({ item }) => (
                    <View className="bg-[#4c4c4c] rounded-2xl p-4 mt-4">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-white text-sm font-oswald-regular">{item.league.name}</Text>
                            <Text className="text-white text-sm font-oswald-regular">{extractDateParts(item.start_time)}</Text>
                        </View>
                        <View className="flex-row items-center justify-between">
                            <View className="items-center flex-1">
                                {item.home_entity.logo_url ? (
                                    <Image source={{ uri: item.home_entity.logo_url }} style={{ width: 56, height: 56, resizeMode: 'contain' }} className="mb-2" />
                                ) : (
                                    <View className="w-14 h-14 bg-white rounded-xl items-center justify-center mb-2" />
                                )}
                                <Text className="text-white text-sm font-oswald-regular text-center">{item.home_entity.name}</Text>
                            </View>
                            <View className="mx-4 items-center">
                                {item.home_score !== null && item.away_score !== null ? (
                                    <Text className="text-white text-2xl font-oswald-semiBold">{item.home_score} - {item.away_score}</Text>
                                ) : (
                                    <Text className="text-white text-2xl font-oswald-semiBold">vs</Text>
                                )}
                                <Text className="text-white/50 text-xs font-oswald-regular mt-1">{item.status_detail}</Text>
                            </View>
                            <View className="items-center flex-1">
                                {item.away_entity.logo_url ? (
                                    <Image source={{ uri: item.away_entity.logo_url }} style={{ width: 56, height: 56, resizeMode: 'contain' }} className="mb-2" />
                                ) : (
                                    <View className="w-14 h-14 bg-white rounded-xl items-center justify-center mb-2" />
                                )}
                                <Text className="text-white text-sm font-oswald-regular text-center">{item.away_entity.name}</Text>
                            </View>
                        </View>
                        {item.venue_name ? (
                            <Text className="text-white/40 text-xs font-oswald-regular text-center mt-3">{item.venue_name}{item.venue_city ? `, ${item.venue_city}` : ''}</Text>
                        ) : null}
                    </View>
                )}
                keyExtractor={(item) => String(item.id)}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            />
        );
    };

    const renderStandingsTable = (rows: StandingRow[], season?: string) => (
        <FlatList
            data={rows}
            ListHeaderComponent={() => (
                <>
                    {season ? <Text className="text-white/60 text-xs font-oswald-regular py-2">Season {season}</Text> : null}
                    <View className="flex-row items-center py-3 border-b border-white/20">
                        <Text className="text-white/60 text-xs font-oswald-medium w-6 text-center">#</Text>
                        <Text className="text-white/60 text-xs font-oswald-medium flex-1 ml-2">TEAM</Text>
                        <Text className="text-white/60 text-xs font-oswald-medium w-10 text-center">P</Text>
                        <Text className="text-white/60 text-xs font-oswald-medium w-10 text-center">W</Text>
                        <Text className="text-white/60 text-xs font-oswald-medium w-10 text-center">D</Text>
                        <Text className="text-white/60 text-xs font-oswald-medium w-10 text-center">L</Text>
                        <Text className="text-white/60 text-xs font-oswald-medium w-10 text-center">Pts</Text>
                    </View>
                </>
            )}
            renderItem={({ item }) => (
                <View className={`flex-row items-center py-3 border-b border-white/20 ${item.is_highlighted ? 'bg-[#7ac7ea]/10 rounded-xl' : ''}`}>
                    <Text className="text-white/60 text-xs font-oswald-regular w-6 text-center">{item.rank}</Text>
                    <View className="flex-row items-center flex-1 ml-2">
                        {item.logo ? (
                            <Image source={{ uri: item.logo }} style={{ width: 24, height: 24, resizeMode: 'contain' }} className="mr-2" />
                        ) : (
                            <View className="w-6 h-6 rounded-full bg-white/20 mr-2" />
                        )}
                        <Text className={`text-sm font-oswald-medium flex-1 ${item.is_highlighted ? 'text-[#7ac7ea]' : 'text-white'}`} numberOfLines={1}>{item.team_name}</Text>
                    </View>
                    <Text className="text-white text-xs font-oswald-regular w-10 text-center">{item.played}</Text>
                    <Text className="text-white text-xs font-oswald-regular w-10 text-center">{item.wins}</Text>
                    <Text className="text-white text-xs font-oswald-regular w-10 text-center">{item.draws}</Text>
                    <Text className="text-white text-xs font-oswald-regular w-10 text-center">{item.losses}</Text>
                    <Text className="text-white text-xs font-oswald-bold w-10 text-center">{item.points}</Text>
                </View>
            )}
            keyExtractor={(item) => String(item.team_id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
        />
    );

    const renderStandingsContent = () => {
        const data = standingsData;
        if (!data?.standings) return null;
        return renderStandingsTable(data.standings, data.season);
    };

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



        </WrapperComponent>
    );
    
};

export default TeamDetailScreen;