import React from 'react';
import { View, Text } from 'react-native';
import { MatchData } from './match_types';
import FootballEventRow from './FootballEventRow';
import StatBar from './StatBar';
import SectionTitle from './SectionTitle';

const EmptyState = ({ message }: { message: string }) => (
    <Text className="text-gray-400 text-sm font-oswald-regular text-center mt-4">{message}</Text>
);

const SoccerTabContent = ({ match, activeTab }: { match: MatchData; activeTab: number }) => {
    if (activeTab === 0) {
        const events = match.events ?? [];
        return (
            <View>
                <SectionTitle title="Match Events" />
                {events.length === 0 ? (
                    <EmptyState message="No events yet." />
                ) : (
                    [...events]
                        .sort((a, b) => Number(a.minute) - Number(b.minute))
                        .map((event, i) => (
                            <FootballEventRow key={event.id ?? i} event={event} homeTeam={match.home_team} awayTeam={match.away_team} />
                        ))
                )}
            </View>
        );
    }

    if (!match.statistics?.length) return <EmptyState message="Stats not available for this match." />;

    return (
        <View>
            <View className="flex-row justify-between mb-4">
                <View className="flex-row items-center">
                    <View className="w-3 h-3 rounded-full bg-[#7ac7ea] mr-2" />
                    <Text className="text-white text-sm font-oswald-semiBold">{match.statistics[0]?.team.name}</Text>
                </View>
                <View className="flex-row items-center">
                    <Text className="text-white text-sm font-oswald-semiBold">{match.statistics[1]?.team.name}</Text>
                    <View className="w-3 h-3 rounded-full bg-[#ef4444] ml-2" />
                </View>
            </View>
            <View className="bg-[#3a3a3a] rounded-xl p-4">
                {(match.statistics[0]?.statistics ?? []).map((stat, i) => (
                    <StatBar
                        key={stat.type}
                        label={stat.type}
                        home={stat.value}
                        away={match.statistics![1]?.statistics[i]?.value ?? null}
                    />
                ))}
            </View>
        </View>
    );
};

export default SoccerTabContent;