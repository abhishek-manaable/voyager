import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { VotingStats } from '../../../../../types/hackathon';

interface TeamComparisonChartProps {
  stats: VotingStats[];
}

const TeamComparisonChart: React.FC<TeamComparisonChartProps> = ({ stats }) => {
  const data = stats.map(stat => ({
    team: `Team ${stat.teamId}`,
    averageScore: parseFloat(stat.averageScore.toFixed(2)),
    totalVotes: stat.totalVotes
  }));

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="team" stroke="#9CA3AF" />
          <YAxis yAxisId="left" stroke="#9CA3AF" />
          <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFF',
              border: '1px solid #E5E7EB',
              borderRadius: '0.5rem'
            }}
          />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="averageScore"
            fill="#19b184"
            radius={[4, 4, 0, 0]}
            name="Average Score"
          />
          <Bar
            yAxisId="right"
            dataKey="totalVotes"
            fill="#60A5FA"
            radius={[4, 4, 0, 0]}
            name="Total Votes"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TeamComparisonChart;