import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CircleDot, // Mercury - 小さな惑星
  Sun, // Sun - 太陽
  Circle, // Venus - 雲に覆われた惑星
  Globe2, // Mars - 赤い惑星
  Orbit, // Jupiter - 軌道を持つ大きな惑星
  CircleDashed, // Saturn - 輪を持つ惑星
  Compass, // Uranus - 傾いた自転軸
  Waves, // Neptune - 青い惑星
  LayoutDashboard
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

const apps = [
  {
    id: 'dashboard',
    icon: LayoutDashboard,
    path: '/',
    color: 'text-primary-500'
  },
  {
    id: 'sun',
    icon: Sun,
    path: '/sun',
    color: 'text-yellow-500'
  },
  {
    id: 'mercury',
    icon: CircleDot,
    path: '/mercury',
    color: 'text-gray-400'
  },
  {
    id: 'venus',
    icon: Circle,
    path: '/venus',
    color: 'text-orange-300'
  },
  {
    id: 'mars',
    icon: Globe2,
    path: '/mars',
    color: 'text-red-500'
  },
  {
    id: 'jupiter',
    icon: Orbit,
    path: '/jupiter',
    color: 'text-orange-500'
  },
  {
    id: 'saturn',
    icon: CircleDashed,
    path: '/saturn',
    color: 'text-amber-400'
  },
  {
    id: 'uranus',
    icon: Compass,
    path: '/uranus',
    color: 'text-cyan-400'
  },
  {
    id: 'neptune',
    icon: Waves,
    path: '/neptune',
    color: 'text-blue-500'
  }
];

const AppSwitcher = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  const getCurrentApp = () => {
    const path = location.pathname.split('/')[1];
    return path === '' ? 'dashboard' : path;
  };

  const handleAppClick = (path: string) => {
    setHoveredApp(null); // Reset hover state on click
    navigate(path);
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 space-y-4 z-50">
      {apps.map((app) => {
        const Icon = app.icon;
        const isActive = getCurrentApp() === app.id;
        
        return (
          <button
            key={app.id}
            onClick={() => handleAppClick(app.path)}
            onMouseEnter={() => setHoveredApp(app.id)}
            onMouseLeave={() => setHoveredApp(null)}
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-all group relative",
              isActive
                ? "bg-gray-100 dark:bg-gray-700"
                : "hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
          >
            <Icon
              className={cn(
                "w-5 h-5 transition-colors",
                isActive ? app.color : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
              )}
            />
            
            {/* Tooltip */}
            {hoveredApp === app.id && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap z-50">
                {t(`apps.${app.id}`)}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default AppSwitcher;