export type CardRarity = 'gold' | 'icon' | 'toty' | 'hero' | 'futties';

export interface PlayerStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface Player {
  id: string;
  name: string;
  shortName: string;
  rating: number;
  position: 'GK' | 'CB' | 'LB' | 'RB' | 'CDM' | 'CM' | 'CAM' | 'LW' | 'RW' | 'ST';
  nation: string;
  nationFlag: string;
  club: string;
  clubBadge: string;
  rarity: CardRarity;
  avatar: string;
  stats: PlayerStats;
  preferredFoot: 'Left' | 'Right';
  skillMoves: number;
  weakFoot: number;
  description: string;
}

export interface Team {
  id: string;
  name: string;
  code: string;
  flag: string;
  rating: number;
  attack: number;
  midfield: number;
  defense: number;
  primaryColor: string;
  secondaryColor: string;
}

export interface PitchPlayer {
  id: string;
  name: string;
  position: string;
  x: number; // Pitch percentage 0-100
  y: number; // Pitch percentage 0-100
  assignedPlayer?: Player;
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'yellow' | 'red' | 'sub' | 'whistle' | 'shot' | 'save';
  description: string;
  team: 'home' | 'away';
  player?: string;
}

export interface TournamentMatch {
  id: string;
  stage: 'Quarter Final' | 'Semi Final' | 'Final';
  homeTeam: Team;
  awayTeam: Team;
  homeScore?: number;
  awayScore?: number;
  homePenaltyScore?: number;
  awayPenaltyScore?: number;
  completed: boolean;
  events: MatchEvent[];
  winner?: Team;
}
