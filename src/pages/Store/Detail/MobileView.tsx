import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Flex, Segmented } from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { useCan } from '@shared/hooks/useCan';

import { type Store } from '@shared/types/store';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';

import { DetailSection } from './DetailSection';
import { PaymentMethodSection } from './PaymentMethodSection';
import { ControllerListSection } from './ControllerListSection';
import { MachineListSection } from './MachineListSection';

export interface Props {
  store: Store;
}

export const MobileView: React.FC<Props> = ({ store }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const can = useCan();

  const segmentedOptions = [
    {
      label: t('store.details.information'),
      value: 'information',
      permission: 'store.get',
    },
    {
      label: t('store.details.controllers'),
      value: 'controllers',
      permission: 'controller.list',
    },
    {
      label: t('store.details.machines'),
      value: 'machines',
      permission: 'machine.list',
    },
  ];

  const filteredSegmentedOptions = segmentedOptions.filter((option) => !option.permission || can(option.permission));

  const [selectedTab, setSelectedTab] = useState<string>(filteredSegmentedOptions[0].value);

  return (
    <PortalLayoutV2
      title={store?.name}
      onBack={() => navigate(-1)}
    >
      <Flex vertical align="end" gap={theme.custom.spacing.medium}>
        <Segmented
          options={filteredSegmentedOptions}
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
            {can('store.get') && <DetailSection store={store} />}
            {can('store.get_payment_methods') && <PaymentMethodSection store={store} />}
          </>
        )}

        {selectedTab === 'controllers' && can('controller.list') && <ControllerListSection store={store} />}
        {selectedTab === 'machines' && can('machine.list') && <MachineListSection store={store} />}
      </Flex>
    </PortalLayoutV2>
  );
};
