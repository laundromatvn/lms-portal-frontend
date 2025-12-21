import React from 'react';

import { type Tenant } from '@shared/types/tenant';

import { DetailSection } from './DetailSection';
import { ContactInformationSection } from './ContactInformationSection';

interface Props {
  tenant: Tenant;
}

export const InformationTab: React.FC<Props> = ({ tenant }: Props) => {
  return (
    <>
      <DetailSection tenant={tenant as Tenant} />
      <ContactInformationSection tenant={tenant as Tenant} />
    </>
  );
};
