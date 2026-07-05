import { FootballEvent, MatchData } from '@/types/match';

export const getSoccerScoreFromEvents = (events?: FootballEvent[]) => {
    if (!events?.length) return null;
    const goals = events.filter((e) => e.type === 'goal' && e.result);
    if (!goals.length) return null;
    const match = goals[goals.length - 1].result!.match(/\[(\d+)\s*-\s*(\d+)\]/);
    return match ? { home: match[1], away: match[2] } : null;
};

export const getMatchScores = (match: MatchData) => {
    if (match.sport === 'cricket') {
        return {
            home: match.status_detail?.split('|')[0]?.trim() ?? '-',
            away: match.status_detail?.split('|')[1]?.trim() ?? '-',
        };
    }
    const soccerScore = getSoccerScoreFromEvents(match.events);
    return {
        home: String(match.home_score ?? soccerScore?.home ?? '-'),
        away: String(match.away_score ?? soccerScore?.away ?? '-'),
    };
};

export const getMatchTabs = (match: MatchData) => {
    if (match.sport === 'cricket') {
        return [...Object.keys(match.scorecard ?? {}), 'Ball by Ball'];
    }
    return ['Events', 'Stats'];
};