import React from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { UserRole } from '../../types/auth';

interface UserRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateRole: (role: UserRole) => Promise<void>;
  currentRole?: UserRole;
}

const UserRoleModal: React.FC<UserRoleModalProps> = ({
  isOpen,
  onClose,
  onUpdateRole,
  currentRole
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('admin.userManagement.modal.updateRole')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {Object.values(UserRole).map(role => (
            <button
              key={role}
              onClick={() => onUpdateRole(role)}
              className={`w-full p-4 rounded-lg border ${
                currentRole === role
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="text-left">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {t(`admin.userManagement.roles.${role.toLowerCase()}`)}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t(`admin.userManagement.roleDescriptions.${role.toLowerCase()}`)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserRoleModal;