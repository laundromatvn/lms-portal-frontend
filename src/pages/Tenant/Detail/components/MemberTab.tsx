import React from 'react';

import { Flex } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type Tenant } from '@shared/types/tenant';

import { TenantMembersSection } from './TenantMembersSection';

interface Props {
  tenant: Tenant;
}

export const MemberTab: React.FC<Props> = ({ tenant }: Props) => {
  const theme = useTheme();

  return (
    <Flex vertical gap={theme.custom.spacing.medium}>
      <TenantMembersSection tenant={tenant as Tenant} />
    </Flex>
  );
};
