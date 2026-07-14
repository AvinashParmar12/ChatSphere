// ==============================
// Token Storage Key
// ==============================

const TOKEN_KEY = "chatSphereToken";

// ==============================
// Save Token
// ==============================

export const saveToken = (
  token: string
): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// ==============================
// Get Token
// ==============================

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// ==============================
// Remove Token
// ==============================

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};