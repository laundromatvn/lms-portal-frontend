import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Flex } from 'antd';

import {
  Gift,
  AddCircle,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { type PromotionReward } from '@shared/types/promotion/PromotionReward';
import { type PromotionMetadataRewardOption } from '@shared/types/promotion/PromotionMetadata';

import {
  RewardItemCard,
  PromotionBaseHeader,
} from '../../components/Modals';
import { RewardDrawer } from '../../components/Drawers/RewardDrawer';

interface Props {
  rewardOptions: PromotionMetadataRewardOption[];
  rewards: PromotionReward[];
  onChange: (rewards: PromotionReward[]) => void;
}

export const RewardAddSection: React.FC<Props> = ({ rewardOptions, rewards, onChange }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const primaryColor = theme.custom.colors.success.default;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRewardIndex, setSelectedRewardIndex] = useState<number | undefined>(undefined);
  const [selectedReward, setSelectedReward] = useState<PromotionReward | undefined>(undefined);

  const handleOnDelete = (index: number) => {
    const newRewards = [...rewards];
    newRewards.splice(index, 1);
    onChange(newRewards);
  };

  const handleOnEdit = (index: number, reward: PromotionReward) => {
    const newRewards = [...rewards];
    newRewards[index] = reward;
    onChange(newRewards);
  };

  const handleOnAdd = (reward: PromotionReward) => {
    onChange([...rewards, reward]);
  };

  const onOpenEdit = (index: number, reward: PromotionReward) => {
    setSelectedRewardIndex(index);
    setSelectedReward(reward);
    setIsDrawerOpen(true);
  };

  const onOpenAdd = () => {
    setSelectedRewardIndex(undefined);
    setSelectedReward(undefined);
    setIsDrawerOpen(true);
  };

  return (
    <Flex vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <PromotionBaseHeader
        title={t('common.rewards')}
        icon={<Gift weight='BoldDuotone' size={24} color={primaryColor} />}
        style={{ marginBottom: theme.custom.spacing.small }}
      />

      {rewards.map((reward, index) => (
        <RewardItemCard
          key={index}
          reward={reward}
          onEdit={() => onOpenEdit(index, reward)}
          onDelete={() => handleOnDelete(index)}
        />
      ))}

      <Button
        type="dashed"
        icon={<AddCircle weight='Outline' size={18} color={primaryColor} />}
        onClick={onOpenAdd}
        style={{ width: '100%' }}
      >
        {t('common.addReward')}
      </Button>

      <RewardDrawer
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedReward(undefined);
          setSelectedRewardIndex(undefined);
        }}
        index={selectedRewardIndex}
        reward={selectedReward}
        rewardOptions={rewardOptions}
        onSave={(index, reward) => {
          if (index !== undefined) {
            handleOnEdit(index, reward);
          } else {
            handleOnAdd(reward);
          }
        }}
      />
    </Flex>
  );
};

