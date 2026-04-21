

export interface Entity {
  id: number;
  type: string;
  name: string;
  slug: string;
  sport: string;
  logo_url: string;
  cover_image_url: string;
  description: string;
  country: string;
  follower_count: number;
  has_api_data: boolean;
  in_nest: boolean;
  created_at: string;
}

export interface TeamProfile {
  entity: Entity;
  league: string | null;
  venue_name: string;
  venue_city: string;
  venue_capacity: number | null;
  total_wins: number;
  total_losses: number;
  win_percentage: string;
  website_url: string;
  twitter_handle: string;
  youtube_channel_id: string;
}

export type SearchEntity = {
    id: number;
    type: string;
    name: string;
    slug: string;
    sport: string;
    logo_url: string;
    cover_image_url: string;
    description: string;
    country: string;
    follower_count: number;
    has_api_data: boolean;
    in_nest: boolean;
    created_at: string;
};

export type Tab = 'Feed' | 'Stats' | 'Roster' | 'Fixtures' | 'Standings';

type TabsType = {
    tab: Tab
    hidden: boolean
}

export interface StandingRow {
    rank: number;
    team_id: number;
    team_name: string;
    logo: string;
    points: number;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goals_for: number;
    goals_against: number;
    goal_diff: number;
    form: string;
    is_highlighted: boolean;
}

export interface StandingsData {
    league: Entity;
    season: string;
    standings: StandingRow[];
}

export interface FixtureEntity {
    id: number;
    name: string;
    logo_url: string;
    type: string;
    sport: string;
}

export interface Fixture {
    id: number;
    sport: string;
    status: string;
    status_detail: string;
    home_entity: FixtureEntity;
    away_entity: FixtureEntity;
    league: { id: number; name: string; logo_url: string };
    home_score: number | null;
    away_score: number | null;
    start_time: string;
    venue_name: string;
    venue_city: string;
}

export interface FixturesData {
    entity: Entity;
    fixtures_count: number;
    fixtures: Fixture[];
}

export interface TeamStatsData {
    team: Entity;
    season: string;
    stats: {
        win: number;
        draw: number;
        lose: number;
        form: string;
        rank: number;
        played: number;
        points: number;
        goal_diff: number;
        goals_for: number;
        goals_against: number;
    };
}

export interface AthleteStatsData {
    athlete: Entity;
    season: string;
    stats: {
        age: number | null;
        goals: number | null;
        height: string | null;
        rating: number | null;
        weight: string | null;
        assists: number | null;
        minutes: number | null;
        shots_on: number | null;
        red_cards: number | null;
        passes_key: number | null;
        appearances: number | null;
        nationality: string | null;
        shots_total: number | null;
        passes_total: number | null;
        yellow_cards: number | null;
        pass_accuracy: number | null;
        dribbles_success: number | null;
    };
}

export interface RosterPlayer {
    id: number;
    name: string;
    position: string;
    jersey_number: number | null;
    photo: string;
    height_cm: number | null;
    weight_kg: number | null;
    nationality: string;
}

export interface TeamRosterData {
    team: Entity;
    roster_count: number;
    roster: RosterPlayer[];
}

export interface AthleteRosterData {
    id: number;
    name: string;
    photo: string;
    date_of_birth: string | null;
    age: number | null;
    nationality: string;
    height_cm: number | null;
    weight_kg: number | null;
    current_team: Entity | null;
    position: string;
    jersey_number: number | null;
    twitter: string;
    instagram: string;
    bio: string;
}
