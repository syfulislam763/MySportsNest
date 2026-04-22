import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import WrapperComponent from '@/components/WrapperComponent';
import BackButton from '@/components/BackButton';
import api from '@/constants/Axios';
import { toast } from '@/context/useToastStore';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '@/navigations/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
type EntityIdType = RouteProp<MainStackParamList, "LiveScoreDetail">

type NavigationPropsType = NativeStackNavigationProp<MainStackParamList>

interface CricketBatsman {
    type: 'Batsman';
    player: string;
    R: string;
    B: string;
    '4s': string;
    '6s': string;
    SR: string;
    status: string;
    innings: string;
}

interface CricketBowler {
    type: 'Bowler';
    player: string;
    O: string;
    R: string;
    W: string;
    ER: string;
    innings: string;
}

type ScorecardEntry = CricketBatsman | CricketBowler;

interface BallByBall {
    post: string;
    runs: string;
    overs: string;
    ended: string;
}

interface FootballEvent {
    time: { elapsed: number; extra: number | null };
    team: { id: number; name: string; logo: string };
    player: { id: number; name: string };
    assist: { id: number | null; name: string | null };
    type: string;
    detail: string;
}

interface Stat {
    type: string;
    value: number | string | null;
}

interface TeamStats {
    team: { id: number; name: string; logo: string };
    statistics: Stat[];
}

interface MatchData {
    id: number;
    sport: 'cricket' | 'soccer';
    home_team: string;
    away_team: string;
    home_logo: string;
    away_logo: string;
    status: string;
    status_detail: string;
    status_info: string;
    match_type?: string;
    toss?: string;
    stadium: string;
    league: string;
    home_rr?: string | null;
    away_rr?: string | null;
    home_score?: number;
    away_score?: number;
    halftime_score?: { home: number; away: number };
    scorecard?: Record<string, ScorecardEntry[]>;
    ball_by_ball?: BallByBall[];
    events?: FootballEvent[];
    statistics?: TeamStats[];
    league_logo?: string;
}

const StatusBadge = ({ status }: { status: string }) => {
    const isLive = status === 'live';
    return (
        <View className={`px-3 py-0.5 rounded-full ${isLive ? 'bg-red-500' : 'bg-gray-600'}`}>
            <Text className="text-white text-xs font-oswald-semiBold uppercase tracking-widest">
                {isLive ? '● LIVE' : 'FT'}
            </Text>
        </View>
    );
};

const SectionTitle = ({ title }: { title: string }) => (
    <Text className="text-[#7ac7ea] text-sm font-oswald-semiBold uppercase tracking-widest mb-2 mt-4">
        {title}
    </Text>
);

