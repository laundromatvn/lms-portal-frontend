import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Modal, Spin, Typography } from 'antd';

import { LoadingOutlined } from '@ant-design/icons';

import {
  MoneyBag,
  Upload,
  Bell,
  ChatSquareLike
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { Box } from '@shared/components/Box';

interface Props {
  isModalOpen: boolean;
  onPaidSuccess: () => void;
}

export const SubscriptionInvoiceProcessingModal: React.FC<Props> = ({ isModalOpen, onPaidSuccess }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [currentDescriptionIndex, setCurrentDescriptionIndex] = useState(0);

  const descriptionList = [
    t('subscription.weAreProcessingYourPayment'),
    t('subscription.yourSubscriptionPlanIsBeingUpgraded'),
    t('subscription.youWillBeNotifiedWhenTheUpgradeIsComplete'),
    t('subscription.thankYouForYourPurchase'),
  ];

  const icon = useMemo(() => {
    switch (currentDescriptionIndex) {
      case 0:
        return <MoneyBag size={48} weight='BoldDuotone' />;
      case 1:
        return <Upload size={48} weight='BoldDuotone' />;
      case 2:
        return <Bell size={48} weight='BoldDuotone' />;
      case 3:
        return <ChatSquareLike size={48} weight='BoldDuotone' />;
      default:
        return <LoadingOutlined spin />;
    }
  }, [currentDescriptionIndex, theme.custom.colors.primary.default]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset index when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setCurrentDescriptionIndex(0);
    } else {
      // Clean up when modal closes
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    // Clear any existing intervals/timeouts
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCurrentDescriptionIndex((prev: number) => {
        const nextIndex = prev + 1;
        
        // If we've reached the end of the list, clear interval and call onPaidSuccess after delay
        if (nextIndex >= descriptionList.length) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          
          // Wait 2000ms after showing the last description before calling onPaidSuccess
          timeoutRef.current = setTimeout(() => {
            onPaidSuccess();
          }, 2000);
          
          return prev; // Keep showing the last description
        }
        
        return nextIndex;
      });
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isModalOpen, descriptionList.length, onPaidSuccess]);

  const currentDescription = descriptionList[currentDescriptionIndex];

  return (
    <Modal
      open={isModalOpen}
      footer={null}
    >
      <Box
        vertical
        justify="center"
        align="center"
        gap={theme.custom.spacing.medium}
        style={{ width: '100%' }}
      >
        <Box style={{
          padding: theme.custom.spacing.large,
          color: theme.custom.colors.primary.default,
          backgroundColor: theme.custom.colors.primary.light,
        }}>
          {icon}
        </Box>

        <Flex justify="center" align="center" gap={theme.custom.spacing.medium}>
          <Spin indicator={<LoadingOutlined spin />} />

          <Typography.Text type="secondary">
            {currentDescription}
          </Typography.Text>
        </Flex>
      </Box>
    </Modal>
  );
};
