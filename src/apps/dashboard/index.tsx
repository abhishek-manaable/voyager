import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LayoutDashboard, FileText, Target, Settings as SettingsIcon, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import ContractManagement from './pages/ContractManagement';
import ARRTargets from './pages/manager/ARRTargets';
import SettingsPage from './pages/Settings';
import UserManagement from '../../pages/admin/UserManagement';
import { UserRole } from '../../types/auth';
import PrivateRoute from '../../components/auth/PrivateRoute';
import { useAuth } from '../../contexts/AuthContext';

export const DashboardApp = () => {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();

  const navigation = {
    title: t('apps.dashboard'),
    items: [
      {
        icon: LayoutDashboard,
        label: t('common.dashboard'),
        path: '/'
      },
      {
        icon: FileText,
        label: t('manager.menu.contracts'),
        path: '/manager/contracts'
      },
      {
        icon: Target,
        label: t('manager.menu.targets'),
        path: '/manager/targets'
      },
      {
        icon: Users,
        label: t('admin.userManagement.title'),
        path: '/admin/users',
        requiredRole: UserRole.ADMIN
      },
      {
        icon: SettingsIcon,
        label: t('common.settings'),
        path: '/settings'
      }
    ].filter(item => !item.requiredRole || hasPermission('users', 'manage'))
  };

  return (
    <AppLayout navigation={navigation}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/manager/contracts" element={<ContractManagement />} />
        <Route path="/manager/targets" element={<ARRTargets />} />
        <Route 
          path="/admin/users" 
          element={
            <PrivateRoute requiredRole={UserRole.ADMIN}>
              <UserManagement />
            </PrivateRoute>
          } 
        />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AppLayout>
  );
};