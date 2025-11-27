import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Flex,
  notification,
  Empty,
  Skeleton,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import type { PortalStoreAccess } from '@shared/types/access/PortalStore';

import { useGetAccessApi } from '@shared/hooks/access/useGetAccess';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';

import { AddSection } from '../Add/AddSection';

export const StoreAddPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const {
    getAccess,
    data: accessData,
  } = useGetAccessApi<PortalStoreAccess>();

  useEffect(() => {
    getAccess('portal_store');
  }, [getAccess]);

  return (
    <PortalLayoutV2
      title={t('common.addStore')}
      onBack={() => navigate(-1)}
    >
      {contextHolder}

      {!accessData?.portal_store_management && (
        <Empty description={t('messages.youDoNotHavePermissionToAccessThisPage')} />
      )}

      {accessData?.portal_store_management && (
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
      )}
    </PortalLayoutV2>
  );
};
