/**
 * Formats a time in milliseconds to a human-readable string
 * @param ms Time in milliseconds
 * @returns Formatted time string (e.g. "5h 30m" or "2m 15s")
 */
export const formatTimeRemaining = (ms: number): string => {
  if (ms <= 0) return "0s";

  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / (1000 * 60)) % 60;
  const hours = Math.floor(ms / (1000 * 60 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};
