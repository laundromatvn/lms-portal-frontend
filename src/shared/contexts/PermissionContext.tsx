import React, { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { tokenManager } from '@core/auth/tokenManager';
import { permissionStorage } from '@core/storage/permissionStorage';
import { getMePermissionsApi } from '@shared/hooks/useGetMePermissions';

interface PermissionContextValue {
  permissions: Set<string>;
  ready: boolean;
  refreshPermissions: () => Promise<void>;
}

const PermissionContext = createContext<PermissionContextValue | undefined>(undefined);

interface PermissionProviderProps {
  children: ReactNode;
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children }) => {
  const [permissions, setPermissions] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  const fetchPermissions = useCallback(async (): Promise<void> => {
    if (!tokenManager.isAuthenticated()) {
      setPermissions(new Set());
      setReady(true);
      return;
    }

    try {
      const response = await getMePermissionsApi();
      const permissionsSet = new Set(response.permissions);
      setPermissions(permissionsSet);
      permissionStorage.save(response.permissions);
      setReady(true);
    } catch (error) {
      // Try to load from storage as fallback
      const storedPermissions = permissionStorage.load();
      if (storedPermissions) {
        setPermissions(new Set(storedPermissions));
        setReady(true);
      } else {
        // If no stored permissions and API fails, set empty set but mark as ready
        setPermissions(new Set());
        setReady(true);
      }
    }
  }, []);

  const refreshPermissions = useCallback(async (): Promise<void> => {
    setReady(false);
    await fetchPermissions();
  }, [fetchPermissions]);

  useEffect(() => {
    // Load initial permissions from storage if available
    const storedPermissions = permissionStorage.load();
    if (storedPermissions) {
      setPermissions(new Set(storedPermissions));
      setReady(true);
    }

    // Fetch fresh permissions if authenticated
    if (tokenManager.isAuthenticated()) {
      fetchPermissions();
    }

    // Subscribe to auth changes
    const unsubscribe = tokenManager.subscribeAuth((authenticated) => {
      if (authenticated) {
        fetchPermissions();
      } else {
        setPermissions(new Set());
        permissionStorage.clear();
        setReady(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [fetchPermissions]);

  const value: PermissionContextValue = {
    permissions,
    ready,
    refreshPermissions,
  };

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
};

export const usePermissionContext = (): PermissionContextValue => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissionContext must be used within a PermissionProvider');
  }
  return context;
};
