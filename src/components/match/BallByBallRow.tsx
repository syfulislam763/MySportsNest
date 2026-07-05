import React from 'react';
import { View, Text } from 'react-native';
import { BallByBall } from './match_types';

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

export default BallByBallRow;