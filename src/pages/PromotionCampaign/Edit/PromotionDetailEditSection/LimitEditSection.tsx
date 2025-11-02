import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Flex } from 'antd';

import {
  CloseCircle,
  AddCircle,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { type PromotionLimit } from '@shared/types/promotion/PromotionLimit';

import {
  LimitItemCard,
  LimitModalContent,
  PromotionBaseHeader,
} from '../../components';
import { BaseModal } from '@shared/components/BaseModal';

interface Props {
  limits: PromotionLimit[];
  onChange: (limits: PromotionLimit[]) => void;
}

export const LimitEditSection: React.FC<Props> = ({ limits, onChange }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const primaryColor = theme.custom.colors.danger.default;

  const [showModal, setShowModal] = useState(false);
  const [selectedLimitIndex, setSelectedLimitIndex] = useState<number | undefined>(undefined);
  const [selectedLimit, setSelectedLimit] = useState<PromotionLimit | undefined>(undefined);

  const handleOnDelete = (index: number) => {
    const newLimits = [...limits];
    newLimits.splice(index, 1);
    onChange(newLimits);
  };

  const handleOnEdit = (index: number, limit: PromotionLimit) => {
    const newLimits = [...limits];
    newLimits[index] = limit;
    onChange(newLimits);
  };

  const handleOnAdd = (limit: PromotionLimit) => {
    onChange([...limits, limit]);
  };

  const onOpenEdit = (index: number, limit: PromotionLimit) => {
    setSelectedLimitIndex(index);
    setSelectedLimit(limit);
    setShowModal(true);
  };

  const onOpenAdd = () => {
    setSelectedLimit(undefined);
    setShowModal(true);
  };

  return (
    <Flex vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <PromotionBaseHeader
        title={t('common.limits')}
        icon={<CloseCircle weight='BoldDuotone' size={24} color={primaryColor} />}
        style={{ marginBottom: theme.custom.spacing.small }}
      />

      {limits.map((limit, index) => (
        <LimitItemCard
          key={index}
          limit={limit}
          onEdit={() => onOpenEdit(index, limit)}
          onDelete={() => handleOnDelete(index)}
        />
      ))}

      <Button
        type="dashed"
        icon={<AddCircle weight='Outline' size={18} color={primaryColor} />}
        onClick={onOpenAdd}
        style={{ width: '100%' }}
      >
        {t('common.addLimit')}
      </Button>

      <BaseModal
        isModalOpen={showModal}
        setIsModalOpen={setShowModal}
        onCancel={() => setShowModal(false)}
      >
        {selectedLimit ? (
          <LimitModalContent
            index={selectedLimitIndex}
            limit={selectedLimit}
            onSave={(index, limit) => {
              if (index === undefined) return;

              handleOnEdit(index, limit);
              setShowModal(false);
            }}
            onCancel={() => {
              setShowModal(false);
              setSelectedLimit(undefined);
            }}
          />
        ) : (
          <LimitModalContent
            onSave={(_, limit) => {
              handleOnAdd(limit);
              setShowModal(false);
            }}
            onCancel={() => {
              setShowModal(false);
            }}
          />
        )}
      </BaseModal>
    </Flex>
  );
};
