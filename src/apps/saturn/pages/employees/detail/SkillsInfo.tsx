import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Star, Edit2 } from 'lucide-react';
import { useHRStore } from '../../../../../store/hr';
import { EmployeeProfile, Skill } from '../../../../../types/hr';
import SkillModal from './modals/SkillModal';

interface SkillsInfoProps {
  employee: EmployeeProfile;
}

const SkillsInfo: React.FC<SkillsInfoProps> = ({ employee }) => {
  const { t } = useTranslation();
  const { skills } = useHRStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<{
    skillId: string;
    level: number;
    yearsOfExperience: number;
  } | null>(null);

  const handleAddSkill = () => {
    setSelectedSkill(null);
    setIsModalOpen(true);
  };

  const handleEditSkill = (skillId: string) => {
    const employeeSkill = employee.skills.find(s => s.id === skillId);
    if (employeeSkill) {
      setSelectedSkill(employeeSkill);
      setIsModalOpen(true);
    }
  };

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Skills
        </h3>
        <button
          onClick={handleAddSkill}
          className="flex items-center px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Skill
        </button>
      </div>

      {Object.entries(skillsByCategory).map(([category, categorySkills]) => {
        const employeeSkillsInCategory = categorySkills.filter(skill =>
          employee.skills.some(es => es.id === skill.id)
        );

        if (employeeSkillsInCategory.length === 0) return null;

        return (
          <div key={category} className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {category}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employeeSkillsInCategory.map(skill => {
                const employeeSkill = employee.skills.find(es => es.id === skill.id);
                if (!employeeSkill) return null;

                return (
                  <div
                    key={skill.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {skill.nameEn}
                        </h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {skill.nameJa}
                        </p>
                      </div>
                      <button
                        onClick={() => handleEditSkill(skill.id)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                      >
                        <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center space-x-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className={`w-4 h-4 ${
                              index < employeeSkill.level
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {employeeSkill.yearsOfExperience} years
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {isModalOpen && (
        <SkillModal
          employeeId={employee.id}
          skill={selectedSkill}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSkill(null);
          }}
        />
      )}
    </div>
  );
};

export default SkillsInfo;