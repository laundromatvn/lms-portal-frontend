import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Flex,
  notification,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';

import { AddSection } from '../Add/AddSection';

export const StoreAddPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  return (
    <PortalLayoutV2
      title={t('common.addStore')}
      onBack={() => navigate(-1)}
    >
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
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
    </PortalLayoutV2>
  );
};
