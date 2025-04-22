import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, CheckCircle, XCircle } from 'lucide-react';

interface UserStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (isActive: boolean) => Promise<void>;
  currentStatus?: boolean;
}

const UserStatusModal: React.FC<UserStatusModalProps> = ({
  isOpen,
  onClose,
  onUpdateStatus,
  currentStatus
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('admin.userManagement.modal.updateStatus')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onUpdateStatus(true)}
            className={`w-full p-4 rounded-lg border ${
              currentStatus
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {t('admin.userManagement.status.active')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('admin.userManagement.statusDescriptions.active')}
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onUpdateStatus(false)}
            className={`w-full p-4 rounded-lg border ${
              currentStatus === false
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <XCircle className="w-5 h-5 text-red-500" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {t('admin.userManagement.status.inactive')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('admin.userManagement.statusDescriptions.inactive')}
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserStatusModal;