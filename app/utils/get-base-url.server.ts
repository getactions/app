export function getBaseUrl(request: Request) {
  const url = new URL(request.url)

  return url.origin
}