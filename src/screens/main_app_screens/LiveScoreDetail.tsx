import React, { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import WrapperComponent from '@/components/WrapperComponent';
import BackButton from '@/components/BackButton';
import MatchHeaderCard from '@/components/match/MatchHeaderCard';
import MatchTabs from '@/components/match/MatchTabs';
import CricketTabContent from '@/components/match/CricketTabContent';
import SoccerTabContent from '@/components/match/SoccerTabContent';
import { useMatchDetail } from '@/hooks/useMatchDetail';
import { getMatchTabs } from '@/utils/matchScore';

const LiveScoreDetail = () => {
    const { match, loading, refreshing, onRefresh } = useMatchDetail();
    const [activeTab, setActiveTab] = useState(0);

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
                    <MatchHeaderCard match={match} />
                    <MatchTabs tabs={getMatchTabs(match)} activeTab={activeTab} onSelect={setActiveTab} />
                    <View className="px-1 pb-8">
                        {match.sport === 'cricket' ? (
                            <CricketTabContent match={match} activeTab={activeTab} />
                        ) : (
                            <SoccerTabContent match={match} activeTab={activeTab} />
                        )}
                    </View>
                </ScrollView>
            )}
        </WrapperComponent>
    );
};

export default LiveScoreDetail;