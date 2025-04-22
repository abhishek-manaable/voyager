import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface PermissionGateProps {
  resource: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const PermissionGate: React.FC<PermissionGateProps> = ({
  resource,
  action,
  children,
  fallback = null,
}) => {
  const { hasPermission } = useAuth();

  if (!hasPermission(resource, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default PermissionGate;