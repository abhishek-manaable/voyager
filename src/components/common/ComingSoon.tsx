import React from 'react';
import { Rocket } from 'lucide-react';

interface ComingSoonProps {
  name: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ name }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Rocket className="w-16 h-16 text-primary-500 animate-bounce" />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {name} is Coming Soon
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        We're working hard to bring you something amazing. Stay tuned!
      </p>
    </div>
  );
};

export default ComingSoon;