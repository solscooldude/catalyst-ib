import { plates as cat } from "@/lib/focus-plates-cat";
import { plates as desk } from "@/lib/focus-plates-desk";
import { plates as library } from "@/lib/focus-plates-library";

export const FOCUS_PLATE_B64: Record<string, string> = {
  ...cat,
  ...desk,
  ...library,
};

export const FOCUS_PLATE_FILES = Object.keys(FOCUS_PLATE_B64);
