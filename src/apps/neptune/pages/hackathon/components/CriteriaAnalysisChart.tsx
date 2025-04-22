import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { VotingStats, VotingCriteria } from '../../../../../types/hackathon';

interface CriteriaAnalysisChartProps {
  stats: VotingStats[];
  criteria: VotingCriteria[];
}

const CriteriaAnalysisChart: React.FC<CriteriaAnalysisChartProps> = ({
  stats,
  criteria
}) => {
  const data = criteria.map(criterion => {
    const averages = stats.reduce((acc, stat) => {
      const criteriaAvg = stat.criteriaAverages.find(
        ca => ca.criteriaId === criterion.id
      );
      if (criteriaAvg) {
        acc[`Team ${stat.teamId}`] = parseFloat(criteriaAvg.average.toFixed(2));
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      criterion: criterion.name,
      maxScore: criterion.maxPoints,
      ...averages
    };
  });

  return (
    <div className="h-[500px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis
            dataKey="criterion"
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
          {stats.map((stat, index) => (
            <Radar
              key={stat.teamId}
              name={`Team ${stat.teamId}`}
              dataKey={`Team ${stat.teamId}`}
              stroke={`hsl(${index * 90}, 70%, 50%)`}
              fill={`hsl(${index * 90}, 70%, 50%)`}
              fillOpacity={0.3}
            />
          ))}
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CriteriaAnalysisChart;