import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermissions?: Array<{ resource: string; action: string }>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children,
  requiredRole,
  requiredPermissions 
}) => {
  const { user, authUser, loading, hasPermission } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user && !loading) {
      sessionStorage.setItem('redirectUrl', location.pathname);
    }
  }, [user, loading, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user || !authUser) {
    return <Navigate to="/login" replace />;
  }

  if (!user.email?.endsWith('@manaable.com')) {
    return <Navigate to="/login" replace />;
  }

  // ロールチェック
  if (requiredRole && authUser.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // 権限チェック
  if (requiredPermissions) {
    const hasAllPermissions = requiredPermissions.every(
      ({ resource, action }) => hasPermission(resource, action)
    );
    if (!hasAllPermissions) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default PrivateRoute;