import React from 'react';
import { Trophy, Award, Star } from 'lucide-react';
import { VotingStats, VotingCriteria } from '../../../../../types/hackathon';

interface ResultsDisplayProps {
  stats: VotingStats[];
  criteria: VotingCriteria[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ stats, criteria }) => {
  // ランキング表示用のメダルアイコン
  const rankIcons = [
    <Trophy key="1" className="w-8 h-8 text-yellow-500" />,
    <Award key="2" className="w-8 h-8 text-gray-400" />,
    <Award key="3" className="w-8 h-8 text-amber-600" />,
    <Star key="4" className="w-8 h-8 text-gray-400" />
  ];

  return (
    <div className="space-y-8">
      {/* 総合順位 */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Overall Ranking
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {stats
            .sort((a, b) => b.totalScore - a.totalScore)
            .map((stat, index) => (
              <div
                key={stat.teamId}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {rankIcons[index]}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        Team {stat.teamId}
                      </h4>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {stat.totalScore.toFixed(1)} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">points</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    #{stat.rank}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 各基準ごとの順位 */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Criteria Rankings
        </h3>
        <div className="space-y-6">
          {criteria.map(criterion => {
            const criteriaStats = stats
              .map(stat => ({
                teamId: stat.teamId,
                score: stat.criteriaAverages.find(ca => ca.criteriaId === criterion.id)?.average || 0,
                rank: stat.criteriaAverages.find(ca => ca.criteriaId === criterion.id)?.rank || 0
              }))
              .sort((a, b) => b.score - a.score);

            return (
              <div key={criterion.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {criterion.name}
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {criteriaStats.map((stat, index) => (
                    <div
                      key={stat.teamId}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {rankIcons[index]}
                        <span className="text-gray-900 dark:text-white">
                          Team {stat.teamId}
                        </span>
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {stat.score.toFixed(1)} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">points</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ResultsDisplay;