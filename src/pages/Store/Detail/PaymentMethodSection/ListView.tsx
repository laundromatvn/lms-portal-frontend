import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Flex, List, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { PaymentMethodEnum } from '@shared/enums/PaymentMethodEnum';
import { PaymentProviderEnum } from '@shared/enums/PaymentProviderEnum';

import { type Store } from '@shared/types/store';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { QRVNPAYDetails } from '@shared/components/PaymentMethodDetails/QRVNPAYDetails';
import { CardVNPAYDetails } from '@shared/components/PaymentMethodDetails/CardVNPAYDetails';
import { DynamicTag } from '@shared/components/DynamicTag';

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
          <List.Item
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: theme.custom.spacing.small,
              width: '100%',
              padding: theme.custom.spacing.medium,
              marginBottom: theme.custom.spacing.medium,
              backgroundColor: theme.custom.colors.background.light,
              borderRadius: theme.custom.radius.medium,
              border: `1px solid ${theme.custom.colors.neutral[200]}`,
            }}
          >
            <Flex justify="space-between" align="center" wrap="wrap" gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
              <Typography.Text strong>
                {`${t(`common.${paymentMethod.payment_method.toLowerCase()}`)} - ${t(`common.${paymentMethod.payment_provider.toLowerCase()}`)}`}
              </Typography.Text>

              <DynamicTag value={paymentMethod.is_enabled ? 'enabled' : 'disabled'} />
            </Flex>

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
