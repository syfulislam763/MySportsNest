import React from 'react';
import { View, Text } from 'react-native';
import { FootballEvent } from './match_types';

const FootballEventRow = ({
    event,
    homeTeam,
    awayTeam,
}: {
    event: FootballEvent;
    homeTeam: string;
    awayTeam: string;
}) => {
    const isGoal = event.type === 'goal';
    const isYellow = event.type === 'yellowcard';
    const isRed = event.type === 'redcard';
    const isSub = event.type === 'subst';
    const icon = isGoal ? '⚽' : isYellow ? '🟨' : isRed ? '🟥' : isSub ? '🔄' : '•';
    const teamName = event.team === 'home' ? homeTeam : awayTeam;
    const minuteLabel = `${event.minute}${event.extra_min ? '+' + event.extra_min : ''}'`;

    return (
        <View className="flex-row items-center bg-[#3a3a3a] rounded-lg px-3 py-2.5 mb-2">
            <View className="w-10 items-center">
                <Text className="text-[#7ac7ea] text-xs font-oswald-semiBold">{minuteLabel}</Text>
            </View>
            <Text className="text-lg w-8 text-center">{icon}</Text>
            <View className="flex-1 ml-2">
                <Text className="text-white text-sm font-oswald-semiBold">
                    {isSub ? event.player_on : event.player}
                </Text>
                {isSub && event.player_off ? (
                    <Text className="text-gray-400 text-xs font-oswald-regular">↔ {event.player_off}</Text>
                ) : null}
                {isGoal && event.assist_player ? (
                    <Text className="text-gray-400 text-xs font-oswald-regular">Assist: {event.assist_player}</Text>
                ) : null}
            </View>
            <Text className="text-gray-400 text-xs font-oswald-regular">{teamName}</Text>
        </View>
    );
};

export default FootballEventRow;