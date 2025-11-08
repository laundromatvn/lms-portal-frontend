import React from 'react';

import { type Store } from '@shared/types/store';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import { PaymentMethodTableView } from './Table';
import { PaymentMethodStackView } from './Stack';

interface Props {
  store: Store;
}

export const PaymentMethodSection: React.FC<Props> = ({ store }: Props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <PaymentMethodStackView store={store} />;
  }

  return <PaymentMethodTableView store={store} />;
};
