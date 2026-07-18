import { getYouTubeEmbedUrl, getYouTubeVideoId } from './youtube';

describe('YouTube URL handling', () => {
  it('accepts watch, short, and bare video IDs', () => {
    expect(getYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(getYouTubeVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(getYouTubeVideoId('dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('uses the privacy-enhanced embed domain', () => {
    expect(getYouTubeEmbedUrl('dQw4w9WgXcQ', true)).toContain('youtube-nocookie.com/embed/dQw4w9WgXcQ');
    expect(getYouTubeEmbedUrl('dQw4w9WgXcQ', true)).toContain('autoplay=1');
  });
});
