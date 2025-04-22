import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  CircleDot,
  Sun,
  Circle,
  Globe2,
  Orbit,
  CircleDashed,
  Compass,
  Waves,
  LayoutDashboard,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

const appIcons = {
  dashboard: LayoutDashboard,
  sun: Sun,
  mercury: CircleDot,
  venus: Circle,
  mars: Globe2,
  jupiter: Orbit,
  saturn: CircleDashed,
  uranus: Compass,
  neptune: Waves
};

interface NavigationItem {
  icon?: React.ComponentType;
  label: string;
  path?: string;
  children?: NavigationItem[];
  requiredRole?: string;
}

interface NavigationProps {
  title: string;
  items: NavigationItem[];
}

const NavigationItemComponent: React.FC<{
  item: NavigationItem;
  level?: number;
  basePath: string;
}> = ({ item, level = 0, basePath }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;

  // Check if current item or any of its children are active
  const isActive = (item: NavigationItem): boolean => {
    if (item.path) {
      // 完全一致または子パスの場合のみアクティブ
      return location.pathname === item.path || 
             (item.path !== basePath && location.pathname.startsWith(item.path + '/'));
    }
    if (item.children) {
      return item.children.some(child => isActive(child));
    }
    return false;
  };

  // Expand parent if child is active
  React.useEffect(() => {
    if (hasChildren && item.children?.some(child => isActive(child))) {
      setIsExpanded(true);
    }
  }, [location.pathname]);

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "w-full flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg",
            level > 0 && "ml-4"
          )}
        >
          {Icon && <Icon className="w-5 h-5 mr-3" />}
          {item.label}
          <div className="ml-auto">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
        </button>
        {isExpanded && (
          <div className="mt-1">
            {item.children.map((child, index) => (
              <NavigationItemComponent
                key={index}
                item={child}
                level={level + 1}
                basePath={basePath}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path || ''}
      className={({ isActive: linkActive }) =>
        cn(
          "flex items-center px-4 py-2 text-sm rounded-lg",
          linkActive
            ? "bg-primary-50 text-primary-500 dark:bg-primary-900"
            : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700",
          level > 0 && "ml-4"
        )
      }
    >
      {Icon && <Icon className="w-5 h-5 mr-3" />}
      {item.label}
    </NavLink>
  );
};

const Navigation: React.FC<NavigationProps> = ({ title, items }) => {
  const { hasPermission } = useAuth();
  const location = useLocation();
  
  // Get app name from title (assuming title is from i18n 'apps.{appName}')
  const appName = title.toLowerCase();
  const AppIcon = appIcons[appName as keyof typeof appIcons];
  
  // Get base path for the current app
  const basePath = '/' + location.pathname.split('/')[1];
  
  // フィルタリングされたナビゲーションアイテム
  const filteredItems = items.filter(item => 
    !item.requiredRole || hasPermission('users', 'manage')
  );

  return (
    <div className="fixed left-16 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
        {AppIcon && <AppIcon className="w-5 h-5 text-gray-900 dark:text-white mr-3" />}
        <h1 className="text-base font-medium text-gray-900 dark:text-white">
          {title}
        </h1>
      </div>
      <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
        {filteredItems.map((item, index) => (
          <NavigationItemComponent 
            key={index} 
            item={item} 
            basePath={basePath}
          />
        ))}
      </nav>
    </div>
  );
};

export default Navigation;