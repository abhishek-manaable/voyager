import { create } from 'zustand';
import {
  collection,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  setDoc,
  updateDoc,
  getDocs,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  HackathonTeam,
  TeamMember,
  Vote,
  VotingSettings,
  VotingStats
} from '../types/hackathon';

interface HackathonStore {
  teamMembers: TeamMember[];
  votes: Vote[];
  settings: VotingSettings | null;
  stats: VotingStats[];
  loading: boolean;
  error: string | null;

  // Initialization
  initialize: () => () => void;

  // Team Member operations
  addTeamMember: (userId: string, team: HackathonTeam) => Promise<void>;
  updateTeamMember: (userId: string, team: HackathonTeam) => Promise<void>;
  removeTeamMember: (userId: string) => Promise<void>;
  getTeamForUser: (userId: string) => HackathonTeam | null;

  // Voting operations
  submitVote: (vote: Omit<Vote, 'id' | 'timestamp'>) => Promise<void>;
  getVotesForTeam: (teamId: HackathonTeam) => Vote[];
  hasUserVotedForTeam: (userId: string, teamId: HackathonTeam) => boolean;

  // Settings operations
  updateSettings: (settings: Partial<VotingSettings>) => Promise<void>;
  isVotingActive: () => boolean;

  // Stats operations
  calculateStats: () => VotingStats[];
}

export const useHackathonStore = create<HackathonStore>((set, get) => ({
  teamMembers: [],
  votes: [],
  settings: null,
  stats: [],
  loading: true,
  error: null,

  initialize: () => {
    const unsubscribes: (() => void)[] = [];
    set({ loading: true, error: null });

    // Team Members listener
    const teamMembersQuery = query(
      collection(db, 'hackathonTeamMembers'),
      orderBy('team')
    );
    unsubscribes.push(
      onSnapshot(
        teamMembersQuery,
        (snapshot) => {
          const teamMembers = snapshot.docs.map(doc => ({
            userId: doc.id,
            team: doc.data().team,
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
          })) as TeamMember[];
          set(state => ({ ...state, teamMembers }));
        },
        (error) => {
          console.error('Error fetching team members:', error);
          set(state => ({ ...state, error: error.message }));
        }
      )
    );

    // Votes listener
    const votesQuery = query(
      collection(db, 'hackathonVotes'),
      orderBy('timestamp', 'desc')
    );
    unsubscribes.push(
      onSnapshot(
        votesQuery,
        (snapshot) => {
          const votes = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp.toDate()
          })) as Vote[];
          set(state => ({ ...state, votes }));
        },
        (error) => {
          console.error('Error fetching votes:', error);
          set(state => ({ ...state, error: error.message }));
        }
      )
    );

    // Settings listener
    const settingsDoc = doc(db, 'hackathonSettings', 'current');
    unsubscribes.push(
      onSnapshot(
        settingsDoc,
        (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            set(state => ({
              ...state,
              settings: {
                ...data,
                startDate: data.startDate.toDate(),
                endDate: data.endDate.toDate(),
                showResults: data.showResults || false,
              } as VotingSettings
            }));
          }
        },
        (error) => {
          console.error('Error fetching settings:', error);
          set(state => ({ ...state, error: error.message }));
        }
      )
    );

    set(state => ({ ...state, loading: false }));
    return () => unsubscribes.forEach(unsubscribe => unsubscribe());
  },

  addTeamMember: async (userId: string, team: HackathonTeam) => {
    try {
      const docRef = doc(db, 'hackathonTeamMembers', userId);
      await setDoc(docRef, {
        team,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding team member:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },

  updateTeamMember: async (userId: string, team: HackathonTeam) => {
    try {
      const docRef = doc(db, 'hackathonTeamMembers', userId);
      await updateDoc(docRef, {
        team,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating team member:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },

  removeTeamMember: async (userId: string) => {
    try {
      const docRef = doc(db, 'hackathonTeamMembers', userId);
      await updateDoc(docRef, {
        team: null,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error removing team member:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },

  getTeamForUser: (userId: string) => {
    const member = get().teamMembers.find(m => m.userId === userId);
    return member?.team || null;
  },

  submitVote: async (vote: Omit<Vote, 'id' | 'timestamp'>) => {
    try {
      await addDoc(collection(db, 'hackathonVotes'), {
        ...vote,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error submitting vote:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },

  getVotesForTeam: (teamId: HackathonTeam) => {
    return get().votes.filter(v => v.teamId === teamId);
  },

  hasUserVotedForTeam: (userId: string, teamId: HackathonTeam) => {
    return get().votes.some(v => v.voterId === userId && v.teamId === teamId);
  },

  updateSettings: async (settings: Partial<VotingSettings>) => {
    try {
      const docRef = doc(db, 'hackathonSettings', 'current');
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        // ドキュメントが存在しない場合は作成
        await setDoc(docRef, {
          startDate: Timestamp.fromDate(settings.startDate || new Date()),
          endDate: Timestamp.fromDate(settings.endDate || new Date()),
          isActive: settings.isActive || false,
          criteria: settings.criteria || [],
        });
      } else {
        // 既存のドキュメントを更新
        await updateDoc(docRef, {
          ...settings,
          startDate: settings.startDate ? Timestamp.fromDate(settings.startDate) : undefined,
          endDate: settings.endDate ? Timestamp.fromDate(settings.endDate) : undefined,
        });
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },

  isVotingActive: () => {
    const settings = get().settings;
    if (!settings) return false;

    const now = new Date();
    const isWithinPeriod = now >= settings.startDate && now <= settings.endDate;
    
    return settings.isActive && isWithinPeriod;
  },

  calculateStats: () => {
    const { votes, settings } = get();
    if (!settings) return [];
    
    const stats: VotingStats[] = ['A', 'B', 'C', 'D'].map(teamId => {
      const teamVotes = votes.filter(v => v.teamId === teamId);
      const totalScore = teamVotes.reduce(
        (sum, vote) => sum + vote.scores.reduce((s, score) => s + score.score, 0),
        0
      );
      const totalAverageScore = teamVotes.length > 0 ? totalScore / teamVotes.length : 0;

      const criteriaAverages = settings.criteria.map(criterion => {
        const scores = teamVotes.map(
          vote => vote.scores.find(s => s.criteriaId === criterion.id)?.score || 0
        );
        const average = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);
        return {
          criteriaId: criterion.id,
          average,
          rank: 0
        };
      });

      return {
        teamId: teamId as HackathonTeam,
        totalVotes: teamVotes.length,
        averageScore: totalAverageScore,
        criteriaAverages,
        totalScore: totalAverageScore,
        rank: 0 // 後で計算
      };
    });

    // 総合順位の計算
    stats.sort((a, b) => b.totalScore - a.totalScore);
    stats.forEach((stat, index) => {
      stat.rank = index + 1;
    });

    // 各基準ごとの順位を計算
    settings.criteria.forEach(criterion => {
      const criteriaStats = stats.map(stat => ({
        stat,
        average: stat.criteriaAverages.find(ca => ca.criteriaId === criterion.id)!.average
      }));
      
      criteriaStats.sort((a, b) => b.average - a.average);
      
      criteriaStats.forEach((item, index) => {
        const criteriaAverage = item.stat.criteriaAverages.find(
          ca => ca.criteriaId === criterion.id
        )!;
        criteriaAverage.rank = index + 1;
      });
    });

    return stats;
  }
}));