import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LineChart, Box, Zap, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../components/layout/AppLayout';
import ComingSoon from '../../components/common/ComingSoon';

export const UranusApp = () => {
  const { t } = useTranslation();

  const navigation = {
    title: t('apps.uranus'),
    items: [
      {
        icon: LineChart,
        label: 'Overview',
        path: '/uranus'
      },
      {
        icon: Box,
        label: 'Features',
        path: '/uranus/features'
      },
      {
        icon: Zap,
        label: 'Integration',
        path: '/uranus/integration'
      },
      {
        icon: Sparkles,
        label: 'Magic',
        path: '/uranus/magic'
      }
    ]
  };

  return (
    <AppLayout navigation={navigation}>
      <Routes>
        <Route path="/" element={<ComingSoon name="Uranus" />} />
      </Routes>
    </AppLayout>
  );
};