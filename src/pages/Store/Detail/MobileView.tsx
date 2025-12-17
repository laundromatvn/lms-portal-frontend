import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Flex, Segmented } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type Store } from '@shared/types/store';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';

import { DetailSection } from './DetailSection';
import { PaymentMethodSection } from './PaymentMethodSection';
import { ControllerListSection } from './ControllerListSection';
import { MachineListSection } from './MachineListSection';

export interface Props {
  store: Store;
}

export const StoreDetailMobileView: React.FC<Props> = ({ store }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState<string>('information');

  const segmentedOptions = [
    {
      label: t('store.details.information'),
      value: 'information',
    },
    {
      label: t('store.details.controllers'),
      value: 'controllers',
    },
    {
      label: t('store.details.machines'),
      value: 'machines',
    },
  ];

  return (
    <PortalLayoutV2
      title={store?.name}
      onBack={() => navigate(-1)}
    >
      <Flex vertical align="end" gap={theme.custom.spacing.medium}>
        <Segmented
          options={segmentedOptions}
          value={selectedTab}
          onChange={(value) => {
            setSelectedTab(value);
          }}
          style={{
            backgroundColor: theme.custom.colors.background.light,
            padding: theme.custom.spacing.xxsmall,
          }}
          size="large"
          shape="round"
        />

        {selectedTab === 'information' && (
          <>
            <DetailSection store={store} />
            <PaymentMethodSection store={store} />
          </>
        )}

        {selectedTab === 'controllers' && <ControllerListSection store={store} />}
        {selectedTab === 'machines' && <MachineListSection store={store} />}
      </Flex>
    </PortalLayoutV2>
  );
};
