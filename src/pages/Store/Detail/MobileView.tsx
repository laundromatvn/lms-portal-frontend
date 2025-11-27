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
import type { PortalStoreAccess } from '@shared/types/access/PortalStore';

export interface Props {
  store: Store;
  portalStoreAccess: PortalStoreAccess;
}

export const StoreDetailMobileView: React.FC<Props> = ({ store, portalStoreAccess }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState<string>('information');

  const segmentedOptions = [
    {
      label: t('store.details.information'),
      value: 'information',
      enabled: portalStoreAccess?.portal_store_basic_view,
    },
    {
      label: t('store.details.controllers'),
      value: 'controllers',
      enabled: portalStoreAccess?.portal_store_basic_view,
    },
    {
      label: t('store.details.machines'),
      value: 'machines',
      enabled: portalStoreAccess?.portal_store_basic_view,
    },
  ];

  return (
    <PortalLayoutV2
      title={store?.name}
      onBack={() => navigate(-1)}
    >
      <Flex vertical align="end" gap={theme.custom.spacing.medium}>
        <Segmented
          options={segmentedOptions.filter((option) => option.enabled)}
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

        {selectedTab === 'information' && portalStoreAccess?.portal_store_basic_view && (
          <>
            <DetailSection store={store} />
            <PaymentMethodSection store={store} />
          </>
        )}

        {selectedTab === 'controllers' && portalStoreAccess?.portal_store_basic_view && <ControllerListSection store={store} />}
        {selectedTab === 'machines' && portalStoreAccess?.portal_store_basic_view && <MachineListSection store={store} />}
      </Flex>
    </PortalLayoutV2>
  );
};
