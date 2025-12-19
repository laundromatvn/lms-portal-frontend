import { HomePage } from '@pages/HomePage';

import { SignInPage } from '@pages/Auth';
import { GenerateOTPPage } from '@pages/Auth/GenerateOTPPage';
import { VerifyOTPPage } from '@pages/Auth/VerifyOTPPage';

import { OverviewPage } from '@pages/Overview';

import {
  StoreListPage,
  StoreDetailPage,
  StoreAddPage,
  StoreEditPage,
} from '@pages/Store';

import {
  ControllerAbandonedPage,
  ControllerListPage,
  ControllerEditPage,
  ControllerDetailPage,
} from '@pages/Controller';

import {
  MachineListPage,
  MachineEditPage,
  MachineDetailPage,
} from '@pages/Machine';

import {
  OrderListPage,
  OrderDetailPage,
} from '@pages/Order';

import {
  TenantProfilePage,
  TenantMemberListPage,
  TenantEditPage,
} from '@pages/Tenant';

import {
  VerificationSuccessPage,
  VerificationFailedPage,
} from '@pages/Common';

import {
  UserProfilePage,
  UserEditPage,
  UserResetPasswordPage,
} from '@pages/User';

import {
  PromotionCampaignListPage,
  PromotionCampaignDetailPage,
  PromotionCampaignEditPage,
  PromotionCampaignAddPage,
} from '@pages/PromotionCampaign';

import {
  FirmwareListPage,
  FirmwareAddPage,
  FirmwareDetailPage,
  FirmwareEditPage,
} from '@pages/Firmware';

import {
  PermissionListPage,
} from '@pages/Permission';

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
  // User
  {
    path: '/user/profile',
    component: <UserProfilePage />,
  },
  {
    path: '/user/edit',
    component: <UserEditPage />,
  },
  {
    path: '/user/reset-password',
    component: <UserResetPasswordPage />,
  },
  // Common
  {
    path: '/verification-success',
    component: <VerificationSuccessPage />,
  },
  {
    path: '/verification-failed',
    component: <VerificationFailedPage />,
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
    path: '/stores/:id/edit',
    component: <StoreEditPage />,
  },
  {
    path: '/stores/:id/detail',
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
  {
    path: '/controllers/:id/edit',
    component: <ControllerEditPage />,
  },
  {
    path: '/controllers/:id/detail',
    component: <ControllerDetailPage />,
  },
  // Machine
  {
    path: '/machines',
    component: <MachineListPage />,
  },
  {
    path: '/machines/:id/edit',
    component: <MachineEditPage />,
  },
  {
    path: '/machines/:id/detail',
    component: <MachineDetailPage />,
  },
  // Order
  {
    path: '/orders',
    component: <OrderListPage />,
  },
  {
    path: '/orders/:id/detail',
    component: <OrderDetailPage />,
  },
  // Tenant
  {
    path: '/tenants/profile',
    component: <TenantProfilePage />,
  },
  {
    path: '/tenant-members',
    component: <TenantMemberListPage />,
  },
  {
    path: '/tenants/:id/edit',
    component: <TenantEditPage />,
  },
  // Promotion Campaign
  {
    path: '/promotion-campaigns',
    component: <PromotionCampaignListPage />,
  },
  {
    path: '/promotion-campaigns/add',
    component: <PromotionCampaignAddPage />,
  },
  {
    path: '/promotion-campaigns/:id/detail',
    component: <PromotionCampaignDetailPage />,
  },
  {
    path: '/promotion-campaigns/:id/edit',
    component: <PromotionCampaignEditPage />,
  },
  // Firmware
  {
    path: '/firmware',
    component: <FirmwareListPage />,
  },
  {
    path: '/firmware/add',
    component: <FirmwareAddPage />,
  },
  {
    path: '/firmware/:id/detail',
    component: <FirmwareDetailPage />,
  },
  {
    path: '/firmware/:id/edit',
    component: <FirmwareEditPage />,
  },
  // Permission
  {
    path: '/permissions',
    component: <PermissionListPage />,
  },
];
