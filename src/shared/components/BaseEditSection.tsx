import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Typography } from 'antd';

import { CheckCircle } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import LeftRightSection from '@shared/components/LeftRightSection';

import { Box } from '@shared/components/Box';

interface Props {
  title?: string;
  children: React.ReactNode;
  saveButtonText?: string;
  onSave?: () => void;
  showSaveButton?: boolean;
}

export const BaseEditSection: React.FC<Props> = ({ title, children, saveButtonText, onSave, showSaveButton = true }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <LeftRightSection
        left={<Typography.Title level={3}>{title}</Typography.Title>}
        right={showSaveButton && onSave ? (
          <Button
            type="link"
            onClick={onSave}
            icon={<CheckCircle size={18} />}
          >
            {saveButtonText || t('common.save')}
          </Button>
        ) : null}
      />
      {children}
    </Box>
  );
};
