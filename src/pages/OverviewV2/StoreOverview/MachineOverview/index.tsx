import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {Flex} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import type { Store } from '@shared/types/store';

import {
  useListMachineApi,
  type ListMachineResponse,
} from '@shared/hooks/useListMachineApi';

import { BaseSectionTitle } from '@shared/components/BaseSectionTitle';

import { MachineOverviewList } from './List';

interface Props {
  store: Store;
}

export const MachineOverview: React.FC<Props> = ({ store }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const {
    listMachine,
    data: listMachineData,
    loading: listMachineLoading,
  } = useListMachineApi<ListMachineResponse>();

  const handleListMachine = async () => {
    await listMachine({
      store_id: store.id,
      page: 1,
      page_size: 100,
    });
  };

  useEffect(() => {
    handleListMachine();
  }, [store]);

  return (
    <Flex vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <BaseSectionTitle
        title={t('overviewV2.machineOverview')}
        onRefresh={handleListMachine}
      />

      <MachineOverviewList
        machines={listMachineData?.data || []}
        loading={listMachineLoading}
      />
    </Flex>
  );
};
