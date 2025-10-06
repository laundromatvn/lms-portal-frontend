import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

import { Layout, Menu, Typography, Avatar, Button, Flex } from 'antd';

import Flag from 'react-world-flags';

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
  WiFiRouter,
  WashingMachine,
  Bill,
} from '@solar-icons/react'
import type { MenuProps } from 'antd';
import i18n from '@shared/services/i18n';

const { Sider: AntdSider } = Layout;
const { Text } = Typography;

type MenuItem = Required<MenuProps>['items'][number] & {
  children?: MenuItem[];
};

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

  const [selectedKey, setSelectedKey] = useState<string>('overview');

  const menuItems: MenuItem[] = [
    {
      key: 'overview',
      icon: <Widget />,
      label: t('navigation.overview'),
    },
    {
      key: 'stores',
      icon: <Shop2 />,
      label: t('navigation.stores'),
    },
    {
      key: 'controllers',
      icon: <WiFiRouter />,
      label: t('navigation.controllers'),
      children: [
        {
          key: 'controllers',
          label: t('navigation.controllers'),
        },
        {
          key: 'controllers/abandoned',
          label: t('navigation.registerAbandonedControllers'),
        },
      ],
    },
    {
      key: 'machines',
      icon: <WashingMachine />,
      label: t('navigation.machines'),
    },
    {
      key: 'orders',
      icon: <Bill />,
      label: t('navigation.orders'),
    },
  ];

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

  // Sync selectedKey with current location
  useEffect(() => {
    const pathname = location.pathname;
    setSelectedKey(pathname.split('/')[1]);
  }, [location.pathname]);

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
        {/* Header */}
        <Flex
          justify="space-between"
          align="center"
          style={{
            marginBottom: theme.custom.spacing.large,
            paddingBottom: theme.custom.spacing.medium,
            borderBottom: `1px solid ${theme.custom.colors.neutral[200]}`,
          }}
        >
          {!collapsed && (
            <Flex align="center" gap={theme.custom.spacing.small}>
              {i18n.language === 'vn' ? (
                <Flag
                  code="vn"
                  style={{
                    ...flagStyle,
                    border: '2px solid #fff',
                  }}
                  onClick={() => {
                    i18n.changeLanguage('en');
                  }} />
              ) : (
                <Flag
                  code="gb"
                  style={{
                    ...flagStyle,
                    border: '2px solid #fff',
                  }}
                  onClick={() => {
                    i18n.changeLanguage('vn');
                  }} />
              )}

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
            </Flex>
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
        </Flex>

        {/* Main Menu */}
        <Flex flex={1} style={{ overflow: 'auto' }}>
          <Menu
            selectedKeys={[selectedKey]}
            mode="inline"
            onClick={(key) => {
              setSelectedKey(key.key as string);
              navigate(`/${key.key}`);
            }}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
            }}
            items={menuItems}
          />
        </Flex>

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