const CricketInnings = ({ entries }: { entries: ScorecardEntry[] }) => {
    const batsmen = entries.filter((e) => e.type === 'Batsman') as CricketBatsman[];
    const bowlers = entries.filter((e) => e.type === 'Bowler') as CricketBowler[];

    return (
        <View className="mb-4">
            <View className="bg-[#3a3a3a] rounded-xl overflow-hidden mb-3">
                <View className="flex-row bg-[#2d2d2d] px-3 py-2">
                    <Text className="text-gray-400 text-xs font-oswald-regular flex-1">Batter</Text>
                    <Text className="text-gray-400 text-xs font-oswald-regular w-10 text-right">R</Text>
                    <Text className="text-gray-400 text-xs font-oswald-regular w-10 text-right">B</Text>
                    <Text className="text-gray-400 text-xs font-oswald-regular w-8 text-right">4s</Text>
                    <Text className="text-gray-400 text-xs font-oswald-regular w-8 text-right">6s</Text>
                    <Text className="text-gray-400 text-xs font-oswald-regular w-14 text-right">SR</Text>
                </View>
                {batsmen.map((b, i) => (
                    <View key={i} className={`px-3 py-2.5 ${i < batsmen.length - 1 ? 'border-b border-[#444]' : ''}`}>
                        <View className="flex-row items-center">
                            <View className="flex-1 pr-2">
                                <Text className="text-white text-sm font-oswald-semiBold">
                                    {b.player}
                                    {b.status === 'not out' ? <Text className="text-[#7ac7ea]"> *</Text> : null}
                                </Text>
                                <Text className="text-gray-400 text-xs font-oswald-regular mt-0.5" numberOfLines={1}>
                                    {b.status}
                                </Text>
                            </View>
                            <Text className="text-white text-sm font-oswald-semiBold w-10 text-right">{b.R}</Text>
                            <Text className="text-gray-400 text-sm font-oswald-regular w-10 text-right">{b.B}</Text>
                            <Text className="text-gray-400 text-sm font-oswald-regular w-8 text-right">{b['4s']}</Text>
                            <Text className="text-gray-400 text-sm font-oswald-regular w-8 text-right">{b['6s']}</Text>
                            <Text className="text-gray-400 text-sm font-oswald-regular w-14 text-right">{b.SR}</Text>
                        </View>
                    </View>
                ))}
            </View>

            <View className="bg-[#3a3a3a] rounded-xl overflow-hidden">
                <View className="flex-row bg-[#2d2d2d] px-3 py-2">
                    <Text className="text-gray-400 text-xs font-oswald-regular flex-1">Bowler</Text>
                    <Text className="text-gray-400 text-xs font-oswald-regular w-10 text-right">O</Text>
                    <Text className="text-gray-400 text-xs font-oswald-regular w-10 text-right">R</Text>
                    <Text className="text-gray-400 text-xs font-oswald-regular w-10 text-right">W</Text>
                    <Text className="text-gray-400 text-xs font-oswald-regular w-12 text-right">ER</Text>
                </View>
                {bowlers.map((b, i) => (
                    <View key={i} className={`flex-row items-center px-3 py-2.5 ${i < bowlers.length - 1 ? 'border-b border-[#444]' : ''}`}>
                        <Text className="text-white text-sm font-oswald-regular flex-1">{b.player}</Text>
                        <Text className="text-gray-400 text-sm font-oswald-regular w-10 text-right">{b.O}</Text>
                        <Text className="text-gray-400 text-sm font-oswald-regular w-10 text-right">{b.R}</Text>
                        <Text className={`text-sm font-oswald-semiBold w-10 text-right ${Number(b.W) > 0 ? 'text-[#7ac7ea]' : 'text-gray-400'}`}>
                            {b.W}
                        </Text>
                        <Text className="text-gray-400 text-sm font-oswald-regular w-12 text-right">{b.ER}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const BallByBallRow = ({ ball }: { ball: BallByBall }) => {
    const runs = Number(ball.runs);
    const bgColor =
        runs === 6 ? 'bg-[#7ac7ea]' :
        runs === 4 ? 'bg-green-600' :
        runs === 0 ? 'bg-[#3a3a3a]' : 'bg-[#4a4a4a]';

    return (
        <View className="flex-row items-center bg-[#3a3a3a] rounded-lg px-3 py-2.5 mb-2">
            <Text className="text-gray-400 text-xs font-oswald-regular w-10">{ball.overs}</Text>
            <Text className="text-white text-sm font-oswald-regular flex-1">{ball.post}</Text>
            <View className={`w-8 h-8 rounded-full items-center justify-center ${bgColor}`}>
                <Text className="text-white text-sm font-oswald-semiBold">{ball.runs}</Text>
            </View>
        </View>
    );
};

const FootballEventRow = ({ event }: { event: FootballEvent }) => {
    const isGoal = event.type === 'Goal' && event.detail !== 'Missed Penalty';
    const isCard = event.type === 'Card';
    const isSub = event.type === 'subst';
    const isVar = event.type === 'Var';
    const icon = isGoal ? '⚽' : isCard ? (event.detail === 'Yellow Card' ? '🟨' : '🟥') : isSub ? '🔄' : isVar ? '📺' : '•';

    return (
        <View className="flex-row items-center bg-[#3a3a3a] rounded-lg px-3 py-2.5 mb-2">
            <View className="w-10 items-center">
                <Text className="text-[#7ac7ea] text-xs font-oswald-semiBold">{event.time.elapsed}'</Text>
            </View>
            <Text className="text-lg w-8 text-center">{icon}</Text>
            <View className="flex-1 ml-2">
                <Text className="text-white text-sm font-oswald-semiBold">{event.player.name}</Text>
                {event.assist?.name ? (
                    <Text className="text-gray-400 text-xs font-oswald-regular">
                        {isSub ? `← ${event.assist.name}` : `Assist: ${event.assist.name}`}
                    </Text>
                ) : null}
                {isVar ? (
                    <Text className="text-red-400 text-xs font-oswald-regular">{event.detail}</Text>
                ) : null}
            </View>
            <Text className="text-gray-400 text-xs font-oswald-regular">{event.team.name}</Text>
        </View>
    );
};

const StatBar = ({ label, home, away }: { label: string; home: string | number | null; away: string | number | null }) => {
    if (home === null && away === null) return null;
    const hVal = parseFloat(String(home ?? 0));
    const aVal = parseFloat(String(away ?? 0));
    const total = hVal + aVal || 1;
    const hPct = (hVal / total) * 100;

    return (
        <View className="mb-3">
            <View className="flex-row justify-between mb-1">
                <Text className="text-white text-sm font-oswald-semiBold">{home ?? 0}</Text>
                <Text className="text-gray-400 text-xs font-oswald-regular">{label}</Text>
                <Text className="text-white text-sm font-oswald-semiBold">{away ?? 0}</Text>
            </View>
            <View className="flex-row h-1.5 rounded-full overflow-hidden bg-[#3a3a3a]">
                <View className="bg-[#7ac7ea] rounded-full" style={{ width: `${hPct}%` }} />
                <View className="bg-[#ef4444] flex-1 rounded-full" />
            </View>
        </View>
    );
};

interface Props {
    matchId: number;
}
// 

const LiveScoreDetail = () => {
    const [match, setMatch] = useState<MatchData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const route = useRoute<EntityIdType>()
    

    const fetchMatch = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await api.get(`/api/scores/live/detail/${route.params.matchId}/`);
            setMatch(res.data.data ?? null);
        } catch (_) {
            toast.error('Failed to load match details.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [route.params.matchId]);

    useEffect(() => {
        fetchMatch();
    }, [fetchMatch]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchMatch(true);
    };

    const inningsKeys = match?.scorecard ? Object.keys(match.scorecard) : [];
    const tabs = match?.sport === 'cricket' ? [...inningsKeys, 'Ball by Ball'] : ['Events', 'Stats'];

    const homeScore =
        match?.sport === 'cricket'
            ? match.status_detail?.split('|')[0]?.trim() ?? '-'
            : String(match?.home_score ?? '-');

    const awayScore =
        match?.sport === 'cricket'
            ? match.status_detail?.split('|')[1]?.trim() ?? '-'
            : String(match?.away_score ?? '-');

    return (
        <WrapperComponent
            title=""
            bg_color="bg-[#5e5e5e]"
            container_bg="bg-[#5e5e5e]"
            headerComponent={() => (
                <View className="flex-row items-center mb-4 mx-5">
                    <BackButton />
                    <Text className="text-white text-xl font-oswald-semiBold ml-4">Match Detail</Text>
                </View>
            )}
        >
            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#7ac7ea" />
                </View>
            ) : !match ? (
                <View className="flex-1 items-center justify-center px-8">
                    <Text className="text-white text-xl font-oswald-semiBold text-center">Match not found</Text>
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    className="flex-1"
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7ac7ea" />}
                >
                    <View className="bg-[#2d2d2d] rounded-2xl mx-1 p-4 mb-4">
                        <View className="flex-row items-center justify-between mb-3">
                            <View className="flex-row items-center flex-1">
                                {match.league_logo ? (
                                    <Image source={{ uri: match.league_logo }} className="w-5 h-5 mr-2" resizeMode="contain" />
                                ) : null}
                                <Text className="text-gray-400 text-xs font-oswald-regular flex-1" numberOfLines={1}>
                                    {match.league}
                                </Text>
                            </View>
                            <StatusBadge status={match.status} />
                        </View>

                        <View className="flex-row items-center justify-between">
                            <View className="flex-1 items-center">
                                <View className="w-14 h-14 rounded-full bg-white items-center justify-center overflow-hidden mb-2">
                                    <Image source={{ uri: match.home_logo }} className="w-12 h-12" resizeMode="contain" />
                                </View>
                                <Text className="text-white text-sm font-oswald-semiBold text-center" numberOfLines={2}>
                                    {match.home_team}
                                </Text>
                                {match.sport === 'cricket' && match.home_rr ? (
                                    <Text className="text-gray-400 text-xs font-oswald-regular mt-0.5">RR: {match.home_rr}</Text>
                                ) : null}
                            </View>

                            <View className="items-center px-3 min-w-[100px]">
                                <View className="flex-row items-baseline gap-x-2">
                                    <Text className="text-white text-2xl font-oswald-semiBold">{homeScore}</Text>
                                    <Text className="text-gray-500 text-lg font-oswald-regular">vs</Text>
                                    <Text className="text-white text-2xl font-oswald-semiBold">{awayScore}</Text>
                                </View>
                                {match.sport === 'soccer' && match.halftime_score ? (
                                    <Text className="text-gray-400 text-xs font-oswald-regular mt-1">
                                        HT {match.halftime_score.home} – {match.halftime_score.away}
                                    </Text>
                                ) : null}
                                {match.sport === 'cricket' && match.status_info ? (
                                    <Text className="text-[#7ac7ea] text-xs font-oswald-regular mt-1 text-center" numberOfLines={2}>
                                        {match.status_info}
                                    </Text>
                                ) : null}
                            </View>

                            <View className="flex-1 items-center">
                                <View className="w-14 h-14 rounded-full bg-white items-center justify-center overflow-hidden mb-2">
                                    <Image source={{ uri: match.away_logo }} className="w-12 h-12" resizeMode="contain" />
                                </View>
                                <Text className="text-white text-sm font-oswald-semiBold text-center" numberOfLines={2}>
                                    {match.away_team}
                                </Text>
                                {match.sport === 'cricket' && match.away_rr ? (
                                    <Text className="text-gray-400 text-xs font-oswald-regular mt-0.5">RR: {match.away_rr}</Text>
                                ) : null}
                            </View>
                        </View>

                        <View className="mt-3 pt-3 border-t border-[#444]">
                            {match.sport === 'cricket' && match.toss ? (
                                <Text className="text-gray-400 text-xs font-oswald-regular mb-1">🪙 {match.toss}</Text>
                            ) : null}
                            <Text className="text-gray-400 text-xs font-oswald-regular">📍 {match.stadium}</Text>
                            {match.sport === 'cricket' && match.match_type ? (
                                <Text className="text-gray-400 text-xs font-oswald-regular mt-1">🏏 {match.match_type}</Text>
                            ) : null}
                        </View>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="mb-3"
                        contentContainerStyle={{ paddingHorizontal: 4 }}
                    >
                        {tabs.map((tab, i) => (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setActiveTab(i)}
                                className={`mr-2 px-4 py-2 rounded-full ${activeTab === i ? 'bg-[#7ac7ea]' : 'bg-[#3a3a3a]'}`}
                            >
                                <Text className={`text-sm font-oswald-semiBold ${activeTab === i ? 'text-[#2d2d2d]' : 'text-white'}`} numberOfLines={1}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View className="px-1 pb-8">
                        {match.sport === 'cricket' && (
                            <>
                                {inningsKeys[activeTab] && match.scorecard && (
                                    <CricketInnings entries={match.scorecard[inningsKeys[activeTab]]} />
                                )}
                                {activeTab === inningsKeys.length && (
                                    <View>
                                        <SectionTitle title="Recent Deliveries" />
                                        {(match.ball_by_ball ?? []).map((ball, i) => (
                                            <BallByBallRow key={i} ball={ball} />
                                        ))}
                                    </View>
                                )}
                            </>
                        )}

                        {match.sport === 'soccer' && (
                            <>
                                {activeTab === 0 && (
                                    <View>
                                        <SectionTitle title="Match Events" />
                                        {(match.events ?? [])
                                            .filter((e) => e.type !== 'subst')
                                            .map((event, i) => (
                                                <FootballEventRow key={i} event={event} />
                                            ))}
                                    </View>
                                )}
                                {activeTab === 1 && match.statistics && (
                                    <View>
                                        <View className="flex-row justify-between mb-4">
                                            <View className="flex-row items-center">
                                                <View className="w-3 h-3 rounded-full bg-[#7ac7ea] mr-2" />
                                                <Text className="text-white text-sm font-oswald-semiBold">
                                                    {match.statistics[0]?.team.name}
                                                </Text>
                                            </View>
                                            <View className="flex-row items-center">
                                                <Text className="text-white text-sm font-oswald-semiBold">
                                                    {match.statistics[1]?.team.name}
                                                </Text>
                                                <View className="w-3 h-3 rounded-full bg-[#ef4444] ml-2" />
                                            </View>
                                        </View>
                                        <View className="bg-[#3a3a3a] rounded-xl p-4">
                                            {(match.statistics[0]?.statistics ?? []).map((stat, i) => {
                                                const awayStat = match.statistics![1]?.statistics[i];
                                                return (
                                                    <StatBar
                                                        key={stat.type}
                                                        label={stat.type}
                                                        home={stat.value}
                                                        away={awayStat?.value ?? null}
                                                    />
                                                );
                                            })}
                                        </View>
                                    </View>
                                )}
                            </>
                        )}
                    </View>
                </ScrollView>
            )}
        </WrapperComponent>
    );
};

export default LiveScoreDetail;