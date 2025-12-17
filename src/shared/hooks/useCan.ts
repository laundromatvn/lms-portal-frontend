import { useCallback } from 'react';
import { usePermissionContext } from '@shared/contexts/PermissionContext';

/**
 * Hook that returns a function to check if the user has a specific permission.
 * 
 * @returns A function that takes a permission string and returns a boolean.
 *          Returns `false` if permissions are not ready yet.
 * 
 * @example
 * ```tsx
 * const can = useCan();
 * 
 * if (can('store.create')) {
 *   // Render create store button
 * }
 * ```
 */
export const useCan = (): ((permission: string) => boolean) => {
  const { permissions, ready } = usePermissionContext();

  return useCallback(
    (permission: string): boolean => {
      if (!ready) {
        return false;
      }
      return permissions.has(permission);
    },
    [permissions, ready]
  );
};
