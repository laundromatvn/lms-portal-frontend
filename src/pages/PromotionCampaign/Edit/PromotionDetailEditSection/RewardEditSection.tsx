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

import { BaseModal } from '@shared/components/BaseModal';

import {
  RewardItemCard,
  RewardModalContent,
  PromotionBaseHeader,
} from '../../components';

interface Props {
  rewardOptions: PromotionMetadataRewardOption[];
  rewards: PromotionReward[];
  onChange: (rewards: PromotionReward[]) => void;
}

  export const RewardEditSection: React.FC<Props> = ({ rewardOptions, rewards, onChange }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const primaryColor = theme.custom.colors.success.default;

  const [showModal, setShowModal] = useState(false);
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
    setShowModal(true);
  };

  const onOpenAdd = () => {
    setSelectedReward(undefined);
    setShowModal(true);
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

      <BaseModal
        isModalOpen={showModal}
        setIsModalOpen={setShowModal}
        onCancel={() => setShowModal(false)}
      >
        {selectedReward ? (
          <RewardModalContent
            rewardOptions={rewardOptions}
            index={selectedRewardIndex}
            reward={selectedReward}
            onSave={(index, reward) => {
              if (index === undefined) return;

              handleOnEdit(index, reward);
              setShowModal(false);
            }}
            onCancel={() => {
              setShowModal(false);
              setSelectedReward(undefined);
            }}
          />
        ) : (
          <RewardModalContent
            rewardOptions={rewardOptions}
            onSave={(_, reward) => {
              handleOnAdd(reward);
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
