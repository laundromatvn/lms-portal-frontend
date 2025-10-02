import { HomePage } from '@pages/HomePage';

import { SignInPage } from '@pages/Auth';
import { GenerateOTPPage } from '@pages/Auth/GenerateOTPPage';
import { VerifyOTPPage } from '@pages/Auth/VerifyOTPPage';

import { OverviewPage } from '@pages/OverviewPage';

import {
  StoreListPage,
  StoreDetailPage,
  StoreAddPage,
  StoreEditPage,
} from '@pages/Store';

import {
  ControllerListPage,
  ControllerAbandonedPage,
} from '@pages/Controller';

import {
  MachineListPage,
} from '@pages/Machine';

import { type Route } from './index';

export const routes: Route[] = [
  {
    path: '/',
    component: <HomePage />,
  },
  // Auth
  {
    path: '/auth/sign-in',
    component: <SignInPage />,
  },
  {
    path: '/auth/generate-otp',
    component: <GenerateOTPPage />,
  },
  {
    path: '/auth/verify-otp',
    component: <VerifyOTPPage />,
  },
  // Overview
  {
    path: '/overview',
    component: <OverviewPage />,
  },
  // Store
  {
    path: '/stores',
    component: <StoreListPage />,
  },
  {
    path: '/stores/add',
    component: <StoreAddPage />,
  },
  {
    path: '/stores/edit/:id',
    component: <StoreEditPage />,
  },
  {
    path: '/stores/detail/:id',
    component: <StoreDetailPage />,
  },
  // Controller
  {
    path: '/controllers',
    component: <ControllerListPage />,
  },
  {
    path: '/controllers/abandoned',
    component: <ControllerAbandonedPage />,
  },
  // Machine
  {
    path: '/machines',
    component: <MachineListPage />,
  },
];
