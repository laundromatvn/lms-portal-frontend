import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Flex } from 'antd';

import {
  CloseCircle,
  AddCircle,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { type PromotionLimit } from '@shared/types/promotion/PromotionLimit';
import { type PromotionMetadataLimitOption } from '@shared/types/promotion/PromotionMetadata';

import {
  LimitItemCard,
  PromotionBaseHeader,
} from '../../components/Modals';
import { LimitDrawer } from '../../components/Drawers/LimitDrawer';

interface Props {
  limitOptions: PromotionMetadataLimitOption[];
  limits: PromotionLimit[];
  onChange: (limits: PromotionLimit[]) => void;
}

export const LimitEditSection: React.FC<Props> = ({ limitOptions, limits, onChange }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const primaryColor = theme.custom.colors.warning.default;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
    setIsDrawerOpen(true);
  };

  const onOpenAdd = () => {
    setSelectedLimitIndex(undefined);
    setSelectedLimit(undefined);
    setIsDrawerOpen(true);
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

      <LimitDrawer
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedLimit(undefined);
          setSelectedLimitIndex(undefined);
        }}
        index={selectedLimitIndex}
        limit={selectedLimit}
        limitOptions={limitOptions}
        onSave={(index, limit) => {
          if (index !== undefined) {
            handleOnEdit(index, limit);
          } else {
            handleOnAdd(limit);
          }
        }}
      />
    </Flex>
  );
};
