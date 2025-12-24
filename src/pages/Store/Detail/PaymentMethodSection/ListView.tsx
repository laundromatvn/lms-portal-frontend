import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Flex, List, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { PaymentMethodEnum } from '@shared/enums/PaymentMethodEnum';
import { PaymentProviderEnum } from '@shared/enums/PaymentProviderEnum';

import { type Store } from '@shared/types/store';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DynamicTag } from '@shared/components/DynamicTag';
import { QRVNPAYDetails } from '@shared/components/PaymentMethodDetails/QRVNPAYDetails';
import { CardVNPAYDetails } from '@shared/components/PaymentMethodDetails/CardVNPAYDetails';
import { QRVietQRDetails } from '@shared/components/PaymentMethodDetails/QRVietQRDetails';

interface Props {
  store: Store;
}

export const ListView: React.FC<Props> = ({ store }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <BaseDetailSection title={t('common.paymentMethod')} onEdit={() => navigate(`/stores/${store.id}/edit`)}>
      <List
        dataSource={store.payment_methods}
        style={{ width: '100%' }}
        renderItem={(paymentMethod) => (
          <List.Item style={{ width: '100%' }}>
            {paymentMethod.payment_method === PaymentMethodEnum.QR
              && paymentMethod.payment_provider === PaymentProviderEnum.VIET_QR
              && <QRVietQRDetails paymentMethod={paymentMethod} />}

            {paymentMethod.payment_method === PaymentMethodEnum.QR
              && paymentMethod.payment_provider === PaymentProviderEnum.VNPAY
              && <QRVNPAYDetails paymentMethod={paymentMethod} />}

            {(paymentMethod.payment_method === PaymentMethodEnum.CARD
              && paymentMethod.payment_provider === PaymentProviderEnum.VNPAY)
              && <CardVNPAYDetails paymentMethod={paymentMethod} />}
          </List.Item>
        )}
      />
    </BaseDetailSection>
  );
};
