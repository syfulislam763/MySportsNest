import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Dimensions, ActivityIndicator } from 'react-native';
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
import { Check, Plus, X } from 'lucide-react-native';
import { OnboardingAPI, add_nest_entity, remove_nest_entity } from '@/screens/onboarding_screens/onboardingApi';
import { renderFeedContent, renderStatsContent, renderRosterContent, renderFixturesContent, renderStandingsContent } from './TeamDetailsSupportComponents';
import { Tab, SearchEntity, TeamProfile, TeamStatsData, AthleteStatsData, StandingsData, AthleteRosterData, TeamRosterData, FixturesData } from './TeamDetailsType';
import api from '@/constants/Axios';

type NavigationPropsType = NativeStackNavigationProp<MainStackParamList>
type EntityIdType = RouteProp<MainStackParamList, "TeamDetailScreen">

const { width } = Dimensions.get('window');

// --- Source search types ---
interface SourceResult {
    name: string;
    domain: string;
    description: string;
    favicon_url: string;
    rss_url: string;
    has_rss: boolean;
    tags: string[];
    source_id: number | null;
    is_added: boolean;
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
    const [entityType, setEntityType] = useState<'team' | 'league' | 'athlete'>('team');
    const [statsData, setStatsData] = useState<TeamStatsData | AthleteStatsData | StandingsData | null>(null);
    const [rosterData, setRosterData] = useState<TeamRosterData | AthleteRosterData | null>(null);
    const [fixturesData, setFixturesData] = useState<FixturesData | null>(null);
    const [standingsData, setStandingsData] = useState<StandingsData | null>(null);

    // --- Source search state ---
    const [sourceSearchQuery, setSourceSearchQuery] = useState('');
    const [sourceResults, setSourceResults] = useState<SourceResult[]>([]);
    const [sourceSearchLoading, setSourceSearchLoading] = useState(false);
    const [addedSources, setAddedSources] = useState<{ [key: string]: number | null }>({});
    // per-item loading: keyed by domain
    const [itemLoading, setItemLoading] = useState<{ [key: string]: boolean }>({});
    const sourceSearchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    //console.log("entity details", JSON.stringify(entityDetails, null, 2))

