import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, Typography } from 'antd';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';

export const StoreListPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <PortalLayout>
      <Flex vertical style={{ height: '100%' }}>
        <Typography.Title level={2}>Store List</Typography.Title>
        <Typography.Text type="secondary">
          {t('messages.thisPageWillBeUpdatedSoon')}
        </Typography.Text>

        <LeftRightSection
          left={null}
          right={(<>
            <Button type="primary" size="large" onClick={() => navigate('/stores/add')}>{t('common.add')}</Button>
          </>)}
        />
      </Flex>
    </PortalLayout>
  );
};
