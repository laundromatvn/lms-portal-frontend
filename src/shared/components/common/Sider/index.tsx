import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

import { Layout, Menu, Typography, Avatar, Button } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { userStorage } from '@core/storage/userStorage';
import { STORAGE_KEY as USER_STORAGE_KEY } from '@core/storage/userStorage';

import { type User } from '@shared/types/user';

import {
  Widget,
  Settings,
  UserCircle,
  ArrowLeft,
  ArrowRight,
  Logout,
  Shop2,
} from '@solar-icons/react'

const { Sider: AntdSider } = Layout;
const { Text } = Typography;

interface Props {
  style?: React.CSSProperties;
  onCollapseChange?: (collapsed: boolean) => void;
}

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path?: string;
}

export const Sider: React.FC<Props> = ({ style, onCollapseChange }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const menuItems: MenuItem[] = [
    {
      key: 'overview',
      icon: <Widget />,
      label: t('navigation.overview'),
      path: '/overview',
    },
    {
      key: 'stores',
      icon: <Shop2 />,
      label: t('navigation.stores'),
      path: '/stores',
    }
  ];

  const bottomMenuItems: MenuItem[] = [
    {
      key: 'settings',
      icon: <Settings />,
      label: t('navigation.settings'),
      path: '/settings',
    },
    {
      key: 'profile',
      icon: <UserCircle />,
      label: t('navigation.profile'),
      path: '/profile',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    const item = [...menuItems, ...bottomMenuItems].find(item => item.key === key);
    if (item?.path) {
      navigate(item.path);
    }
  };

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

  const handleLogout = () => {
    userStorage.clear();
    navigate('/auth/sign-in');
  };

  const getUserInitials = (user: User | null) => {
    if (!user?.email) return 'A';
    const email = user.email;
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase();
  };

  const getUserDisplayName = (user: User | null) => {
    if (!user?.email) return 'Admin User';
    const email = user.email;
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const getSelectedKey = () => {
    const currentPath = location.pathname;
    const item = [...menuItems, ...bottomMenuItems].find(item => item.path === currentPath);
    return item ? [item.key] : ['overview'];
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          padding: theme.custom.spacing.medium,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.custom.spacing.large,
            paddingBottom: theme.custom.spacing.medium,
            borderBottom: `1px solid ${theme.custom.colors.neutral[200]}`,
          }}
        >
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.custom.spacing.small }}>
              <Avatar
                size="small"
                style={{
                  backgroundColor: theme.custom.colors.primary.default,
                }}
              >
                L
              </Avatar>
              <Text
                strong
                style={{
                  color: theme.custom.colors.text.primary,
                  fontSize: '16px',
                }}
              >
                LMS Admin
              </Text>
            </div>
          )}
          <Button
            type="text"
            icon={collapsed ? <ArrowRight /> : <ArrowLeft />}
            onClick={() => {
              const newCollapsed = !collapsed;
              setCollapsed(newCollapsed);
              onCollapseChange?.(newCollapsed);
            }}
            style={{
              color: theme.custom.colors.text.secondary,
            }}
          />
        </div>

        {/* Main Menu */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Menu
            mode="inline"
            selectedKeys={getSelectedKey()}
            onClick={handleMenuClick}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
            }}
            items={menuItems.map(item => ({
              key: item.key,
              icon: item.icon,
              label: item.label,
            }))}
          />
        </div>

        {/* <Divider style={{ margin: `${theme.custom.spacing.medium}px 0` }} />

        <Menu
          mode="inline"
          selectedKeys={getSelectedKey()}
          onClick={handleMenuClick}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
          }}
          items={bottomMenuItems.map(item => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
          }))}
        /> */}

        {/* User Admin Section */}
        <div
          style={{
            borderTop: `1px solid ${theme.custom.colors.neutral[200]}`,
            paddingTop: theme.custom.spacing.medium,
            marginTop: theme.custom.spacing.medium,
          }}
        >
          {/* User Info */}
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
                  strong
                  style={{
                    color: theme.custom.colors.text.primary,
                    fontSize: '14px',
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {getUserDisplayName(user)}
                </Text>
                <Text
                  style={{
                    color: theme.custom.colors.text.secondary,
                    fontSize: '12px',
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user?.email || 'admin@lms.com'}
                </Text>
              </div>
            )}
          </div>

          {/* Logout Button */}
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
        </div>
      </div>
    </AntdSider>
  );
};
