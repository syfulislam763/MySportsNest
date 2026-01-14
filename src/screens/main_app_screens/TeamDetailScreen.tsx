
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { ArrowLeft, Search, ChevronRight, ChevronDown } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigations/types';
import { useNavigation } from '@react-navigation/native';
import WrapperComponent from '@/components/WrapperComponent';
import { Post } from '@/utils/main_app_types';
import { posts } from '@/utils/dummy_data';
import { Heart, MoreVertical, Bookmark } from 'lucide-react-native';
import BackButton from '@/components/BackButton';

type NavigationPropsType = NativeStackNavigationProp<MainStackParamList>

const { width } = Dimensions.get('window');

type Tab = 'Feed' | 'Stats' | 'Roster' | 'Fixtures' | 'Standings';

const TeamDetailScreen = () => {
    const [activeTab, setActiveTab] = useState<Tab>('Feed');
    const [searchQuery, setSearchQuery] = useState('');
    const [seasonOpen, setSeasonOpen] = useState(false);
    const [leagueOpen, setLeagueOpen] = useState(false);
    const [regionOpen, setRegionOpen] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState('2023/24');
    const [selectedLeague, setSelectedLeague] = useState('Premier League');
    const [selectedRegion, setSelectedRegion] = useState('Region');

    const barcelona = require("../../../assets/img/barcelona.png")

    const navigation = useNavigation<NavigationPropsType>()

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

    const tabs: Tab[] = ['Feed', 'Stats', 'Roster', 'Fixtures', 'Standings'];

    const renderFeedContent = () => (
            <FlatList
                data={posts}
                renderItem={({ item }: { item: Post }) => (
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
                )}
                keyExtractor={(item) => item.id}
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
            keyExtractor={(item) => item.id}
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
            keyExtractor={(item) => item.id}
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
            keyExtractor={(item) => item.id}
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
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
        />
        
        {seasonOpen && (
            <View className="absolute top-20 left-0 bg-white rounded-xl p-2" style={{ width: 120, elevation: 10 }}>
                {['2023/24', '2022/23', '2021/22'].map((season) => (
                    <TouchableOpacity
                        key={season}
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
                {['Premier League', 'La Liga', 'Serie A'].map((league) => (
                    <TouchableOpacity
                        key={league}
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
                {['Region', 'Europe', 'Asia', 'America'].map((region) => (
                    <TouchableOpacity
                        key={region}
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

                </View>}
            >

        
            <View className=" pb-4 bg-[#5e5e5e]">
            
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                        <View className="w-16 h-16 bg-white rounded-2xl mr-3 items-center justify-center">
                            <Text className="text-3xl">🏀</Text>
                        </View>
                        <View>
                            <Text className="text-white text-2xl font-oswald-semiBold">Lakers</Text>
                            <Text className="text-white/60 text-sm font-oswald-medium">NAB</Text>
                        </View>
                    </View>
                    <TouchableOpacity className="bg-[#7ac7ea] rounded-full px-6 py-3">
                        <Text className="text-white text-sm font-oswald-semiBold">Add to Nest</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View className="flex-row items-center justify-between border-b border-white/20 bg-[#5e5e5e]">
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab}
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