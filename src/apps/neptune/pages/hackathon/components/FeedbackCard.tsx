import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Vote } from '../../../../../types/hackathon';

interface FeedbackCardProps {
  vote: Vote;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ vote }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <MessageSquare className="w-5 h-5 text-primary-500 mr-2" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {vote.timestamp.toLocaleDateString()}
          </span>
        </div>
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          Total Score: {vote.scores.reduce((sum, s) => sum + s.score, 0)}
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Good
          </h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-line">
            {vote.feedback.good.content}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            More
          </h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-line">
            {vote.feedback.more.content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;