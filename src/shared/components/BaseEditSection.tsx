import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Typography } from 'antd';

import { CheckCircle } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import LeftRightSection from '@shared/components/LeftRightSection';

import { Box } from '@shared/components/Box';

interface Props {
  title: string;
  children: React.ReactNode;
  saveButtonText?: string;
  onSave: () => void;
}

export const BaseEditSection: React.FC<Props> = ({ title, children, saveButtonText, onSave }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <LeftRightSection
        left={<Typography.Title level={3}>{title}</Typography.Title>}
        right={(
          <Button
            type="link"
            onClick={onSave}
          >
            {saveButtonText || t('common.save')}
            <CheckCircle size={18} />
          </Button>
        )}
      />
      {children}
    </Box>
  );
};
