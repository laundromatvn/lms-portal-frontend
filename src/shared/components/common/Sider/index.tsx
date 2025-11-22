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
  ArrowLeft,
  ArrowRight,
  Logout,
  Shop2,
  WiFiRouter,
  WashingMachine,
  Bill,
  Sale,
  Suitcase,
  UsersGroupTwoRounded,
  User as UserIcon,
  ZipFile
} from '@solar-icons/react'

import Flag from 'react-world-flags';

import { useTheme } from '@shared/theme/useTheme';
import i18n from '@shared/services/i18n';

import { STORAGE_KEY as USER_STORAGE_KEY } from '@core/storage/userStorage';

import { userStorage } from '@core/storage/userStorage';
import { tenantStorage } from '@core/storage/tenantStorage';
import { tokenStorage } from '@core/storage/tokenStorage';

import { type User } from '@shared/types/user';

import { DynamicTag } from '@shared/components/DynamicTag';
import { useGetPortalAccessAppApi } from '@shared/hooks/access/useGetPortalAccessApp';

const { Sider: AntdSider } = Layout;
const { Text } = Typography;

interface MenuItemConfig {
  key?: string;
  icon?: React.ReactNode;
  label?: string;
  children?: Array<{ key: string; label: string }>;
  requiredAccess?: keyof GetPortalAccessAppResponse;
  type?: 'divider' | 'item';
}

interface Props {
  style?: React.CSSProperties;
  onCollapseChange?: (collapsed: boolean) => void;
}

interface GetPortalAccessAppResponse {
  portal_laundry_foundation_management: boolean;
  portal_system_management: boolean;
}

export const Sider: React.FC<Props> = ({ style, onCollapseChange }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const tenant = tenantStorage.load();
  const {
    data: portalAccessData,
    getPortalAccessApp,
  } = useGetPortalAccessAppApi();

  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const allMenuItems: MenuItemConfig[] = React.useMemo(() => [
    {
      key: 'overview',
      icon: <Widget />,
      label: t('navigation.overview'),
      requiredAccess: 'portal_laundry_foundation_management',
    },
    {
      key: 'stores',
      icon: <Shop2 />,
      label: t('navigation.stores'),
      requiredAccess: 'portal_laundry_foundation_management',
    },
    {
      key: 'controllers',
      icon: <WiFiRouter />,
      label: t('navigation.controllers'),
      requiredAccess: 'portal_laundry_foundation_management',
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
      requiredAccess: 'portal_laundry_foundation_management',
    },
    {
      key: 'orders',
      icon: <Bill />,
      label: t('navigation.orders'),
      requiredAccess: 'portal_laundry_foundation_management',
    },
    {
      key: 'promotion-campaigns',
      icon: <Sale />,
      label: t('navigation.promotionCampaign'),
      requiredAccess: 'portal_laundry_foundation_management',
    },
    {
      type: 'divider',
      requiredAccess: 'portal_laundry_foundation_management',
    },
    {
      key: 'tenants/profile',
      icon: <Suitcase />,
      label: t('navigation.tenantProfile'),
      requiredAccess: 'portal_laundry_foundation_management',
    },
    {
      key: 'tenant-members',
      icon: <UsersGroupTwoRounded />,
      label: t('navigation.tenantMembers'),
      requiredAccess: 'portal_laundry_foundation_management',
    },
    {
      type: 'divider',
      requiredAccess: 'portal_system_management',
    },
    {
      key: 'firmware',
      icon: <ZipFile />,
      label: t('navigation.firmware'),
      requiredAccess: 'portal_system_management',
    },
    {
      type: 'divider',
      requiredAccess: 'portal_system_management',
    },
    {
      key: 'user/profile',
      icon: <UserIcon />,
      label: t('navigation.userProfile'),
      requiredAccess: 'portal_laundry_foundation_management',
    },
  ], [t]);

  const menuItems = React.useMemo(() => {
    return allMenuItems
      .filter((item) => {
        if (!item.requiredAccess) return true;
        if (item.type === 'divider') {
          const index = allMenuItems.indexOf(item);
          const beforeItems = allMenuItems.slice(0, index).filter(i => i.type !== 'divider');
          const afterItems = allMenuItems.slice(index + 1).filter(i => i.type !== 'divider');
          const beforeVisible = beforeItems.some(i => !i.requiredAccess || portalAccessData?.[i.requiredAccess]);
          const afterVisible = afterItems.some(i => !i.requiredAccess || portalAccessData?.[i.requiredAccess]);
          return beforeVisible && afterVisible;
        }
        return portalAccessData?.[item.requiredAccess] ?? false;
      })
      .map((item) => {
        const { requiredAccess, ...menuItem } = item;
        if (item.type === 'divider') {
          return { type: 'divider' as const };
        }

        return {
          key: menuItem.key,
          icon: menuItem.icon,
          label: menuItem.label,
          children: menuItem.children,
        };
      }) as MenuProps['items'];
  }, [portalAccessData, allMenuItems]);

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
    getPortalAccessApp();
  }, [getPortalAccessApp]);

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

              <Flex vertical justify="center" gap={theme.custom.spacing.xxsmall}>
                <Text
                  strong
                  style={{
                    color: theme.custom.colors.text.primary,
                    fontSize: '16px',
                  }}
                >
                  LMS Portal
                </Text>

                {tenant && (
                  <Typography.Text type="secondary" style={{ fontSize: theme.custom.fontSize.medium }}>
                    {tenant.name}
                  </Typography.Text>
                )}
              </Flex>
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
