import { API_BASE_URL } from "../config/constants";

export function getUserImageUrl(imageUrl?: string | null): string {
  if (!imageUrl) return "/default-avatar.png"; // fallback
  if (imageUrl.startsWith("http")) return imageUrl; // already absolute
  return `${API_BASE_URL}/static/${imageUrl}`; // make absolute
}
