export function parseImageUrls(urlString) {
  if (!urlString) return [];
  return urlString
    .split(";")
    .map((url) => url.trim())
    .filter((url) => url);
}
