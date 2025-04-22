import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Vote } from '../../../../../types/hackathon';

interface VotingProgressChartProps {
  votes: Vote[];
}

const VotingProgressChart: React.FC<VotingProgressChartProps> = ({ votes }) => {
  // 投票を日付でグループ化
  const votesPerDay = votes.reduce((acc, vote) => {
    const date = vote.timestamp.toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 累積データを作成
  let cumulative = 0;
  const data = Object.entries(votesPerDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => {
      cumulative += count;
      return {
        date,
        total: cumulative
      };
    });

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            stroke="#9CA3AF"
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFF',
              border: '1px solid #E5E7EB',
              borderRadius: '0.5rem'
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#19b184"
            strokeWidth={2}
            dot={true}
            name="Total Votes"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VotingProgressChart;