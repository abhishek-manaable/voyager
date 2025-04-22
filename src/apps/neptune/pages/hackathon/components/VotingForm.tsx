import React from 'react';
import { useForm } from 'react-hook-form';
import { Star, ChevronRight, ChevronLeft } from 'lucide-react';
import { VotingCriteria, HackathonTeam } from '../../../../../types/hackathon';

interface VotingFormProps {
  teamId: HackathonTeam;
  criteria: VotingCriteria[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const VotingForm: React.FC<VotingFormProps> = ({
  teamId,
  criteria,
  onSubmit,
  onCancel
}) => {
  const [step, setStep] = React.useState<number>(1);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      scores: criteria.map(c => ({ criteriaId: c.id, score: 0 })),
      feedback: {
        good: {
          title: 'Good',
          content: ''
        },
        more: {
          title: 'More',
          content: ''
        }
      }
    }
  });

  const totalSteps = 2;
  const scores = watch('scores');

  const handleNext = () => {
    if (step === 1) {
      // Check if all criteria have been scored
      const allScored = scores.every(score => score.score > 0);
      if (!allScored) {
        return;
      }
    }
    setStep(step + 1);
  };

  const renderScoreInput = (criterion: VotingCriteria) => {
    const score = scores.find(s => s.criteriaId === criterion.id)?.score || 0;

    return (
      <div key={criterion.id} className="space-y-4 mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {criterion.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {criterion.description}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {[...Array(criterion.maxPoints + 1)].map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                const newScores = scores.map(s =>
                  s.criteriaId === criterion.id ? { ...s, score: i } : s
                );
                setValue('scores', newScores);
              }}
              className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
                score === i ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
              }`}
            >
              <Star className="w-6 h-6" fill={score >= i ? 'currentColor' : 'none'} />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            ({score}/{criterion.maxPoints})
          </span>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">
              Score Team {teamId}
            </h2>
            {criteria.map(renderScoreInput)}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              Feedback for Team {teamId}
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Good
              </label>
              <textarea
                {...register('feedback.good.content', { required: true })}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="Share positive aspects of their work..."
              />
              {errors.feedback?.good?.content && (
                <p className="mt-1 text-sm text-red-500">This field is required</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                More
              </label>
              <textarea
                {...register('feedback.more.content', { required: true })}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="Share areas for improvement..."
              />
              {errors.feedback?.more?.content && (
                <p className="mt-1 text-sm text-red-500">This field is required</p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {renderStep()}

      <div className="flex justify-between pt-6 border-t dark:border-gray-700">
        <button
          type="button"
          onClick={() => step === 1 ? onCancel() : setStep(step - 1)}
          className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          {step === 1 ? 'Cancel' : 'Back'}
        </button>
        <button
          type="button"
          onClick={() => step === totalSteps ? handleSubmit(onSubmit)() : handleNext()}
          className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          {step === totalSteps ? 'Submit Vote' : 'Next'}
          {step !== totalSteps && <ChevronRight className="w-5 h-5 ml-1" />}
        </button>
      </div>
    </form>
  );
};

export default VotingForm;