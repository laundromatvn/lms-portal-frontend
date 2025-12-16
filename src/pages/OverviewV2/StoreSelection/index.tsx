import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Flex,
  Typography,
  Skeleton,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import { type Store } from '@shared/types/store';

import { StoreSelectionSectionOption } from './Option';

interface Props {
  stores: Store[];
  loading: boolean;
  onSelectStore: (store: Store) => void;
}

export const StoreSelection: React.FC<Props> = ({ stores, loading, onSelectStore }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useIsMobile();

  return (
    <Flex
      vertical
      align={isMobile ? 'flex-start' : 'center'}
      justify={isMobile ? 'flex-start' : 'center'}
      gap={theme.custom.spacing.small}
      style={{ width: '100%', height: '100%' }}
    >
      <Typography.Title level={3} style={{ marginBottom: 0 }}>
        {t('overviewV2.laundryManagementSystem')}
      </Typography.Title>

      <Typography.Text type="secondary">
        {t('overviewV2.messages.selectAStoresToViewData')}
      </Typography.Text>

      {loading && <Skeleton active style={{ width: '100%', maxWidth: 600 }} />}

      <Flex
        vertical
        justify="flex-start"
        align="center"
        gap={theme.custom.spacing.small}
        style={{ width: '100%', maxWidth: 600, overflowY: 'auto' }}
      >
        {!loading && stores.map((store) => (
          <StoreSelectionSectionOption
            key={store.id}
            store={store}
            onSelect={() => onSelectStore(store)}
            style={{ maxWidth: 600 }}
          />
        ))}
      </Flex>
    </Flex>
  )
};
