import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, Typography } from 'antd';

import { AddCircle } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';
import { Box } from '@shared/components/Box';

import { FirmwareListTable } from './Table';

export const FirmwareListPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <PortalLayout>
      <Typography.Title level={2}>{t('common.firmware')}</Typography.Title>

      <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
        <LeftRightSection
          left={null}
          right={(
            <Flex justify="end" gap={theme.custom.spacing.medium}>
              <Button
                type="primary"
                icon={<AddCircle color={theme.custom.colors.text.inverted} />}
                onClick={() => navigate('/firmwares/add')}
              >
                {t('common.addNewVersion')}
              </Button>
            </Flex>
          )}
        />

        <FirmwareListTable />
      </Box>
    </PortalLayout >
  );
};
