import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Progress,
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

export const MobileView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [percent, setPercent] = useState(0);

  const [newTenantOwner, setNewTenantOwner] = useState<User>();
  const [newTenant, setNewTenant] = useState<Tenant>();

  return (
    <PortalLayoutV2
      title={t('tenant.newTenant')}
      onBack={() => navigate(-1)}
    >
      <Progress percent={percent} />

      <Flex
        align="center"
        gap={theme.custom.spacing.medium}
        style={{ width: '100%' }}
      >
        {currentStep > 1 && percent !== 100 && (
          <Button
            type="text"
            onClick={() => setCurrentStep(currentStep - 1)}
            icon={<AltArrowLeft />}
          >
            {t('common.back')}
          </Button>
        )}
      </Flex>

      <Flex
        vertical
        gap={theme.custom.spacing.medium}
        style={{
          height: '100%',
          width: '100%',
          marginTop: theme.custom.spacing.medium,
        }}
      >
        {currentStep === 1 && (
          <AddTenantOwnerInformation onSave={(newTenantOwner: User) => {
            setNewTenantOwner(newTenantOwner);
            setCurrentStep(2);
            setPercent(30);
          }} />  
        )}

        {currentStep === 2 && newTenantOwner && (
          <AddTenantInformation
            newTenantOwner={newTenantOwner}
            onSave={(tenant: Tenant) => {
              setNewTenant(tenant);
              setCurrentStep(3);
              setPercent(60);
            }}
          />
        )}

        {currentStep === 3 && newTenant && newTenantOwner && (
          <AddTenantMember
            newTenantMemberId={newTenantOwner.id}
            newTenantId={newTenant.id}
            onSave={() => setPercent(100)}
          />
        )}
      </Flex>
    </PortalLayoutV2>
  );
};
