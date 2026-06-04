export function getImageUrl(path: string | null | undefined): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const API_BASE = import.meta.env.VITE_API_BASE_URL || ''
  return `${API_BASE}${path}`
}
