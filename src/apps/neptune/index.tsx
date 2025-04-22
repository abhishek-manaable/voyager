import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Brain, 
  Vote, 
  LineChart, 
  Settings,
  Users
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../components/layout/AppLayout';
import HackathonDashboard from './pages/hackathon/Dashboard';
import VotingPage from './pages/hackathon/VotingPage';
import TeamFeedback from './pages/hackathon/TeamFeedback';
import VotingAnalytics from './pages/hackathon/VotingAnalytics';
import VotingSettings from './pages/hackathon/VotingSettings';
import TeamManagement from './pages/hackathon/TeamManagement';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';
import { useHackathonStore } from '../../store/hackathon';

export const NeptuneApp = () => {
  const { t } = useTranslation();
  const { authUser } = useAuth();
  const { initialize } = useHackathonStore();

  useEffect(() => {
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, [initialize]);

  const navigation = {
    title: t('apps.neptune'),
    items: [
      {
        icon: Brain,
        label: 'AI 2024',
        children: [
          {
            icon: LayoutDashboard,
            label: 'Dashboard',
            path: '/neptune/hackathon'
          },
          {
            icon: Vote,
            label: 'Vote',
            path: '/neptune/hackathon/vote',
            requiredRole: undefined
          },
          {
            icon: Users,
            label: 'Teams',
            path: '/neptune/hackathon/teams',
            requiredRole: UserRole.ADMIN
          },
          {
            icon: LineChart,
            label: 'Analytics',
            path: '/neptune/hackathon/analytics',
            requiredRole: UserRole.ADMIN
          },
          {
            icon: Settings,
            label: 'Settings',
            path: '/neptune/hackathon/settings',
            requiredRole: UserRole.ADMIN
          }
        ]
      }
    ]
  };

  return (
    <AppLayout navigation={navigation}>
      <Routes>
        <Route path="/" element={<Navigate to="hackathon" replace />} />
        <Route path="hackathon" element={<HackathonDashboard />} />
        <Route path="hackathon/vote" element={<VotingPage />} />
        <Route path="hackathon/feedback/:teamId" element={<TeamFeedback />} />
        <Route path="hackathon/teams" element={<TeamManagement />} />
        <Route path="hackathon/analytics" element={<VotingAnalytics />} />
        <Route path="hackathon/settings" element={<VotingSettings />} />
      </Routes>
    </AppLayout>
  );
};