import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { type Store } from '@shared/types/store';
import { type PaymentMethod } from '@shared/types/PaymentMethod';

import { BaseEditSection } from '@shared/components/BaseEditSection';

import { PaymentMethodDetailItem } from './PaymentMethodDetailItem';
import { NewPaymentMethodItem } from './NewPaymentMethodItem';
import { EditPaymentMethodItem } from './EditPaymentMethodItem';

interface Props {
  store: Store;
  onChange: (values: any) => void;
  onSave: () => void;
}

export const PaymentMethodEditSection: React.FC<Props> = ({ store, onChange, onSave }: Props) => {
  const { t } = useTranslation();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(store.payment_methods || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    setPaymentMethods(store.payment_methods || []);
  }, [store.payment_methods]);

  const handleAddPaymentMethod = (newPaymentMethod: PaymentMethod) => {
    const updatedPaymentMethods = [...paymentMethods, newPaymentMethod];
    setPaymentMethods(updatedPaymentMethods);
    
    onChange({
      payment_methods: updatedPaymentMethods,
    });

    setShowAddForm(false);
  };

  const handleRemovePaymentMethod = (index: number) => {
    const updatedPaymentMethods = paymentMethods.filter((_, i) => i !== index);
    setPaymentMethods(updatedPaymentMethods);
    
    onChange({
      payment_methods: updatedPaymentMethods,
    });
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
  };

  const handleEditPaymentMethod = (index: number) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (index: number, updatedPaymentMethod: PaymentMethod) => {
    const updatedPaymentMethods = [...paymentMethods];
    updatedPaymentMethods[index] = updatedPaymentMethod;
    setPaymentMethods(updatedPaymentMethods);
    
    onChange({
      payment_methods: updatedPaymentMethods,
    });

    setEditingIndex(null);
  };

  const handleCancelEdit = (index: number) => {
    setEditingIndex(null);
  };

  return (
    <BaseEditSection title={t('common.paymentMethod')} onSave={onSave}>
      {paymentMethods.map((paymentMethod, index) => {
        if (editingIndex === index) {
          return (
            <EditPaymentMethodItem
              key={index}
              paymentMethod={paymentMethod}
              index={index}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
            />
          );
        }

        return (
          <PaymentMethodDetailItem
            key={index}
            paymentMethod={paymentMethod}
            index={index}
            onRemove={handleRemovePaymentMethod}
            onEdit={handleEditPaymentMethod}
          />
        );
      })}

      {showAddForm && (
        <NewPaymentMethodItem
          paymentMethods={paymentMethods}
          onAdd={handleAddPaymentMethod}
          onCancel={handleCancelAdd}
        />
      )}

      {!showAddForm && (
        <Button
          type="dashed"
          size="large"
          style={{ width: '100%' }}
          icon={<PlusOutlined />}
          onClick={() => setShowAddForm(true)}
        >
          {t('common.addPaymentMethod')}
        </Button>
      )}
    </BaseEditSection>
  );
};
