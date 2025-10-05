import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@shared/theme/useTheme';

import { type Store } from '@shared/types/store';

import { Box } from '@shared/components/Box';
import { DataWrapper } from '@shared/components/DataWrapper';
import { DynamicTag } from '@shared/components/DynamicTag';
import { Table, Typography } from 'antd';

interface Props {
  store: Store;
}

export const PaymentMethodSection: React.FC<Props> = ({ store }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const columns = [
    { title: t('common.paymentMethod'), dataIndex: 'payment_method' },
    { title: t('common.bankCode'), dataIndex: 'details.bank_code' },
    { title: t('common.bankName'), dataIndex: 'details.bank_name' },
    { title: t('common.bankAccountNumber'), dataIndex: 'details.bank_account_number' },
    { title: t('common.bankAccountName'), dataIndex: 'details.bank_account_name' },
  ];

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <Typography.Title level={3}>Payment Methods</Typography.Title>

      <Table
        dataSource={store.payment_methods.map((paymentMethod) => ({
          payment_method: paymentMethod.payment_method,
          bank_code: paymentMethod.details.bank_code,
          bank_name: paymentMethod.details.bank_name,
          bank_account_number: paymentMethod.details.bank_account_number,
          bank_account_name: paymentMethod.details.bank_account_name,
        }))}
        columns={columns}
        style={{ width: '100%' }}
      />
    </Box>
  );
};
