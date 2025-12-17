import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Flex } from 'antd';

import {
  CheckCircle,
  AddCircle,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { type PromotionCondition } from '@shared/types/promotion/PromotionCondition';
import { type PromotionMetadataConditionOption } from '@shared/types/promotion/PromotionMetadata';

import {
  ConditionItemCard,
  PromotionBaseHeader,
} from '../../components/Modals';
import { ConditionDrawer } from '../../components/Drawers/ConditionDrawer';

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

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
    setIsDrawerOpen(true);
  };

  const onOpenAdd = () => {
    setSelectedConditionIndex(undefined);
    setSelectedCondition(undefined);
    setIsDrawerOpen(true);
  };

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

      <ConditionDrawer
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedCondition(undefined);
          setSelectedConditionIndex(undefined);
        }}
        index={selectedConditionIndex}
        condition={selectedCondition}
        conditionOptions={conditionOptions}
        onSave={(index, condition) => {
          if (index !== undefined) {
            handleOnEdit(index, condition);
          } else {
            handleOnAdd(condition);
          }
        }}
      />
    </Flex>
  );
};
