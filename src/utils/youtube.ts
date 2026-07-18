export const getYouTubeVideoId = (value?: string): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.hostname.includes('youtu.be')) return url.pathname.split('/').filter(Boolean)[0] || null;
    if (url.pathname.startsWith('/shorts/')) return url.pathname.split('/')[2] || null;
    if (url.pathname.startsWith('/embed/')) return url.pathname.split('/')[2] || null;
    return url.searchParams.get('v');
  } catch {
    return null;
  }
};
export const getYouTubeEmbedUrl = (value?: string, autoplay = false): string | null => {
  const id = getYouTubeVideoId(value);
  if (!id) return null;
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0${autoplay ? '&autoplay=1' : ''}`;
};
