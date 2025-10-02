import React from 'react';
import { Routes, Route as ReactRoute } from 'react-router-dom';

export interface Route {
  path: string;
  component: React.ReactNode;
}

interface AppRouterProps {
  routes: Route[];
}

const AppRouter: React.FC<AppRouterProps> = ({ routes }) => {
  return (
    <Routes>
      {routes.map((route, index) => (
        <ReactRoute key={index} path={route.path} element={route.component} />
      ))}
    </Routes>
  );
};

export default AppRouter;
