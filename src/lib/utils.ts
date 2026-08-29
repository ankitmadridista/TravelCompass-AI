import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function hasValidString(val: string) {
  return (
    val !== null &&
    val.trim() !== "" &&
    val.trim().toLowerCase() !== "null" &&
    val.trim().toLowerCase() !== "undefined"
  );
}

// Button will no longer be disabled looking for keys!
export function shouldDisableButton() {
  return false; 
}