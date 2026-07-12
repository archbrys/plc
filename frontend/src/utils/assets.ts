export function resolveAssetSrc(path: string): string {
  if (/^https?:\/\//.test(path) || path.startsWith('/')) return path
  return `/assets/${path}`
}
