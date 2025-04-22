import React from 'react';
import { HackathonTeam } from '../../../../../types/hackathon';

interface TeamSelectorProps {
  teams: HackathonTeam[];
  onSelect: (team: HackathonTeam) => void;
}

const TeamSelector: React.FC<TeamSelectorProps> = ({ teams, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {teams.map((team) => (
        <button
          key={team}
          onClick={() => onSelect(team)}
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Team {team}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Click to vote for this team
          </p>
        </button>
      ))}
    </div>
  );
};

export default TeamSelector;