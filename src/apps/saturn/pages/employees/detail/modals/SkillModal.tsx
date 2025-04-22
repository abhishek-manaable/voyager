import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { X, Star } from 'lucide-react';
import { useHRStore } from '../../../../../../store/hr';

interface SkillModalProps {
  employeeId: string;
  skill: {
    skillId: string;
    level: number;
    yearsOfExperience: number;
  } | null;
  onClose: () => void;
}

interface SkillFormData {
  skillId: string;
  level: number;
  yearsOfExperience: number;
}

const SkillModal: React.FC<SkillModalProps> = ({
  employeeId,
  skill,
  onClose
}) => {
  const { t } = useTranslation();
  const { skills, updateEmployee } = useHRStore();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SkillFormData>({
    defaultValues: skill || {
      skillId: '',
      level: 1,
      yearsOfExperience: 0
    }
  });

  const currentLevel = watch('level');

  const handleStarClick = (level: number) => {
    setValue('level', level);
  };

  const onSubmit = async (data: SkillFormData) => {
    try {
      const employee = await updateEmployee(employeeId, {
        skills: skill
          ? // Update existing skill
            employee.skills.map(s =>
              s.skillId === skill.skillId
                ? { ...data }
                : s
            )
          : // Add new skill
            [...employee.skills, data]
      });
      onClose();
    } catch (error) {
      console.error('Error saving skill:', error);
    }
  };

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {skill ? 'Edit Skill' : 'Add Skill'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Skill
            </label>
            <select
              {...register('skillId', { required: true })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              disabled={!!skill}
            >
              <option value="">Select Skill</option>
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <optgroup key={category} label={category}>
                  {skills.map(skill => (
                    <option key={skill.id} value={skill.id}>
                      {skill.nameEn} ({skill.nameJa})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {errors.skillId && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Skill Level
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleStarClick(level)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      level <= currentLevel
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
              <input
                type="hidden"
                {...register('level', { required: true, min: 1, max: 5 })}
              />
            </div>
            {errors.level && (
              <p className="text-red-500 text-sm mt-1">Invalid level</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Years of Experience
            </label>
            <input
              type="number"
              {...register('yearsOfExperience', { required: true, min: 0 })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
            />
            {errors.yearsOfExperience && (
              <p className="text-red-500 text-sm mt-1">Invalid value</p>
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              {skill ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillModal;