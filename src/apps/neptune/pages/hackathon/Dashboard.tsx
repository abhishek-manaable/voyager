import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Vote, 
  Users, 
  Clock,
  Award,
  ArrowRight
} from 'lucide-react';
import ResultsDisplay from './components/ResultsDisplay';
import { useHackathonStore } from '../../../../store/hackathon';
import { useAuth } from '../../../../contexts/AuthContext';
import { useAuthStore } from '../../../../store/auth';

const HackathonDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const { users } = useAuthStore();
  const { 
    teamMembers, 
    votes, 
    settings, 
    calculateStats,
    getTeamForUser,
    isVotingActive 
  } = useHackathonStore();
  const stats = calculateStats();

  const userTeam = authUser ? getTeamForUser(authUser.uid) : null;
  const votingActive = isVotingActive();

  // 投票結果を表示するかどうか
  const showResults = settings?.showResults === true;

  // 投票の進捗状況を計算
  const totalVoters = teamMembers.length;
  const uniqueVoters = new Set(votes.map(v => v.voterId)).size;
  const votingProgress = totalVoters > 0 ? (uniqueVoters / totalVoters) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Hackathon AI 2024
        </h1>
        {votingActive && (
          <button
            onClick={() => navigate('/neptune/hackathon/vote')}
            className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            <Vote className="w-5 h-5 mr-2" />
            Cast Your Vote
          </button>
        )}
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Voting Status
              </p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                {votingActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <Clock className="w-8 h-8 text-primary-500" />
          </div>
          {settings && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {new Date(settings.startDate).toLocaleDateString()} - 
              {new Date(settings.endDate).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Participation
              </p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                {uniqueVoters}/{totalVoters}
              </p>
            </div>
            <Users className="w-8 h-8 text-primary-500" />
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="bg-primary-500 h-2.5 rounded-full" 
              style={{ width: `${votingProgress}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Your Team
              </p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                {userTeam ? `Team ${userTeam}` : 'General Voter'}
              </p>
            </div>
            <Award className="w-8 h-8 text-primary-500" />
          </div>
        </div>
      </div>

      {/* 投票結果 */}
      {/* Team Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Team Overview
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {['A', 'B', 'C', 'D'].map((team) => {
              const teamStat = stats.find(s => s.teamId === team);
              const teamMemberCount = teamMembers.filter(m => m.team === team).length;

              return (
                <div 
                  key={team}
                  className="p-6 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Team {team}
                      </h3>
                      <div className="space-y-4">
                        {teamMembers
                          .filter(m => m.team === team)
                          .map(member => {
                            const user = users.find(u => u.uid === member.userId);
                            return user ? (
                              <div key={user.uid} className="flex items-center space-x-3">
                                <img
                                  src={user.photoURL}
                                  alt={user.displayName}
                                  className="w-10 h-10 rounded-full"
                                />
                                <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                  {user.displayName}
                                </span>
                              </div>
                            ) : null;
                          })}
                      </div>
                    </div>
                  </div>
                  {teamStat && (
                    <div className="mt-6 space-y-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Votes received: {teamStat.totalVotes}
                      </p>
                      {userTeam === team && (
                        <button
                          onClick={() => navigate(`/neptune/hackathon/feedback/${team}`)}
                          className="w-full flex items-center justify-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                        >
                          <ArrowRight className="w-4 h-4 mr-2" />
                          View Team Feedback
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackathonDashboard;