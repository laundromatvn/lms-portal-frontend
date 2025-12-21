import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Progress,
  Typography,
  notification,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { useCreateTenantMemberApi } from '@shared/hooks/useCreateTenantMemberApi';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { Box } from '@shared/components/Box';

export type AddTenantMemberProps = {
  newTenantMemberId: string;
  newTenantId: string;
  onSave: () => void;
}

export const AddTenantMember: React.FC<AddTenantMemberProps> = ({
  newTenantMemberId,
  newTenantId,
  onSave,
}: AddTenantMemberProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const [percent, setPercent] = useState(0);

  const {
    createTenantMember,
    data: createTenantMemberData,
    error: createTenantMemberError,
  } = useCreateTenantMemberApi();

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(percent + 10);
    }, 200);

    if (percent === 100) {
      onSave();
      createTenantMember({
        user_id: newTenantMemberId,
        tenant_id: newTenantId,
      });
    }

    return () => clearInterval(interval);
  }, [percent]);

  useEffect(() => {
    if (createTenantMemberData) {
      navigate(`/tenants/${newTenantId}/detail`);
    }
  }, [createTenantMemberData]);

  useEffect(() => {
    if (createTenantMemberError) {
      api.error({
        message: t('tenant.message.createTenantMemberError'),
      });
    }
  }, [createTenantMemberError]);

  return (
    <BaseDetailSection>
      {contextHolder}

      <Box
        vertical
        justify="center"
        align="center"
        gap={theme.custom.spacing.medium}
        style={{
          width: '100%',
          height: '100%',
          padding: theme.custom.spacing.medium,
          backgroundColor: theme.custom.colors.success.light,
        }}
      >
        <Progress
          percent={percent}
          type="circle"
          size={100}
          strokeColor={theme.custom.colors.success.default}
          trailColor={theme.custom.colors.success.light}
        />

        <Typography.Text>
          {t('tenant.pleaseWaitABit')}
        </Typography.Text>

        <Typography.Text>
          {t('tenant.weAreSettingUpYourAccount')}
        </Typography.Text>
      </Box>
    </BaseDetailSection>
  );
};