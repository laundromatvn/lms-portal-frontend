import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Steps,
  Flex,
  Button,
} from 'antd';

import { AltArrowLeft } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { type User } from '@shared/types/user';
import { type Tenant } from '@shared/types/tenant';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';

import { AddTenantOwnerInformation } from './components/AddTenantOwnerInformation';
import { AddTenantInformation } from './components/AddTenantInformation';
import { AddTenantMember } from './components/AddTenantMember';

export const DesktopView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [newTenantOwner, setNewTenantOwner] = useState<User>();
  const [newTenant, setNewTenant] = useState<Tenant>();

  const steps = [
    {
      title: t('tenant.ownerAccount'),
    },
    {
      title: t('tenant.tenantInformation'),
    },
    {
      title: t('tenant.finish'),
    },
  ];

  return (
    <PortalLayoutV2
      title={t('tenant.newTenant')}
      onBack={() => navigate(-1)}
    >
      <Steps
        size="small"
        current={currentStep}
        items={steps}
      />

      <Flex
        vertical
        gap={theme.custom.spacing.medium}
        style={{
          height: '100%',
          width: '100%',
          marginTop: theme.custom.spacing.medium,
        }}
      >
        <Flex align="center" gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
          <Button
            type="text"
            onClick={() => setCurrentStep(currentStep - 1)}
            icon={<AltArrowLeft />}
          >
            {t('common.back')}
          </Button>
        </Flex>

        {currentStep === 0 && (
          <AddTenantOwnerInformation onSave={(newTenantOwner: User) => {
            setNewTenantOwner(newTenantOwner);
            setCurrentStep(1);
          }} />
        )}
        {currentStep === 1 && newTenantOwner && (
          <AddTenantInformation
            newTenantOwner={newTenantOwner}
            onSave={(tenant: Tenant) => {
              setNewTenant(tenant);
              setCurrentStep(2);
            }}
          />
        )}

        {currentStep === 2 && newTenantOwner && newTenant && (
          <AddTenantMember
            newTenantMemberId={newTenantOwner.id}
            newTenantId={newTenant.id}
            onSave={() => { }}
          />
        )}
      </Flex>
    </PortalLayoutV2>
  );
};
