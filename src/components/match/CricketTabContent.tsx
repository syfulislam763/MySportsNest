import React from 'react';
import { View } from 'react-native';
import { MatchData } from './match_types';
import CricketInnings from './CricketInnings';
import BallByBallRow from './BallByBallRow';
import SectionTitle from './SectionTitle';

const CricketTabContent = ({ match, activeTab }: { match: MatchData; activeTab: number }) => {
    const inningsKeys = Object.keys(match.scorecard ?? {});

    if (inningsKeys[activeTab] && match.scorecard) {
        return <CricketInnings entries={match.scorecard[inningsKeys[activeTab]]} />;
    }

    if (activeTab === inningsKeys.length) {
        return (
            <View>
                <SectionTitle title="Recent Deliveries" />
                {(match.ball_by_ball ?? []).map((ball, i) => (
                    <BallByBallRow key={i} ball={ball} />
                ))}
            </View>
        );
    }

    return null;
};

export default CricketTabContent;