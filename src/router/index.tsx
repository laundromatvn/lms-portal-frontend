import React from 'react';
import { Routes, Route as ReactRoute } from 'react-router-dom';
import { SubscriptionGuard } from '@shared/components/SubscriptionGuard';

export interface Route {
  path: string;
  component: React.ReactNode;
}

interface AppRouterProps {
  routes: Route[];
}

const AppRouter: React.FC<AppRouterProps> = ({ routes }) => {
  return (
    <SubscriptionGuard>
      <Routes>
        {routes.map((route, index) => (
          <ReactRoute key={index} path={route.path} element={route.component} />
        ))}
      </Routes>
    </SubscriptionGuard>
  );
};

export default AppRouter;