    const handle_get_entity_details = async (id: number) => {
        get_entity_details(id, (res) => {
            const isType = res?.data?.entity?.type ?? ""
            if (isType == "athlete") {
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
        }).catch(() => { });
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

    const handle_Like = (id: number) => {

        like_post(id, (res) => {
            if (res) {
                handle_get_entity_feed(viewEntity || route.params.entity_id)
            }
        })
    }

    const handle_feedback = (id: number) => {

        feedback_post(id, (res) => {
            if (res) {
                handle_get_entity_feed(viewEntity || route.params.entity_id)
            }
        })
    }

    const handle_get_entity_feed = async (id: number) => {
        //setLoadingTrue();
        get_entity_feed(id, (res) => {
            //setLoadingFalse();
            setPosts(res?.data?.results ?? [])
            // console.log(JSON.stringify(res.data, null, 2), "feed")
        })
    }
    const handle_get_entity_stats = async (id: number) => {
        setLoadingTrue();
        get_entity_status(id, (res) => {
            setLoadingFalse();
            setStatsData(res.data ?? null);
            //console.log(JSON.stringify(res.data, null, 2), "stats")
        })
    }
    const handle_get_entity_roster = async (id: number) => {
        setLoadingTrue();
        get_entity_roster(id, (res) => {
            setLoadingFalse();
            setRosterData(res.data ?? null);
            //console.log(JSON.stringify(res.data, null, 2), "roster")
        })
    }

    const handle_get_entity_fixture = async (id: number) => {
        setLoadingTrue();
        get_entity_fixture(id, (res) => {
            setLoadingFalse();
            setFixturesData(res.data ?? null);
            //console.log(JSON.stringify(res.data, null, 2), "fixture")
        })
    }

    const handle_get_entity_standings = async (id: number) => {
        setLoadingTrue();
        get_entity_standings(id, (res) => {
            setLoadingFalse();
            setStandingsData(res.data ?? null);
            //console.log(JSON.stringify(res.data, null, 2), "standings")
        })
    }

    // --- Source search handlers ---
    const handle_source_search = (value: string) => {
        setSourceSearchQuery(value);
        if (!value.trim()) {
            setSourceResults([]);
            return;
        }
        // debounce
        if (sourceSearchTimeout.current) clearTimeout(sourceSearchTimeout.current);
        sourceSearchTimeout.current = setTimeout(async () => {
            setSourceSearchLoading(true);
            try {
                const res = await api.get(`/api/source/search/?q=${encodeURIComponent(value)}`);
                const results: SourceResult[] = res?.data?.results ?? [];
                setSourceResults(results);
                // seed local added state from api response
                const seedMap: { [key: string]: number | null } = {};
                results.forEach((r) => {
                    if (r.is_added) seedMap[r.domain] = r.source_id;
                });
                setAddedSources((prev) => ({ ...prev, ...seedMap }));
            } catch (e) {
                setSourceResults([]);
            } finally {
                setSourceSearchLoading(false);
            }
        }, 400);
    };

    const handle_add_source = async (item: SourceResult) => {
        setItemLoading((prev) => ({ ...prev, [item.domain]: true }));
        try {                                                                                             
            const body = {
                domain: item.domain,
                name: item.name,
                rss_url: item.rss_url ?? '',
                search_query: item.name,
                favicon_url: item.favicon_url,
            };
            const res = await api.post('/api/source/add/', body);
            const newSourceId = res?.data?.source_id ?? res?.data?.id ?? item.source_id;
            setAddedSources((prev) => ({ ...prev, [item.domain]: newSourceId }));
        } catch (e) {
            // handle silently

        } finally {
            setItemLoading((prev) => ({ ...prev, [item.domain]: false }));
        }
    };

    const handle_remove_source = async (item: SourceResult) => {
        const sourceId = addedSources[item.domain] ?? item.source_id;
        if (!sourceId) return;
        setItemLoading((prev) => ({ ...prev, [item.domain]: true }));
        try {
            await api.delete(`/api/source/${sourceId}/remove/`);
            setAddedSources((prev) => ({ ...prev, [item.domain]: null }));
        } catch (e) {
            // handle silently
        } finally {
            setItemLoading((prev) => ({ ...prev, [item.domain]: false }));
        }
    };

    const isSourceAdded = (item: SourceResult): boolean => {
        const localState = addedSources[item.domain];
        // explicitly set to null means removed; undefined means we fall back to api value
        if (localState === null) return false;
        if (localState !== undefined) return true;
        return item.is_added;
    };

    const closeSourceDropdown = () => {
        setSourceSearchQuery('');
        setSourceResults([]);
    };


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
                return;
            case 'Roster':
                handle_get_entity_roster(viewEntity || route.params.entity_id)
                return;
            case 'Fixtures':
                handle_get_entity_fixture(viewEntity || route.params.entity_id)
                return;
            case 'Standings':
                handle_get_entity_standings(viewEntity || route.params.entity_id)
                return;
            default:
                return null;
        }
    };

    useEffect(() => {
        handle_get_data()
    }, [activeTab, viewEntity])


    const renderContent = () => {
        switch (activeTab) {
            case 'Feed':
                return renderFeedContent({ posts, handle_like: handle_Like, handle_feedback });
            case 'Stats':
                return renderStatsContent({ entityType, statsData });
            case 'Roster':
                return renderRosterContent({ entityType, rosterData });
            case 'Fixtures':
                return renderFixturesContent({ fixturesData });
            case 'Standings':
                return renderStandingsContent({ standingsData });
            default:
                return null;
        }
    };

    console.log("search", JSON.stringify(sourceResults, null, 2))
    // whether dropdown should be visible
    const showDropdown = sourceSearchQuery.trim().length > 0 && (sourceSearchLoading || sourceResults.length > 0);

