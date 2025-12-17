import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Flex } from 'antd';

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

export const StoreDetailDesktopView: React.FC<Props> = ({ store }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <PortalLayoutV2
      title={store?.name}
      onBack={() => navigate(-1)}
    >
      <Flex vertical align="end" gap={theme.custom.spacing.medium}>
        <DetailSection store={store} />
        <PaymentMethodSection store={store} />
        <ControllerListSection store={store} />
        <MachineListSection store={store} />
      </Flex>
    </PortalLayoutV2>
  );
};
