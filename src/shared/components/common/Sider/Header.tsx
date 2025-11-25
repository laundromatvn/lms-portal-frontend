import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Flex, Typography } from 'antd';

import { SquareAltArrowLeft, SquareAltArrowRight } from '@solar-icons/react';

import Flag from 'react-world-flags';

import { useTheme } from '@shared/theme/useTheme';

import { type Tenant } from '@shared/types/tenant';

interface Props {
  tenant: Tenant | null;
  collapsed: boolean;
  onCollapseChange: (collapsed: boolean) => void;
  style?: React.CSSProperties;
}

export const SiderHeader: React.FC<Props> = ({ tenant, collapsed, onCollapseChange, style }) => {
  const { i18n } = useTranslation();
  const theme = useTheme();

  return (
    <Flex
      justify={collapsed ? "center" : "space-between"}
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
                width: 28,
                height: 28,
                borderRadius: theme.custom.radius.full,
                cursor: 'pointer',
                border: '2px solid #fff',
                objectFit: 'cover' as React.CSSProperties['objectFit'],
              }}
              onClick={() => {
                i18n.changeLanguage('en');
              }} />
          ) : (
            <Flag
              code="gb"
              style={{
                width: 28,
                height: 28,
                borderRadius: theme.custom.radius.full,
                cursor: 'pointer',
                border: '2px solid #fff',
                objectFit: 'cover' as React.CSSProperties['objectFit'],
              }}
              onClick={() => {
                i18n.changeLanguage('vn');
              }} />
          )}

          <Flex vertical justify="center" gap={theme.custom.spacing.xxsmall}>
            <Typography.Text
              strong
              style={{
                color: theme.custom.colors.text.primary,
                fontSize: '16px',
              }}
            >
              LMS Portal
            </Typography.Text>

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
        icon={collapsed ? (
          <SquareAltArrowRight
            weight='Outline'
            width={24}
            height={24}
          />
        ) : (
          <SquareAltArrowLeft
            weight='Outline'
            width={24}
            height={24}
          />
        )}
        onClick={() => onCollapseChange(!collapsed)}
        style={{ color: theme.custom.colors.info.default }}
      />
    </Flex>
  )
};
