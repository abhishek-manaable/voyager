import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  Shield, 
  CheckCircle, 
  XCircle,
  Search,
  Filter
} from 'lucide-react';
import { useUserManagement } from '../../hooks/useUserManagement';
import { UserRole } from '../../types/auth';
import UserRoleModal from '../../components/admin/UserRoleModal';
import UserStatusModal from '../../components/admin/UserStatusModal';

const UserManagement = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const { users, loading, updateUserRole, updateUserStatus } = useUserManagement();

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleUpdate = async (role: UserRole) => {
    if (selectedUser) {
      await updateUserRole(selectedUser, role);
      setIsRoleModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleStatusUpdate = async (isActive: boolean) => {
    if (selectedUser) {
      await updateUserStatus(selectedUser, isActive);
      setIsStatusModalOpen(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Users className="w-6 h-6 text-primary-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('admin.userManagement.title')}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('admin.userManagement.searchPlaceholder')}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | '')}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">{t('admin.userManagement.allRoles')}</option>
              {Object.values(UserRole).map(role => (
                <option key={role} value={role}>
                  {t(`admin.userManagement.roles.${role.toLowerCase()}`)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('admin.userManagement.table.user')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('admin.userManagement.table.role')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('admin.userManagement.table.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('admin.userManagement.table.lastLogin')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('admin.userManagement.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map(user => (
                <tr key={user.uid} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.displayName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedUser(user.uid);
                        setIsRoleModalOpen(true);
                      }}
                      className="flex items-center space-x-2 text-sm text-gray-900 dark:text-white hover:text-primary-500"
                    >
                      <Shield className="w-4 h-4" />
                      <span>{t(`admin.userManagement.roles.${user.role.toLowerCase()}`)}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedUser(user.uid);
                        setIsStatusModalOpen(true);
                      }}
                      className={`flex items-center space-x-2 text-sm ${
                        user.isActive
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {user.isActive ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span>
                        {user.isActive
                          ? t('admin.userManagement.status.active')
                          : t('admin.userManagement.status.inactive')}
                      </span>
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.lastLogin.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedUser(user.uid);
                        setIsRoleModalOpen(true);
                      }}
                      className="text-primary-500 hover:text-primary-600"
                    >
                      {t('admin.userManagement.actions.edit')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UserRoleModal
        isOpen={isRoleModalOpen}
        onClose={() => {
          setIsRoleModalOpen(false);
          setSelectedUser(null);
        }}
        onUpdateRole={handleRoleUpdate}
        currentRole={selectedUser ? users.find(u => u.uid === selectedUser)?.role : undefined}
      />

      <UserStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setSelectedUser(null);
        }}
        onUpdateStatus={handleStatusUpdate}
        currentStatus={selectedUser ? users.find(u => u.uid === selectedUser)?.isActive : undefined}
      />
    </div>
  );
};

export default UserManagement;