    return (
        <WrapperComponent
            title={""}
            bg_color={"bg-[#5e5e5e]"}
            container_bg={"bg-[#5e5e5e]"}
            headerComponent={() => (
                <View className="mb-4 mx-5">
                    <View className="flex-row items-center justify-between">
                        <BackButton />
                        <View className="flex-1 mx-2">

                            {/* Search input */}
                            <TextInput
                                className="bg-white rounded-xl px-2 py-3 pr-12 text-sm font-oswald-regular"
                                placeholder="Search to add a source for this team/league/athlete"
                                placeholderTextColor="#a0a0a0"
                                value={sourceSearchQuery}
                                onChangeText={handle_source_search}
                            />
                            {/* Right icon: spinner while fetching, X to clear, or magnifier */}
                            <View className="absolute right-4 top-3">
                                {sourceSearchLoading ? (
                                    <ActivityIndicator size="small" color="#5e5e5e" />
                                ) : sourceSearchQuery.length > 0 ? (
                                    <TouchableOpacity onPress={closeSourceDropdown}>
                                        <X size={20} color="#5e5e5e" />
                                    </TouchableOpacity>
                                ) : (
                                    <Search size={22} color="#5e5e5e" />
                                )}
                            </View>

                        </View>
                    </View>
                </View>
            )}
        >

            {/* ---- Floating source search dropdown — absolutely over all screen content ---- */}
            {showDropdown && (
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 9999,
                        elevation: 20,
                        maxHeight: 480,
                        backgroundColor: '#3a3a3a',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.45,
                        shadowRadius: 12,
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                    }}
                >
                    {sourceSearchLoading ? (
                        null
                    ) : (
                        <FlatList
                            data={sourceResults}
                            keyExtractor={(item) => item.domain}
                            contentContainerStyle={{ padding: 10 }}
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled
                            keyboardShouldPersistTaps="handled"
                            renderItem={({ item }) => {
                                const added = isSourceAdded(item);
                                const loading = !!itemLoading[item.domain];
                                return (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'flex-start',
                                            borderRadius: 16,
                                            padding: 12,
                                            marginBottom: 8,
                                            borderWidth: 1,
                                            borderColor: added ? 'rgba(122,199,234,0.5)' : 'rgba(255,255,255,0.1)',
                                            backgroundColor: added ? 'rgba(122,199,234,0.08)' : 'rgba(255,255,255,0.05)',
                                        }}
                                    >
                                        {/* Favicon */}
                                        {item.favicon_url ? (
                                            <Image
                                                source={{ uri: item.favicon_url }}
                                                style={{ width: 40, height: 40, borderRadius: 10, marginRight: 12, resizeMode: 'cover' }}
                                            />
                                        ) : (
                                            <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', marginRight: 12 }} />
                                        )}

                                        {/* Name + domain */}
                                        <View style={{ flex: 1, marginRight: 8 }}>
                                            <Text
                                                style={{ color: 'white', fontSize: 14, fontFamily: 'Oswald-SemiBold' }}
                                                numberOfLines={1}
                                            >
                                                {item.name}
                                            </Text>
                                            <Text
                                                style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontFamily: 'Oswald-Regular', marginTop: 2 }}
                                                numberOfLines={1}
                                            >
                                                {item.domain.replace('https://', '').replace('http://', '')}
                                            </Text>
                                            <View className='flex-row flex-wrap gap-1 mt-2'> 
                                                {(item?.tags ?? []).map(tag => {
                                                    return <Text className='bg-[#5e5e5e] font-oswald-regular text-[#f2f2f2] text-sm  rounded-xl p-1'>{tag}</Text>
                                                })}
                                            </View>

                                            <Text className='font-oswald-regular text-[#f2f2f2] mt-1' style={{fontSize:11}}>
                                                {item.description}
                                            </Text>
                                        </View>

                                        {/* Add / Remove button with per-item spinner */}
                                        <TouchableOpacity
                                            disabled={loading}
                                            style={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: 18,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: added ? '#7ac7ea' : 'transparent',
                                                borderWidth: added ? 0 : 1.5,
                                                borderColor: '#7ac7ea',
                                                opacity: loading ? 0.7 : 1,
                                            }}
                                            onPress={() => added ? handle_remove_source(item) : handle_add_source(item)}
                                        >
                                            {loading ? (
                                                <ActivityIndicator size="small" color={added ? 'white' : '#7ac7ea'} />
                                            ) : added ? (
                                                <Check size={16} color="white" />
                                            ) : (
                                                <Plus size={18} color="#7ac7ea" />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                );
                            }}
                        />
                    )}
                </View>
            )}
            {/* ---- End floating source search dropdown ---- */}

            <View className=" pb-4 bg-[#5e5e5e] relative">

                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                        {entityDetails?.entity?.logo_url ? <View className='w-16 h-16 bg-white rounded-2xl mr-3 items-center justify-center'>
                            <Image source={{ uri: entityDetails?.entity?.logo_url }} className="w-12 h-12 rounded-full" style={{ resizeMode: 'cover' }} />
                        </View> : <View className="w-16 h-16 bg-white rounded-2xl mr-3 items-center justify-center">
                            <Text className="text-3xl">🏀</Text>
                        </View>}
                        <View>
                            <Text className="text-white text-xl font-oswald-semiBold">{entityDetails?.entity?.name}</Text>
                            <Text className="text-white/60 text-sm font-oswald-medium">{entityDetails?.entity?.slug}</Text>
                        </View>
                    </View>
                    {!(entityDetails?.entity?.in_nest || isAddedToNest) && <TouchableOpacity onPress={() => {
                        if (entityDetails?.entity?.id) {
                            add_nest_entity({ entity_id: entityDetails?.entity?.id }, (res) => {
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