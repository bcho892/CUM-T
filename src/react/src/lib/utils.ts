import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function to2Dp(unrounded: number) {
  return Math.round(unrounded * 100) / 100;
}
