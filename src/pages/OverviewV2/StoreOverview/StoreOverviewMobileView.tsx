import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Segmented } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import type { Store } from '@shared/types/store';

import { StoreKeyMetrics } from './StoreKeyMetrics';
import { TopOrderOverview } from './TopOrderOverview';
import { MachineOverview } from './MachineOverview';

interface Props {
  store: Store;
}

export const StoreOverviewMobileView: React.FC<Props> = ({ store }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  
  const tabOptions = [
    { label: t('overviewV2.overview'), value: 'key_metrics' },
    { label: t('overviewV2.order'), value: 'top_orders' },
    { label: t('overviewV2.machine'), value: 'machines' },
  ];

  const [selectedTab, setSelectedTab] = useState<any>(tabOptions[0].value);

  return (
    <Flex
      vertical
      align="end"
      gap={theme.custom.spacing.medium}
      style={{ width: '100%', height: '100%' }}
    >
      <Segmented
        options={tabOptions}
        value={selectedTab}
        onChange={(value) => {
          setSelectedTab(value);
        }}
        style={{
          width: 'fit-content',
        }}
        size="large"
      />

      {selectedTab === 'key_metrics' && <StoreKeyMetrics store={store} />}
      {selectedTab === 'top_orders' && <TopOrderOverview store={store} />}
      {selectedTab === 'machines' && <MachineOverview store={store} />}
    </Flex>
  );
};
