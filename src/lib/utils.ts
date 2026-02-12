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

export function shouldDisableButton() {
  const geminiAPIKey = localStorage.getItem("GEMINI_API_KEY");
  const serpAPIKey = localStorage.getItem("SERPAPI_KEY");

  const isInvalid = (key: string) => {
    if (!key) return true;

    const trimmed = key.trim().toLowerCase();

    return (
      trimmed === "" ||
      trimmed === "null" ||
      trimmed === "undefined"
    );
  };

  // Disable if ANY key is invalid
  return isInvalid(geminiAPIKey) || isInvalid(serpAPIKey);
}
