export function safeRedirectPath(path: string | undefined) {
  if (!path) return "/";

  if (!path.startsWith("/")) return `/${path}`;

  return path;
}
