import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button } from 'antd';

import { Lock } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';

export const UserProfilePasswordSection: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <BaseDetailSection title={t('common.userPassword')}>
      <Button
        icon={<Lock />}
        onClick={() => navigate(`/user/reset-password`)}
        style={{
          color: theme.custom.colors.neutral.default, 
          backgroundColor: theme.custom.colors.background.light,
          fontWeight: theme.custom.fontWeight.large,
        }}
      >
        {t('common.resetPassword')}
      </Button>
    </BaseDetailSection>
  );
};
