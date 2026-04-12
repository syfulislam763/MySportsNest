import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, Linking } from 'react-native';
import { MapPin, Tv, CircleDot, Square, ArrowLeftRight, Shield } from 'lucide-react-native';
import WrapperComponent from '@/components/WrapperComponent';
import BackButton from '@/components/BackButton';
import { MainStackParamList } from '@/navigations/types';
import { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import api from '@/constants/Axios';

type IdType = RouteProp<MainStackParamList, 'EventDetailsScreen'>;
type TabType = 'overview' | 'stats';

interface Team {
    id: number;
    name: string;
    logo_url: string;
    type: string;
    sport: string;
}

interface TimelineEvent {
    id: number;
    event_type: string;
    minute: number;
    extra_minute: number;
    team: Team;
    player: null | { id: number; name: string };
    description: string;
}

interface StatBlock {
    team: Team;
    stats: {
        fouls: number | null;
        offsides: number | null;
        'passes_%': string | null;
        red_cards: number | null;
        total_shots: number | null;
        corner_kicks: number | null;
        total_passes: number | null;
        yellow_cards: number | null;
        blocked_shots: number | null;
        shots_on_goal: number | null;
        expected_goals: number | null;
        shots_off_goal: number | null;
        ball_possession: string | null;
        goals_prevented: number | null;
        passes_accurate: number | null;
        shots_insidebox: number | null;
        goalkeeper_saves: number | null;
        shots_outsidebox: number | null;
    };
}

interface EventDetail {
    id: number;
    sport: string;
    status: string;
    status_detail: string;
    home_entity: Team;
    away_entity: Team;
    league: Team;
    home_score: number | null;
    away_score: number | null;
    start_time: string;
    end_time: string | null;
    venue_name: string;
    venue_city: string;
    venue_country: string;
    broadcaster: string;
    stream_url: string;
    timeline: TimelineEvent[];
    statistics: StatBlock[];
    has_stats: boolean;
}

const TimelineIcon = ({ type }: { type: string }) => {
    if (type === 'goal') return <CircleDot size={24} color="#4ade80" strokeWidth={2.5} />;
    if (type === 'yellow_card') return <Square size={24} color="#facc15" fill="#facc15" strokeWidth={0} />;
    if (type === 'red_card') return <Square size={24} color="#f87171" fill="#f87171" strokeWidth={0} />;
    if (type === 'substitution') return <ArrowLeftRight size={24} color="#7ac7ea" strokeWidth={2.5} />;
    return <Shield size={24} color="white" strokeWidth={2} />;
};

const formatDateTime = (iso: string): string => {
    const date = new Date(iso);
    return date.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};

const StatRow = ({
    label,
    home,
    away,
}: {
    label: string;
    home: string | number | null;
    away: string | number | null;
}) => (
    <View className="flex-row items-center justify-between py-2 border-b border-white/10">
        <Text className="text-white text-sm font-oswald-semiBold w-16 text-left">
            {home ?? '-'}
        </Text>
        <Text className="text-gray-300 text-xs font-oswald-regular flex-1 text-center">
            {label}
        </Text>
        <Text className="text-white text-sm font-oswald-semiBold w-16 text-right">
            {away ?? '-'}
        </Text>
    </View>
);

const EventDetailsScreen = () => {
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [event, setEvent] = useState<EventDetail | null>(null);
    const [loading, setLoading] = useState(true);

    const route = useRoute<IdType>();
    const eventId = route.params?.id;

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get(`/api/calendar/events/${eventId}/`);
                setEvent(response.data?.data ?? null);
            } catch {
                setEvent(null);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [eventId]);

    if (loading) {
        return (
            <WrapperComponent
                title=""
                bg_color="bg-[#5e5e5e]"
                container_bg="bg-[#5e5e5e]"
                headerComponent={() => (
                    <View className="flex-row items-center mb-4 mx-5">
                        <BackButton />
                        <Text className="text-white text-xl font-oswald-semiBold ml-4">Event Details</Text>
                    </View>
                )}
            >
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator color="white" size="large" />
                </View>
            </WrapperComponent>
        );
    }

    if (!event) {
        return (
            <WrapperComponent
                title=""
                bg_color="bg-[#5e5e5e]"
                container_bg="bg-[#5e5e5e]"
                headerComponent={() => (
                    <View className="flex-row items-center mb-4 mx-5">
                        <BackButton />
                        <Text className="text-white text-xl font-oswald-semiBold ml-4">Event Details</Text>
                    </View>
                )}
            >
                <View className="flex-1 items-center justify-center">
                    <Text className="text-white font-oswald-regular">Event not found.</Text>
                </View>
            </WrapperComponent>
        );
    }

    const homeStats = event.statistics.find((s) => s.team.id === event.home_entity.id)?.stats;
    const awayStats = event.statistics.find((s) => s.team.id === event.away_entity.id)?.stats;

    return (
        <WrapperComponent
            title=""
            bg_color="bg-[#5e5e5e]"
            container_bg="bg-[#5e5e5e]"
            headerComponent={() => (
                <View className="flex-row items-center mb-4 mx-5">
                    <BackButton />
                    <Text className="text-white text-xl font-oswald-semiBold ml-4">Event Details</Text>
                </View>
            )}
        >
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                <View className="">
                    <View className="w-full rounded-xl overflow-hidden mb-3 bg-[#4a4a4a] py-5 px-4">
                        <Text className="text-gray-400 text-xs font-oswald-regular text-center mb-3">
                            {event.league.name}
                        </Text>
                        <View className="flex-row items-center justify-between">
                            <View className="items-center flex-1">
                                <Image
                                    source={{ uri: event.home_entity.logo_url }}
                                    style={{ width: 56, height: 56 }}
                                    resizeMode="contain"
                                />
                                <Text className="text-white text-sm font-oswald-semiBold mt-2 text-center">
                                    {event.home_entity.name}
                                </Text>
                            </View>
                            <View className="items-center px-4">
                                {event.home_score !== null && event.away_score !== null ? (
                                    <Text className="text-white text-4xl font-oswald-bold">
                                        {event.home_score} - {event.away_score}
                                    </Text>
                                ) : (
                                    <Text className="text-white text-2xl font-oswald-bold">VS</Text>
                                )}
                                <Text className="text-gray-400 text-xs font-oswald-regular mt-1">
                                    {event.status_detail}
                                </Text>
                            </View>
                            <View className="items-center flex-1">
                                <Image
                                    source={{ uri: event.away_entity.logo_url }}
                                    style={{ width: 56, height: 56 }}
                                    resizeMode="contain"
                                />
                                <Text className="text-white text-sm font-oswald-semiBold mt-2 text-center">
                                    {event.away_entity.name}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <Text className="text-white text-center text-sm font-oswald-regular mb-4">
                        {formatDateTime(event.start_time)} — {event.status_detail}
                    </Text>

                    <View className="flex-row mb-6">
                        <TouchableOpacity onPress={() => setActiveTab('overview')} className="flex-1">
                            <Text
                                className={`text-center text-base font-oswald-semiBold pb-3 ${
                                    activeTab === 'overview' ? 'text-white' : 'text-gray-400'
                                }`}
                            >
                                Overview
                            </Text>
                            {activeTab === 'overview' && <View className="h-0.5 bg-[#7ac7ea]" />}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setActiveTab('stats')} className="flex-1">
                            <Text
                                className={`text-center text-base font-oswald-semiBold pb-3 ${
                                    activeTab === 'stats' ? 'text-white' : 'text-gray-400'
                                }`}
                            >
                                Stats
                            </Text>
                            {activeTab === 'stats' && <View className="h-0.5 bg-[#7ac7ea]" />}
                        </TouchableOpacity>
                    </View>

                    {activeTab === 'overview' ? (
                        <View>
                            {event.timeline.length > 0 && (
                                <>
                                    <Text className="text-white text-lg font-oswald-bold mb-4">
                                        Event Timeline
                                    </Text>
                                    <View className="mb-6">
                                        {event.timeline.map((item, index) => {
                                            const isLast = index === event.timeline.length - 1;
                                            const isHome = item.team.id === event.home_entity.id;
                                            const minuteLabel =
                                                item.extra_minute > 0
                                                    ? `${item.minute}+${item.extra_minute}'`
                                                    : `${item.minute}'`;
                                            return (
                                                <View key={item.id} className="flex-row mb-2">
                                                    <View className="items-center mr-4" style={{ width: 32, height:32 }}>
                                                        <View className="w-full h-ful rounded items-center justify-center">
                                                            <TimelineIcon type={item.event_type} />
                                                        </View>
                                                        {!isLast && (
                                                            <View className="w-0.5 bg-white/30 my-1" style={{ height: 20 }} />
                                                        )}
                                                    </View>
                                                    <View className="flex-1 justify-center">
                                                        <Text className="text-white text-sm font-oswald-semiBold">
                                                            {minuteLabel} — {item.description}
                                                        </Text>
                                                        <Text className="text-gray-300 text-xs font-oswald-regular">
                                                            {isHome ? event.home_entity.name : event.away_entity.name}
                                                        </Text>
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </View>
                                </>
                            )}

                            <Text className="text-white text-lg font-oswald-bold mb-3">Venue</Text>
                            <View className="flex-row items-center mb-6">
                                <MapPin size={20} color="white" />
                                <View className="ml-3">
                                    <Text className="text-white text-base font-oswald-semiBold">
                                        {event.venue_name}
                                    </Text>
                                    <Text className="text-gray-300 text-sm font-oswald-regular">
                                        {event.venue_city}
                                        {event.venue_country ? `, ${event.venue_country}` : ''}
                                    </Text>
                                </View>
                            </View>

                            {event.broadcaster ? (
                                <>
                                    <Text className="text-white text-lg font-oswald-bold mb-3">Broadcaster</Text>
                                    <View className="flex-row items-center mb-6">
                                        <Tv size={20} color="white" />
                                        <Text className="text-white text-base font-oswald-semiBold ml-3">
                                            {event.broadcaster}
                                        </Text>
                                    </View>
                                </>
                            ) : null}
                        </View>
                    ) : (
                        <View>
                            <View className="bg-[#4a4a4a] rounded-xl p-4 mb-6">
                                <View className="flex-row items-center justify-between">
                                    <View className="items-center flex-1">
                                        <Image
                                            source={{ uri: event.home_entity.logo_url }}
                                            style={{ width: 36, height: 36 }}
                                            resizeMode="contain"
                                        />
                                        <Text className="text-white text-xs font-oswald-semiBold mt-1 text-center">
                                            {event.home_entity.name}
                                        </Text>
                                    </View>
                                    <Text className="text-white text-2xl font-oswald-bold px-4">
                                        {event.home_score ?? '-'} - {event.away_score ?? '-'}
                                    </Text>
                                    <View className="items-center flex-1">
                                        <Image
                                            source={{ uri: event.away_entity.logo_url }}
                                            style={{ width: 36, height: 36 }}
                                            resizeMode="contain"
                                        />
                                        <Text className="text-white text-xs font-oswald-semiBold mt-1 text-center">
                                            {event.away_entity.name}
                                        </Text>
                                    </View>
                                </View>
                                <Text className="text-gray-400 text-xs font-oswald-regular text-center mt-2">
                                    {event.status_detail}
                                </Text>
                            </View>

                            {event.has_stats && homeStats && awayStats && (
                                <>
                                    <View className="flex-row items-center justify-between mb-3">
                                        <Text className="text-white text-sm font-oswald-semiBold">
                                            {event.home_entity.name}
                                        </Text>
                                        <Text className="text-white text-lg font-oswald-bold">Match Stats</Text>
                                        <Text className="text-white text-sm font-oswald-semiBold">
                                            {event.away_entity.name}
                                        </Text>
                                    </View>
                                    <View className="bg-[#4a4a4a] rounded-xl px-4 py-2 mb-6">
                                        <StatRow label="Possession" home={homeStats.ball_possession} away={awayStats.ball_possession} />
                                        <StatRow label="Total Shots" home={homeStats.total_shots} away={awayStats.total_shots} />
                                        <StatRow label="Shots on Goal" home={homeStats.shots_on_goal} away={awayStats.shots_on_goal} />
                                        <StatRow label="Shots off Goal" home={homeStats.shots_off_goal} away={awayStats.shots_off_goal} />
                                        <StatRow label="Blocked Shots" home={homeStats.blocked_shots} away={awayStats.blocked_shots} />
                                        <StatRow label="Corner Kicks" home={homeStats.corner_kicks} away={awayStats.corner_kicks} />
                                        <StatRow label="Fouls" home={homeStats.fouls} away={awayStats.fouls} />
                                        <StatRow label="Yellow Cards" home={homeStats.yellow_cards} away={awayStats.yellow_cards} />
                                        <StatRow label="Red Cards" home={homeStats.red_cards} away={awayStats.red_cards} />
                                        <StatRow label="Offsides" home={homeStats.offsides} away={awayStats.offsides} />
                                        <StatRow label="Total Passes" home={homeStats.total_passes} away={awayStats.total_passes} />
                                        <StatRow label="Pass Accuracy" home={homeStats['passes_%']} away={awayStats['passes_%']} />
                                        <StatRow label="GK Saves" home={homeStats.goalkeeper_saves} away={awayStats.goalkeeper_saves} />
                                    </View>
                                </>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>

            <View className="pb-5 pt-3">
                {/* <TouchableOpacity className="bg-[#7ac7ea] rounded-xl py-4 mb-3">
                    <Text className="text-white text-center text-base font-oswald-semiBold">
                        Add to My Nest
                    </Text>
                </TouchableOpacity> */}

                {event.stream_url ? (
                    <TouchableOpacity
                        className="bg-transparent border-2 border-white rounded-xl py-4"
                        onPress={() => Linking.openURL(event.stream_url)}
                    >
                        <Text className="text-white text-center text-base font-oswald-semiBold">
                            Watch Live
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity className="bg-transparent border-2 border-white/30 rounded-xl py-4" disabled>
                        <Text className="text-white/30 text-center text-base font-oswald-semiBold">
                            Stream Unavailable
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </WrapperComponent>
    );
};

export default EventDetailsScreen;