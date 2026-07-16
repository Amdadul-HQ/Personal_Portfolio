import { twMerge } from "tailwind-merge";

export type ClassValue = string | number | null | boolean | undefined;

/**
 * Merge Tailwind class names, resolving conflicts (last one wins).
 * Lightweight `cn` helper (clsx is not a dependency of this app).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(inputs.filter(Boolean).join(" "));
}
