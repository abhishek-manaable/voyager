import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useHackathonStore } from '../../../../store/hackathon';
import { useAuth } from '../../../../contexts/AuthContext';
import { HackathonTeam } from '../../../../types/hackathon';
import TeamSelector from './components/TeamSelector';
import VotingForm from './components/VotingForm';

const VotingPage: React.FC = () => {
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const {
    settings,
    teamMembers,
    isVotingActive,
    getTeamForUser,
    hasUserVotedForTeam,
    submitVote
  } = useHackathonStore();

  const [selectedTeam, setSelectedTeam] = useState<HackathonTeam | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userTeam = authUser ? getTeamForUser(authUser.uid) : null;
  const votingActive = isVotingActive();

  useEffect(() => {
    if (!votingActive) {
      navigate('/neptune/hackathon', { replace: true });
    }
  }, [votingActive, navigate]);

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  // 投票可能なチームを取得
  const availableTeams: HackathonTeam[] = ['A', 'B', 'C', 'D'].filter(team => {
    // 自分のチームには投票できない
    if (team === userTeam) return false;
    // 既に投票済みのチームは除外
    if (authUser && hasUserVotedForTeam(authUser.uid, team as HackathonTeam)) return false;
    return true;
  });

  if (!votingActive) {
    return <Navigate to="/neptune/hackathon" replace />;
  }

  const handleVoteSubmit = async (data: any) => {
    if (!authUser || !selectedTeam) return;

    try {
      await submitVote({
        voterId: authUser.uid,
        teamId: selectedTeam,
        scores: data.scores,
        feedback: data.feedback
      });
      navigate('/neptune/hackathon');
    } catch (error) {
      setError('Failed to submit vote. Please try again.');
    }
  };

  if (availableTeams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Teams Available
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You have already voted for all available teams or you are not eligible to vote at this time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Cast Your Vote
      </h1>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}

      {selectedTeam ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <VotingForm
            teamId={selectedTeam}
            criteria={settings.criteria}
            onSubmit={handleVoteSubmit}
            onCancel={() => setSelectedTeam(null)}
          />
        </div>
      ) : (
        <>
          <p className="text-gray-600 dark:text-gray-400">
            Select a team to start voting. Remember, you can only vote once for each team.
          </p>
          <TeamSelector
            teams={availableTeams}
            onSelect={setSelectedTeam}
          />
        </>
      )}
    </div>
  );
};

export default VotingPage;