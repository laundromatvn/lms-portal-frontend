import React from 'react';
import { useTranslation } from 'react-i18next';

import { Card, Space, Typography, Flex, Button } from 'antd';

import { TrashBinTrash, PenNewSquare } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { type PaymentMethod } from '@shared/types/PaymentMethod';
import { PaymentMethodEnum } from '@shared/enums/PaymentMethodEnum';

interface Props {
  paymentMethod: PaymentMethod;
  index: number;
  onRemove: (index: number) => void;
  onEdit: (index: number) => void;
}

export const PaymentMethodDetailItem: React.FC<Props> = ({
  paymentMethod,
  index,
  onRemove,
  onEdit
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const headerBackgroundCardColor = () => {
    switch (paymentMethod.payment_method) {
      case PaymentMethodEnum.CARD:
        return theme.custom.colors.success[100];
      case PaymentMethodEnum.QR:
        return theme.custom.colors.info[100];
      default:
        return theme.custom.colors.neutral.default;
    }
  };

  return (
    <Card
      title={<Typography.Text strong>{paymentMethod.payment_method}</Typography.Text>}
      extra={<Space>
        <Button type="link" icon={<PenNewSquare />} onClick={() => onEdit(index)} />
        <Button type="link" danger icon={<TrashBinTrash />} onClick={() => onRemove(index)} />
      </Space>}
      style={{ width: '100%' }}
      headStyle={{ backgroundColor: headerBackgroundCardColor() }}
      size="small"
    >
      <Flex vertical gap={theme.custom.spacing.medium}>
        <Typography.Text>{t('common.bankCode')}: {paymentMethod.details.bank_code}</Typography.Text>
        <Typography.Text>{t('common.bankName')}: {paymentMethod.details.bank_name}</Typography.Text>
        <Typography.Text>{t('common.bankAccountNumber')}: {paymentMethod.details.bank_account_number}</Typography.Text>
        <Typography.Text>{t('common.bankAccountName')}: {paymentMethod.details.bank_account_name}</Typography.Text>
      </Flex>
    </Card>
  );
};
