export interface CricketBatsman {
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

export interface CricketBowler {
    type: 'Bowler';
    player: string;
    O: string;
    R: string;
    W: string;
    ER: string;
    innings: string;
}

export type ScorecardEntry = CricketBatsman | CricketBowler;

export interface BallByBall {
    post: string;
    runs: string;
    overs: string;
    ended: string;
}

export interface FootballEvent {
    id: string;
    team: 'home' | 'away';
    type: 'goal' | 'subst' | 'yellowcard' | 'redcard' | string;
    minute: string;
    extra_min?: string;
    player?: string;
    player_id?: string;
    result?: string;
    assist_id?: string;
    assist_player?: string;
    player_on?: string;
    player_off?: string;
    player_on_id?: string;
    player_off_id?: string;
}

export interface Stat {
    type: string;
    value: number | string | null;
}

export interface TeamStats {
    team: { id: number; name: string; logo: string };
    statistics: Stat[];
}

export interface MatchData {
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
    home_score?: number | null;
    away_score?: number | null;
    halftime_score?: { home: number; away: number };
    scorecard?: Record<string, ScorecardEntry[]>;
    ball_by_ball?: BallByBall[];
    events?: FootballEvent[];
    statistics?: TeamStats[];
    league_logo?: string;
}