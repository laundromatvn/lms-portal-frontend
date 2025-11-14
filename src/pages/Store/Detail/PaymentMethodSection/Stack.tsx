import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Flex, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { PaymentMethodEnum } from '@shared/enums/PaymentMethodEnum';
import { PaymentProviderEnum } from '@shared/enums/PaymentProviderEnum';

import { type Store } from '@shared/types/store';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { Stack, StackCard } from '@shared/components/Stack';
import { QRDetails } from '@shared/components/PaymentMethodDetails/QRDetails';
import { CardVNPAYDetails } from '@shared/components/PaymentMethodDetails/CardVNPAYDetails';
import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  store: Store;
}

export const PaymentMethodStackView: React.FC<Props> = ({ store }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <BaseDetailSection title={t('common.paymentMethod')} onEdit={() => navigate(`/stores/${store.id}/edit`)}>
      <Stack
        data={store.payment_methods}
        renderItem={(paymentMethod) => (
          <StackCard>
            <StackCard.Header>
              <Flex justify="space-between" align="center" wrap="wrap" gap={theme.custom.spacing.xsmall}>
                <Typography.Text strong>
                  {`${t(`common.${paymentMethod.payment_method.toLowerCase()}`)} - ${t(`common.${paymentMethod.payment_provider.toLowerCase()}`)}`}
                </Typography.Text>

                <DynamicTag value={paymentMethod.is_enabled ? 'enabled' : 'disabled'} />
              </Flex>
            </StackCard.Header>

            <StackCard.Content>
              {paymentMethod.payment_method === PaymentMethodEnum.QR
                && <QRDetails paymentMethod={paymentMethod} />}
              {(paymentMethod.payment_method === PaymentMethodEnum.CARD
                && paymentMethod.payment_provider === PaymentProviderEnum.VNPAY)
                && <CardVNPAYDetails paymentMethod={paymentMethod} />}
            </StackCard.Content>
          </StackCard>
        )}
      />
    </BaseDetailSection>
  );
};
