import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  Layout,
  Menu,
  Typography,
  Avatar,
  Button,
  Flex,
  type MenuProps,
} from 'antd';

import {
  Widget,
  Logout,
  Shop2,
  BoxMinimalistic,
  Bill,
  Sale,
  ShieldCheck,
  Suitcase,
  UsersGroupTwoRounded,
  User as UserIcon,
  ZipFile
} from '@solar-icons/react'

import { useTheme } from '@shared/theme/useTheme';
import { usePermissionContext } from '@shared/contexts/PermissionContext';
import { useCan } from '@shared/hooks/useCan';

import { STORAGE_KEY as USER_STORAGE_KEY } from '@core/storage/userStorage';

import { userStorage } from '@core/storage/userStorage';
import { tenantStorage } from '@core/storage/tenantStorage';
import { tokenStorage } from '@core/storage/tokenStorage';

import { type User } from '@shared/types/user';

import { DynamicTag } from '@shared/components/DynamicTag';

import { SiderHeader } from './Header';

const { Sider: AntdSider } = Layout;
const { Text } = Typography;

interface MenuItemConfig {
  key?: string;
  icon?: React.ReactNode;
  label?: string;
  children?: Array<{ key: string; label: string; permission?: string }>;
  type?: 'divider' | 'item';
  permission?: string; // Permission required to show this menu item
}

interface Props {
  style?: React.CSSProperties;
  onCollapseChange?: (collapsed: boolean) => void;
}

