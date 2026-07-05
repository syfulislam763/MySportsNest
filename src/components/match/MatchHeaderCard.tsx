import React from 'react';
import { View, Text, Image } from 'react-native';
import { MatchData } from './match_types';
import StatusBadge from './StatusBadge';
import { getMatchScores } from '@/utils/matchScore';

const MatchHeaderCard = ({ match }: { match: MatchData }) => {
    const scores = getMatchScores(match);

    return (
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
                        <Text className="text-white text-2xl font-oswald-semiBold">{scores.home}</Text>
                        <Text className="text-gray-500 text-lg font-oswald-regular">vs</Text>
                        <Text className="text-white text-2xl font-oswald-semiBold">{scores.away}</Text>
                    </View>
                    {match.sport === 'soccer' && match.status_detail ? (
                        <Text className="text-[#7ac7ea] text-xs font-oswald-regular mt-1">{match.status_detail}</Text>
                    ) : null}
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
                {match.stadium ? <Text className="text-gray-400 text-xs font-oswald-regular">📍 {match.stadium}</Text> : null}
                {match.sport === 'cricket' && match.match_type ? (
                    <Text className="text-gray-400 text-xs font-oswald-regular mt-1">🏏 {match.match_type}</Text>
                ) : null}
            </View>
        </View>
    );
};

export default MatchHeaderCard;