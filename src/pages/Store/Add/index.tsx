import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Button,
  Flex,
  Typography,
  Skeleton,
  notification,
  type FormInstance,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';
import { AddSection } from '../Add/AddSection';

export const StoreAddPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  return (
    <PortalLayout>
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
        <Typography.Title level={2}>Store Add</Typography.Title>

        <LeftRightSection
          left={null}
          right={null}
        />

        <AddSection
          onSuccess={() => {
            api.success({
              message: t('messages.createStoreSuccess'),
            });
            navigate('/stores');
          }}
          onError={() => {
            api.error({
              message: t('messages.createStoreError'),
            });
          }}
        />
      </Flex>
    </PortalLayout>
  );
};