export const Sider: React.FC<Props> = ({ style, onCollapseChange }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const tenant = tenantStorage.load();
  const can = useCan();
  const { ready } = usePermissionContext();

  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const allMenuItems: MenuItemConfig[] = React.useMemo(() => [
    {
      key: 'overview',
      icon: <Widget />,
      label: t('navigation.overview'),
      // Overview is accessible to all authenticated users
    },
    {
      key: 'stores',
      icon: <Shop2 />,
      label: t('navigation.stores'),
      permission: 'store.list',
    },
    {
      key: 'controllers',
      icon: <BoxMinimalistic />,
      label: t('navigation.controllers'),
      permission: 'machine.list',
    },
    {
      key: 'orders',
      icon: <Bill />,
      label: t('navigation.orders'),
      permission: 'order.list',
    },
    {
      key: 'promotion-campaigns',
      icon: <Sale />,
      label: t('navigation.promotionCampaign'),
      permission: 'promotion_campaign.list',
    },
    {
      type: 'divider',
    },
    {
      key: 'tenants/profile',
      icon: <Suitcase />,
      label: t('navigation.tenantProfile'),
      permission: 'tenant.get',
    },
    {
      key: 'tenant-members',
      icon: <UsersGroupTwoRounded />,
      label: t('navigation.tenantMembers'),
      permission: 'tenant_member.list',
    },
    {
      type: 'divider',
    },
    {
      key: 'firmware',
      icon: <ZipFile />,
      label: t('navigation.firmware'),
      permission: 'firmware.list',
    },
    {
      key: 'permissions',
      icon: <ShieldCheck />,
      label: t('navigation.permissions'),
      permission: 'permission.list',
    },
    {
      type: 'divider',
    },
    {
      key: 'user/profile',
      icon: <UserIcon />,
      label: t('navigation.userProfile'),
      // User profile is typically accessible to all authenticated users
    },
  ], [t]);

  const menuItems = React.useMemo(() => {
    if (!ready) {
      // Return empty array while permissions are loading
      return [];
    }

    const filteredItems: MenuItemConfig[] = [];
    let previousWasDivider = false;

    for (let i = 0; i < allMenuItems.length; i++) {
      const item = allMenuItems[i];

      if (item.type === 'divider') {
        // Only add divider if there are visible items before and after
        const hasVisibleBefore = filteredItems.length > 0;
        const hasVisibleAfter = allMenuItems.slice(i + 1).some((nextItem) => {
          if (nextItem.type === 'divider') return false;
          if (!nextItem.permission) return true; // User profile doesn't need permission
          return can(nextItem.permission);
        });

        if (hasVisibleBefore && hasVisibleAfter && !previousWasDivider) {
          filteredItems.push({ type: 'divider' });
          previousWasDivider = true;
        } else {
          previousWasDivider = false;
        }
        continue;
      }

      // Handle items with children
      if (item.children && item.children.length > 0) {
        // Filter children by their permissions
        const filteredChildren = item.children.filter((child) => {
          return !child.permission || can(child.permission);
        });

        // Only show parent if at least one child is visible
        if (filteredChildren.length === 0) {
          continue;
        }

        // For items with children, show parent if any child is visible
        // Parent permission acts as an additional gate if specified
        // This allows showing a menu group if user has access to any sub-item
        const parentPermissionCheck = !item.permission || can(item.permission);
        if (parentPermissionCheck) {
          filteredItems.push({
            ...item,
            children: filteredChildren,
          });
          previousWasDivider = false;
        }
      } else {
        // Regular item without children - check permission
        const shouldShow = !item.permission || can(item.permission);
        if (shouldShow) {
          filteredItems.push(item);
          previousWasDivider = false;
        }
      }
    }

    // Remove trailing dividers
    while (
      filteredItems.length > 0 &&
      filteredItems[filteredItems.length - 1].type === 'divider'
    ) {
      filteredItems.pop();
    }

    return filteredItems
      .map((item) => {
        if (item.type === 'divider') {
          return { type: 'divider' as const };
        }

        return {
          key: item.key,
          icon: item.icon,
          label: item.label,
          children: item.children,
        };
      }) as MenuProps['items'];
  }, [allMenuItems, can, ready]);

  useEffect(() => {
    const loadUserData = () => {
      const userData = userStorage.load();
      setUser(userData);
    };

    loadUserData();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === USER_STORAGE_KEY) {
        loadUserData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const handleUserDataUpdate = () => {
      loadUserData();
    };

    window.addEventListener('userDataUpdated', handleUserDataUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataUpdated', handleUserDataUpdate);
    };
  }, []);

  useEffect(() => {
    const pathname = location.pathname;
    const pathSegments = pathname.split('/').filter(Boolean);
    const fullPath = pathSegments.join('/');
    
    let matchingKey: string | null = null;
    
    for (const item of allMenuItems) {
      if (item.type === 'divider') continue;
      
      if (item.key === fullPath) {
        matchingKey = item.key as string;
        break;
      }
      
      if (item.children) {
        const childMatch = item.children.find((child) => child && child.key === fullPath);
        if (childMatch) {
          matchingKey = childMatch.key as string;
          break;
        }
      }
    }

    setSelectedKey(matchingKey);
  }, [location.pathname, allMenuItems]);

  useEffect(() => {
    onCollapseChange?.(collapsed);
  }, [collapsed, onCollapseChange]);

  const handleLogout = () => {
    userStorage.clear();
    tenantStorage.clear();
    tokenStorage.clear();
    navigate('/auth/sign-in');
  };

  const getUserInitials = (user: User | null) => {
    if (!user?.email) return 'A';
    const email = user.email;
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase();
  };

  const flagStyle = {
    width: 28,
    height: 28,
    borderRadius: theme.custom.radius.full,
    cursor: 'pointer',
    border: '2px solid #fff',
    objectFit: 'cover' as React.CSSProperties['objectFit'],
  };

  return (
    <AntdSider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      trigger={null}
      width={300}
      collapsedWidth={80}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1000,
        height: '100vh',
        backgroundColor: theme.custom.colors.background.light,
        borderRight: `1px solid ${theme.custom.colors.neutral[200]}`,
        ...style,
      }}
    >
      <Flex
        vertical
        style={{
          height: '100%',
          width: '100%',
          padding: theme.custom.spacing.medium,
        }}
      >
        <SiderHeader
          tenant={tenant}
          collapsed={collapsed}
          onCollapseChange={setCollapsed}
        />

        <div style={{ flex: 1, overflow: 'auto' }}>
          <Menu
            selectedKeys={selectedKey ? [selectedKey] : []}
            mode="inline"
            onClick={(info) => {
              const key = info.key as string;
              setSelectedKey(key);
              navigate(`/${key}`);
            }}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
            }}
            items={menuItems}
          />
        </div>

        <div
          style={{
            borderTop: `1px solid ${theme.custom.colors.neutral[200]}`,
            paddingTop: theme.custom.spacing.medium,
            marginTop: theme.custom.spacing.medium,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.custom.spacing.small,
              marginBottom: theme.custom.spacing.medium,
              padding: theme.custom.spacing.small,
              borderRadius: theme.custom.radius.small,
              backgroundColor: theme.custom.colors.background.surface,
            }}
          >
            <Avatar
              size="small"
              style={{
                backgroundColor: theme.custom.colors.primary.default,
                flexShrink: 0,
              }}
            >
              {getUserInitials(user)}
            </Avatar>
            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text
                  style={{
                    color: theme.custom.colors.text.secondary,
                    fontSize: theme.custom.fontSize.small,
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user?.email || 'admin@lms.com'}
                </Text>
                <DynamicTag value={user?.role || ''} />
              </div>
            )}
          </div>

          <Flex
            justify="flex-start"
            align="center"
            style={{
              width: '100%',
              height: '40px',
            }}>
            <Button
              type="text"
              icon={<Logout />}
              onClick={handleLogout}
              style={{
                width: '100%',
                textAlign: 'left',
                color: theme.custom.colors.text.secondary,
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
            >
              {!collapsed && t('navigation.logout')}
            </Button>
          </Flex>
        </div>
      </Flex>
    </AntdSider>
  );
};
