import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit2, ChevronRight, ChevronDown } from 'lucide-react';
import { useHRStore } from '../../../../store/hr';
import { Department } from '../../../../types/hr';
import DepartmentModal from './DepartmentModal';

interface DepartmentNodeProps {
  department: Department;
  departments: Department[];
  level: number;
  onEdit: (department: Department) => void;
}

const DepartmentNode: React.FC<DepartmentNodeProps> = ({
  department,
  departments,
  level,
  onEdit
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const childDepartments = departments.filter(d => d.parentId === department.id);
  const hasChildren = childDepartments.length > 0;

  return (
    <div className="space-y-2">
      <div
        className={`flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700`}
        style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 ${
            !hasChildren && 'invisible'
          }`}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        <div className="flex-1 ml-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {department.nameEn}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {department.nameJa}
              </p>
            </div>
            <button
              onClick={() => onEdit(department)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
            >
              <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Code: {department.code}
          </div>
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div className="space-y-2">
          {childDepartments.map(child => (
            <DepartmentNode
              key={child.id}
              department={child}
              departments={departments}
              level={level + 1}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DepartmentList: React.FC = () => {
  const { t } = useTranslation();
  const { departments } = useHRStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const rootDepartments = departments.filter(d => !d.parentId);

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedDepartment(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDepartment(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Departments
        </h2>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Department
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 space-y-2">
          {rootDepartments.map(department => (
            <DepartmentNode
              key={department.id}
              department={department}
              departments={departments}
              level={0}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </div>

      {isModalOpen && (
        <DepartmentModal
          department={selectedDepartment}
          departments={departments}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default DepartmentList;