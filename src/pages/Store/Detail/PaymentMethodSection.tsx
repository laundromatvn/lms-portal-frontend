import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Table } from 'antd';

import { type Store } from '@shared/types/store';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';

interface Props {
  store: Store;
}

export const PaymentMethodSection: React.FC<Props> = ({ store }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns = [
    { title: t('common.paymentMethod'), dataIndex: 'payment_method', width: 48 },
    { title: t('common.bankCode'), dataIndex: 'bank_code', width: 48 },
    { title: t('common.bankName'), dataIndex: 'bank_name', width: 256 },
    { title: t('common.bankAccountNumber'), dataIndex: 'bank_account_number', width: 256 },
    { title: t('common.bankAccountName'), dataIndex: 'bank_account_name', width: 256 },
  ];

  return (
    <BaseDetailSection title={t('common.paymentMethod')} onEdit={() => navigate(`/stores/${store.id}/edit`)}>
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
        pagination={false}
      />
    </BaseDetailSection>
  );
};
