import React from 'react';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import type { Controller } from '@shared/types/Controller';

import { ListView } from './ListView';
import { TableView } from './TableView';

interface Props {
  controller: Controller;
}

export const MachineSection: React.FC<Props> = ({ controller }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <ListView controller={controller} />;
  }

  return <TableView controller={controller} />;
};
