export type HackathonTeam = 'A' | 'B' | 'C' | 'D';

export interface TeamMember {
  userId: string;
  team: HackathonTeam;
  createdAt: Date;
  updatedAt: Date;
}

export interface VotingCriteria {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
}

export interface VotingSettings {
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  showResults: boolean;
  criteria: VotingCriteria[];
}

export interface Vote {
  id: string;
  voterId: string;
  teamId: HackathonTeam;
  timestamp: Date;
  scores: {
    criteriaId: string;
    score: number;
  }[];
  feedback: {
    good: {
      content: string;
    };
    more: {
      content: string;
    };
  };
}

export interface VotingStats {
  teamId: HackathonTeam;
  totalVotes: number;
  averageScore: number;
  criteriaAverages: {
    criteriaId: string;
    average: number;
    rank: number;
  }[];
  totalScore: number;
  rank: number;
}