import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Flex,
  Typography,
  Skeleton,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type Store } from '@shared/types/store';

import {
  useListStoreApi,
  type ListStoreResponse,
} from '@shared/hooks/useListStoreApi';

import { StoreSelectionSectionOption } from './Option';

interface Props {
  stores: Store[];
  loading: boolean;
  onSelectStore: (store: Store) => void;
}

export const StoreSelection: React.FC<Props> = ({ stores, loading, onSelectStore }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Flex
      vertical
      align="center"
      justify="center"
      gap={theme.custom.spacing.small}
      style={{width: '100%', height: '100%'}}
    >
      <Typography.Title level={3} style={{ marginBottom: 0 }}>
        {t('overviewV2.laundryManagementSystem')}
      </Typography.Title>

      <Typography.Text type="secondary">
        {t('overviewV2.messages.selectAStoresToViewData')}
      </Typography.Text>

      {loading && <Skeleton active style={{ width: '100%', maxWidth: 600 }} />}

      {!loading && stores.map((store) => (
        <StoreSelectionSectionOption
          key={store.id}
          store={store}
          onSelect={() => onSelectStore(store)}
          style={{ maxWidth: 600 }}
        />
      ))}
    </Flex>
  )
};
