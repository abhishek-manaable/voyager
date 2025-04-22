import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart as BarChartIcon, 
  Users, 
  Award,
  AlertCircle
} from 'lucide-react';
import { useHackathonStore } from '../../../../store/hackathon';
import { useAuth } from '../../../../contexts/AuthContext';
import { UserRole } from '../../../../types/auth';
import TeamComparisonChart from './components/TeamComparisonChart';
import VotingProgressChart from './components/VotingProgressChart';
import CriteriaAnalysisChart from './components/CriteriaAnalysisChart';

const VotingAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const { 
    settings,
    votes,
    teamMembers,
    calculateStats
  } = useHackathonStore();

  // 管理者権限チェック
  if (authUser?.role !== UserRole.ADMIN) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Only administrators can access the analytics page.
          </p>
        </div>
      </div>
    );
  }

  const stats = calculateStats();
  const uniqueVoters = new Set(votes.map(v => v.voterId)).size;
  const totalVoters = teamMembers.length;
  const votingProgress = totalVoters > 0 ? (uniqueVoters / totalVoters) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Voting Analytics
        </h1>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Votes Cast
              </p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                {votes.length}
              </p>
            </div>
            <BarChartIcon className="w-8 h-8 text-primary-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Voter Participation
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
                Leading Team
              </p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                {stats.length > 0 
                  ? `Team ${stats.reduce((a, b) => a.averageScore > b.averageScore ? a : b).teamId}`
                  : '-'
                }
              </p>
            </div>
            <Award className="w-8 h-8 text-primary-500" />
          </div>
        </div>
      </div>

      {/* Team Comparison */}
      {settings && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Team Comparison
          </h2>
          <TeamComparisonChart stats={stats} />
        </div>
      )}

      {/* Voting Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Voting Progress
        </h2>
        <VotingProgressChart votes={votes} />
      </div>

      {/* Criteria Analysis */}
      {settings && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Criteria Analysis
          </h2>
          <CriteriaAnalysisChart
            stats={stats}
            criteria={settings.criteria}
          />
        </div>
      )}
    </div>
  );
};

export default VotingAnalytics;