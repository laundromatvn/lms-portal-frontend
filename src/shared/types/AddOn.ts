import { AddOnTypeEnum } from "@shared/enums/AddOnTypeEnum";

export type AddOn = {
  id: string;
  type: AddOnTypeEnum;
  name: string;
  price: string;
  is_default: boolean;
};
