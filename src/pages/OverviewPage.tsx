import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { Logo } from '@shared/components/common/Logo';
import { CenteredLayout } from '@shared/components/layouts/CenteredLayout';

export const OverviewPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const navigate = useNavigate();

  return (
    <CenteredLayout>
      <Logo size="xlarge" />

      Overview
    </CenteredLayout>
  );
};
