import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Flex } from 'antd';

import {
  CheckCircle,
  AddCircle,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { type PromotionCondition } from '@shared/types/promotion/PromotionCondition';
import { type PromotionMetadataConditionOption } from '@shared/types/promotion/PromotionMetadata';

import { BaseModal } from '@shared/components/BaseModal';

import {
  ConditionItemCard,
  ConditionModalContent,
  PromotionBaseHeader,
} from '../../components';

import { buildConditionDescription } from '../../helpers';

interface Props {
  conditions: PromotionCondition[];
  conditionOptions: PromotionMetadataConditionOption[];
  onChange: (conditions: PromotionCondition[]) => void;
}

export const ConditionEditSection: React.FC<Props> = ({ conditions, conditionOptions, onChange }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const primaryColor = theme.custom.colors.info.default;

  const [showModal, setShowModal] = useState(false);
  const [selectedConditionIndex, setSelectedConditionIndex] = useState<number | undefined>(undefined);
  const [selectedCondition, setSelectedCondition] = useState<PromotionCondition | undefined>(undefined);

  const handleOnDelete = (index: number) => {
    const newConditions = [...conditions];
    newConditions.splice(index, 1);
    onChange(newConditions);
  };

  const handleOnEdit = (index: number, condition: PromotionCondition) => {
    const newConditions = [...conditions];
    newConditions[index] = condition;
    onChange(newConditions); 
  };
  
  const handleOnAdd = (condition: PromotionCondition) => {
    onChange([...conditions, condition]);
  };

  const onOpenEdit = (index: number, condition: PromotionCondition) => {
    setSelectedConditionIndex(index);
    setSelectedCondition(condition);
    setShowModal(true);
  };

  const onOpenAdd = () => {
    setSelectedCondition(undefined);
    setShowModal(true);
  };

  useEffect(() => {
    console.log('conditionOptions in condition edit section', conditionOptions);
  }, [conditionOptions]);

  return (
    <Flex vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <PromotionBaseHeader
        title={t('common.conditions')}
        icon={<CheckCircle weight='BoldDuotone' size={24} color={primaryColor} />}
        style={{ marginBottom: theme.custom.spacing.small }}
      />

      {conditions.map((condition, index) => (
        <ConditionItemCard
          title={t(`promotionCampaign.condition_types.${condition.type}`)}
          description={buildConditionDescription(condition, t)}
          onEdit={() => onOpenEdit(index, condition)}
          onDelete={() => handleOnDelete(index)}
        />
      ))}

      <Button
        type="dashed"
        icon={<AddCircle weight='Outline' size={18} color={primaryColor} />}
        onClick={onOpenAdd}
        style={{ width: '100%' }}
      >
        {t('common.addCondition')}
      </Button>

      <BaseModal
        isModalOpen={showModal}
        setIsModalOpen={setShowModal}
        onCancel={() => setShowModal(false)}
      >
        {selectedCondition ? (
          <ConditionModalContent
            index={selectedConditionIndex}
            condition={selectedCondition}
            conditionOptions={conditionOptions}
            onSave={(index, condition) => {
              if (index === undefined) return;

              handleOnEdit(index, condition);
              setShowModal(false);
            }}
            onCancel={() => {
              setShowModal(false);
              setSelectedCondition(undefined);
            }}
          />
        ) : (
          <ConditionModalContent
            conditionOptions={conditionOptions}
            onSave={(_, condition) => {
              handleOnAdd(condition);
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
