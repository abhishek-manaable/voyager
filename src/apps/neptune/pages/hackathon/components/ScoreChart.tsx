import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Vote, VotingCriteria } from '../../../../../types/hackathon';

interface ScoreChartProps {
  votes: Vote[];
  criteria: VotingCriteria[];
}

const ScoreChart: React.FC<ScoreChartProps> = ({ votes, criteria }) => {
  const data = criteria.map(criterion => {
    const scores = votes.map(
      vote => vote.scores.find(s => s.criteriaId === criterion.id)?.score || 0
    );
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;

    return {
      name: criterion.name,
      average: parseFloat(average.toFixed(2)),
      maxScore: criterion.maxPoints
    };
  });

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
            stroke="#9CA3AF"
          />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFF',
              border: '1px solid #E5E7EB',
              borderRadius: '0.5rem'
            }}
          />
          <Bar
            dataKey="average"
            fill="#19b184"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreChart;