import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useHackathonStore } from '../../../../store/hackathon';
import { useAuth } from '../../../../contexts/AuthContext';
import { HackathonTeam } from '../../../../types/hackathon';
import ScoreChart from './components/ScoreChart';
import FeedbackCard from './components/FeedbackCard';

const TeamFeedback: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { authUser } = useAuth();
  const {
    teamMembers,
    settings,
    getTeamForUser,
    getVotesForTeam
  } = useHackathonStore();

  const userTeam = authUser ? getTeamForUser(authUser.uid) : null;

  // Validate team ID and access
  if (!teamId || !['A', 'B', 'C', 'D'].includes(teamId)) {
    return <Navigate to="/neptune/hackathon" replace />;
  }

  // アクセス権限の確認
  if (userTeam !== teamId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You can only view feedback for your own team.
          </p>
        </div>
      </div>
    );
  }

  const votes = getVotesForTeam(teamId as HackathonTeam);
  const teamMemberCount = teamMembers.filter(m => m.team === teamId).length;
  const totalScore = votes.reduce(
    (sum, vote) => sum + vote.scores.reduce((s, score) => s + score.score, 0),
    0
  );
  const averageScore = votes.length > 0 ? totalScore / votes.length : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Team {teamId} Feedback
        </h1>
        <a
          href="/neptune/hackathon"
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Dashboard
        </a>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Votes
          </h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {votes.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Average Score
          </h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {averageScore.toFixed(1)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Team Members
          </h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {teamMemberCount}
          </p>
        </div>
      </div>

      {/* Score Distribution */}
      {settings && votes.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Score Distribution
          </h2>
          <ScoreChart
            votes={votes}
            criteria={settings.criteria}
          />
        </div>
      )}

      {/* Feedback List */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Detailed Feedback
        </h2>
        {votes.length > 0 ? (
          votes.map((vote) => (
            <FeedbackCard key={vote.id} vote={vote} />
          ))
        ) : (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No feedback received yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamFeedback;