import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Flex,
  Segmented,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import { type User } from '@shared/types/user';

import { AddTenantAdminUser } from './AddTenantAdminUser';
import { SelectExistingUser } from './SelectExistingUser';

interface Props {
  onSave: (newTenantOwner: User) => void;
}

export const AddTenantOwnerInformation: React.FC<Props> = ({ onSave }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useIsMobile();

  const segmentedOptions = [
    { label: t('tenant.newUser'), value: 'create' },
    { label: t('tenant.existingUser'), value: 'select' },
  ];

  const [selectedTab, setSelectedTab] = useState<string>(segmentedOptions[0].value);

  return (
    <Flex
      vertical
      gap={theme.custom.spacing.medium}
      style={{ width: '100%' }}
    >
      <Flex justify={isMobile ? 'flex-end' : 'flex-start'}>
        <Segmented
          size="large"
          options={segmentedOptions}
          value={selectedTab}
          onChange={(value) => setSelectedTab(value)}
          style={{
            backgroundColor: theme.custom.colors.background.light,
            padding: theme.custom.spacing.xxsmall,
            width: 'fit-content',
          }}
        />
      </Flex>

      {selectedTab === 'create' && (
        <AddTenantAdminUser onSave={onSave} />
      )}

      {selectedTab === 'select' && (
        <SelectExistingUser onSave={onSave} />
      )}
    </Flex>
  )
};
