import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Flex,
  Typography,
} from 'antd';

import { AltArrowLeft } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import type { Store } from '@shared/types/store';

import { LeftRightSection } from '@shared/components/LeftRightSection';

import { StoreKeyMetrics } from './StoreKeyMetrics';

interface Props {
  store: Store;
  onBack: () => void;
}

export const StoreOverview: React.FC<Props> = ({ store, onBack }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Flex vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <Typography.Title level={3} style={{ marginBottom: 0 }}>
        {store.name}
      </Typography.Title>

      <LeftRightSection
        left={(
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={onBack}
          >
            <AltArrowLeft size={18} />
            {t('common.back')}
          </Button>
        )}
        right={null}
      />

      <StoreKeyMetrics store={store} />
    </Flex>
  );
};
