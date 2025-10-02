import type { Machine } from "@shared/types/machine";
import type { AddOnOption } from "@shared/types/AddOnOption";

export type SelectedMachineOption = {
  machine: Machine;
  addOns: AddOnOption[];
}
