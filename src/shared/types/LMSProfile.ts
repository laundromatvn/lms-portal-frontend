import { type User } from './user';
import { type Tenant } from './tenant';

export type LMSProfile = {
  user: User;
  tenant: Tenant;
}
