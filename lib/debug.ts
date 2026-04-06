export const debugLog = (scope: string, message: string, data?: unknown): void => {
  // Keep logging centralized so it can be replaced by an external logger later.
  console.log(`[${scope}] ${message}`, data ?? '');
};
