// src/utils/jwt.ts
export function isJwtExpired(token: string): boolean {
  try {
    const [, payload] = token.split('.');
    const decoded = JSON.parse(atob(payload));
    const exp = decoded.exp * 1000;
    return Date.now() > exp;
  } catch {
    return true; // invalid token = treat as expired
  }
}
