import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Flex,
  Typography,
  Skeleton,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { tenantStorage } from '@core/storage/tenantStorage';

import { type Store } from '@shared/types/store';

import {
  useListStoreApi,
  type ListStoreResponse,
} from '@shared/hooks/useListStoreApi';

import { StoreSelectionSectionOption } from './Option';

interface Props {
  onSelectStore: (store: Store) => void;
}

export const StoreSelection: React.FC<Props> = ({ onSelectStore }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const tenant = tenantStorage.load();

  const [selectedStore, setSelectedStore] = useState<Store>();

  const {
    listStore,
    data: listStoreData,
    loading: listStoreLoading,
  } = useListStoreApi<ListStoreResponse>();

  const handleListStore = () => {
    listStore({ page: 1, page_size: 100 });
  }

  useEffect(() => {
    handleListStore();
  }, []);

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

      {listStoreLoading && <Skeleton active style={{ width: '100%', maxWidth: 600 }} />}

      {!listStoreLoading && listStoreData?.data.map((store) => (
        <StoreSelectionSectionOption
          key={store.id}
          store={store}
          selected={selectedStore?.id === store.id}
          onSelect={() => {
            setSelectedStore(store);
            onSelectStore(store);
          }}
          style={{ maxWidth: 600 }}
        />
      ))}
    </Flex>
  )
};
