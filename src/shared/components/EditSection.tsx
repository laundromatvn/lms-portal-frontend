import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Typography } from 'antd';

import { PenNewSquare } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import LeftRightSection from '@shared/components/LeftRightSection';

import { Box } from '@shared/components/Box';

interface Props {
  title: string;
  children: React.ReactNode;
  onEdit: () => void;
}

export const EditSection: React.FC<Props> = ({ children, onEdit }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <LeftRightSection
        left={<Typography.Title level={3}>{t('common.basicInformation')}</Typography.Title>}
        right={(<>
          <Button
            type="link"
            onClick={onEdit}
            icon={<PenNewSquare size={18} />}
          />
        </>)}
      />

      {children}
    </Box>
  );
};
