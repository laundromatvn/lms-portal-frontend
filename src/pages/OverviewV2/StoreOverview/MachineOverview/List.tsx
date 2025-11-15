import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Typography,
  Skeleton,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import type { Store } from '@shared/types/store';
import type { Machine } from '@shared/types/machine';

import {
  useListMachineApi,
  type ListMachineResponse,
} from '@shared/hooks/useListMachineApi';

import { Box } from '@shared/components/Box';

import { MachineOverviewItem } from './Item';

interface Props {
  store: Store;
}

export const MachineOverviewList: React.FC<Props> = ({ store }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const {
    listMachine,
    data: listMachineData,
    loading: listMachineLoading,
  } = useListMachineApi<ListMachineResponse>();

  useEffect(() => {
    listMachine({
      store_id: store.id,
      page: 1,
      page_size: 100,
    });
  }, []);

  return (
    <Box
      vertical
      gap={theme.custom.spacing.medium}
      style={{
        width: '100%',
        maxHeight: 500,
        overflow: 'auto',
      }}
    >
      {listMachineLoading ? (
        <Skeleton active />
      ) : (
        listMachineData?.data.map((machine) => (
          <MachineOverviewItem machine={machine} />
        ))
      )}
    </Box>
  );
};
