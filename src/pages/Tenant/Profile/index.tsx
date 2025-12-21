import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { tenantStorage } from '@core/storage/tenantStorage';

export const TenantProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const tenant = tenantStorage.load();

  useEffect(() => {
    if (tenant) {
      navigate(`/tenants/${tenant.id}/detail`);
    }
  }, [tenant]);

  return null;
};
