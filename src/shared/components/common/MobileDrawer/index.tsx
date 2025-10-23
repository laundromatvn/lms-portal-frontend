import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  Drawer,
  Menu,
  Typography,
  Avatar,
  Button,
  Flex,
  type MenuProps,
} from 'antd';

import Flag from 'react-world-flags';

import {
  Widget,
  Logout,
  Shop2,
  WiFiRouter,
  WashingMachine,
  Bill,
  Suitcase,
  UsersGroupTwoRounded,
  Home
} from '@solar-icons/react'

import { useTheme } from '@shared/theme/useTheme';

import { userStorage } from '@core/storage/userStorage';
import { tenantStorage } from '@core/storage/tenantStorage';
import { tokenStorage } from '@core/storage/tokenStorage';

import { type User } from '@shared/types/user';
import { UserRoleEnum } from '@shared/enums/UserRoleEnum';

import { DynamicTag } from '@shared/components/DynamicTag';

const { Text } = Typography;

type MenuItem = Required<MenuProps>['items'][number] & {
  children?: MenuItem[];
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<Props> = ({ open, onClose }) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<User | null>(null);
  const tenant = tenantStorage.load();

  const [selectedMainKey, setSelectedMainKey] = useState<string | null>(null);
  const [selectedTenantKey, setSelectedTenantKey] = useState<string | null>(null);

  const mainMenuItems: MenuItem[] = [
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

  const tenantAdminManagementMenuItems: MenuItem[] = [
    {
      key: 'tenants/profile',
      icon: <Suitcase />,
      label: t('navigation.tenantProfile'),
    },
    {
      key: 'tenant-members',
      icon: <UsersGroupTwoRounded />,
      label: t('navigation.tenantMembers'),
    },
  ];

  const tenantStaffManagementMenuItems: MenuItem[] = [
    {
      key: 'tenants/profile',
      icon: <Suitcase />,
      label: t('navigation.tenantProfile'),
    },
  ];

  useEffect(() => {
    const loadUserData = () => {
      const userData = userStorage.load();
      setUser(userData);
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;

    // Set main menu selection
    if (currentPath.startsWith('/overview')) {
      setSelectedMainKey('overview');
    } else if (currentPath.startsWith('/stores')) {
      setSelectedMainKey('stores');
    } else if (currentPath.startsWith('/controllers')) {
      setSelectedMainKey('controllers');
    } else if (currentPath.startsWith('/machines')) {
      setSelectedMainKey('machines');
    } else if (currentPath.startsWith('/orders')) {
      setSelectedMainKey('orders');
    }

    // Set tenant menu selection
    if (currentPath.startsWith('/tenants/profile')) {
      setSelectedTenantKey('tenants/profile');
    } else if (currentPath.startsWith('/tenant-members')) {
      setSelectedTenantKey('tenant-members');
    }
  }, [location.pathname]);

  const handleLogout = () => {
    tokenStorage.clear();
    userStorage.clear();
    tenantStorage.clear();
    navigate('/auth/sign-in');
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(`/${key}`);
    onClose();
  };

  const getMenuItems = (): MenuItem[] => {
    const items: MenuItem[] = [...mainMenuItems];

    if (user?.role === UserRoleEnum.TENANT_ADMIN) {
      items.push(...tenantAdminManagementMenuItems);
    } else if (user?.role === UserRoleEnum.TENANT_STAFF) {
      items.push(...tenantStaffManagementMenuItems);
    }

    return items;
  };

  return (
    <Drawer
      title={null}
      placement="left"
      closable={false}
      onClose={onClose}
      open={open}
      width="100%"
      style={{
        backgroundColor: theme.custom.colors.background.light,
      }}
      bodyStyle={{
        padding: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
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
          <Flex vertical gap={theme.custom.spacing.xsmall}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: theme.custom.colors.text.primary,
              }}
            >
              {tenant?.name || 'WashGo247'}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: theme.custom.colors.text.secondary,
              }}
            >
              {user?.email}
            </Text>
          </Flex>

          {/* User Role Badge */}
          {user?.role && (
            <Flex
              justify="center"
              style={{
                marginBottom: theme.custom.spacing.large,
              }}
            >
              <DynamicTag
                value={user.role}
              />
            </Flex>
          )}
        </Flex>

        {/* Menu */}
        <Flex
          vertical
          style={{
            flex: 1,
            width: '100%',
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedMainKey, selectedTenantKey].filter(Boolean) as string[]}
            items={getMenuItems()}
            onClick={handleMenuClick}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: 16,
            }}
          />
        </Flex>

        {/* Language Selection */}
        <Flex
          justify="center"
          align="center"
          gap={theme.custom.spacing.medium}
          style={{
            marginTop: theme.custom.spacing.large,
            paddingTop: theme.custom.spacing.medium,
            borderTop: `1px solid ${theme.custom.colors.neutral[200]}`,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: theme.custom.colors.text.secondary,
            }}
          >
            {t('navigation.language')}:
          </Text>
          <Flex gap={theme.custom.spacing.small}>
            <Flag
              code="vn"
              style={{
                width: 48,
                height: 32,
                borderRadius: 4,
                cursor: 'pointer',
                border: i18n.language === 'vn' ? '2px solid #1677ff' : '2px solid transparent',
                objectFit: 'cover' as React.CSSProperties['objectFit'],
              }}
              onClick={() => {
                i18n.changeLanguage('vn');
              }}
            />
            <Flag
              code="gb"
              style={{
                width: 48,
                height: 32,
                borderRadius: 4,
                cursor: 'pointer',
                border: i18n.language === 'en' ? '2px solid #1677ff' : '2px solid transparent',
                objectFit: 'cover' as React.CSSProperties['objectFit'],
              }}
              onClick={() => {
                i18n.changeLanguage('en');
              }}
            />
          </Flex>
        </Flex>

        {/* Button Group */}
        <Flex
          justify="center"
          gap={theme.custom.spacing.medium}
          style={{
            marginTop: theme.custom.spacing.medium,
          }}
        >
          <Button
            type="primary"
            danger
            icon={<Logout />}
            onClick={handleLogout}
            style={{
              width: '100%',
              height: 48,
              fontSize: 16,
              color: theme.custom.colors.danger.default,
              padding: theme.custom.spacing.medium,
              borderRadius: theme.custom.radius.full,
              backgroundColor: theme.custom.colors.danger.light,
            }}
          >
            {t('navigation.logout')}
          </Button>

          <Button
            type="primary"
            icon={<Home />}
            onClick={() => {
              navigate('/overview');
              onClose();
            }}
            style={{
              width: '100%',
              height: 48,
              fontSize: 16,
              color: theme.custom.colors.text.inverted,
              padding: theme.custom.spacing.medium,
              borderRadius: theme.custom.radius.full,
            }}
          >
            {t('navigation.home')}
          </Button>
        </Flex>
      </Flex>
    </Drawer>
  );
};
