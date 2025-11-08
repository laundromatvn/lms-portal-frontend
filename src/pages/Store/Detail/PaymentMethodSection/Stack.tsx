import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Dropdown, Typography } from 'antd';

import { MenuDots, PenNewSquare } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { PaymentMethodEnum } from '@shared/enums/PaymentMethodEnum';

import { type Store } from '@shared/types/store';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { Stack, StackCard } from '@shared/components/Stack';
import { QRDetails } from '@shared/components/PaymentMethodDetails/QRDetails';

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
              <Typography.Text strong>
                {t(`common.${paymentMethod.payment_method.toLowerCase()}`)}
              </Typography.Text>
            </StackCard.Header>

            <StackCard.Content>
              {paymentMethod.payment_method === PaymentMethodEnum.QR && <QRDetails paymentMethod={paymentMethod} />}
            </StackCard.Content>

            <StackCard.Action>
              <Dropdown
                menu={{
                  items: [
                    {
                      label: t('common.edit'),
                      key: 'edit',
                      icon: <PenNewSquare />,
                      onClick: () => navigate(`/stores/${store.id}/edit`),
                    },
                  ]
                }}
                trigger={['click']}
                popupRender={(menu) => (
                  <div style={{ width: 200 }}>
                    {menu}
                  </div>
                )}
              >
                <Button type="text" icon={<MenuDots weight="Bold" />} />
              </Dropdown>
            </StackCard.Action>
          </StackCard>
        )}
      />
    </BaseDetailSection>
  );
};
