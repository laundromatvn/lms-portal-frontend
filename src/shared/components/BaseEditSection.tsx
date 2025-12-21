import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Flex, Spin, Typography } from 'antd';

import { CheckCircle } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { Box } from '@shared/components/Box';

interface Props {
  title?: string;
  children: React.ReactNode;
  saveButtonText?: string;
  onSave?: () => void;
  showSaveButton?: boolean;
  loading?: boolean;
}

export const BaseEditSection: React.FC<Props> = ({
  title,
  children,
  saveButtonText,
  onSave,
  showSaveButton = true,
  loading = false,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <Flex justify="space-between" style={{ width: '100%' }}>
        <Flex align="center" gap={theme.custom.spacing.small}>
          <Spin spinning={loading} size="small" />
          <Typography.Title level={5}>{title}</Typography.Title>
        </Flex>

        {showSaveButton && onSave ? (
          <Button
            type="link"
            onClick={onSave}
            icon={<CheckCircle size={18} />}
          >
            {saveButtonText || t('common.save')}
          </Button>
        ) : null}
      </Flex>

      {children}
    </Box>
  );
};
