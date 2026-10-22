import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { getDownloadURL } from 'firebase/storage';
import NPCImage from './NPCImage';

jest.mock('../Firebase', () => ({ storage: {} }));
jest.mock('firebase/storage', () => ({
  ref: (_storage: unknown, filename: string) => filename,
  getDownloadURL: jest.fn(),
}));
// Exercise source selection independently of Chakra styling and jsdom image loading.
jest.mock('@chakra-ui/react', () => ({
  Box: ({ children, role, 'aria-label': label }: { children?: React.ReactNode; role?: string; 'aria-label'?: string }) =>
    <div role={role} aria-label={label}>{children}</div>,
  Image: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
  Text: ({ children }: { children?: React.ReactNode }) => <span>{children}</span>,
  Spinner: () => <span>Loading</span>,
  Icon: () => <span />,
}));

const download = getDownloadURL as jest.Mock;
const portrait = (name: string, filename: string) => (
  <NPCImage npcName={name} imageFiles={[{ filename }]} />
);

beforeEach(() => download.mockReset());

it('does not let a late previous portrait overwrite the selected NPC', async () => {
  let resolveFirst!: (url: string) => void;
  let resolveSecond!: (url: string) => void;
  download.mockImplementationOnce(() => new Promise(resolve => { resolveFirst = resolve; }))
    .mockImplementationOnce(() => new Promise(resolve => { resolveSecond = resolve; }));
  const view = render(portrait('First NPC', 'first.png'));
  view.rerender(portrait('Second NPC', 'second.png'));
  await act(async () => resolveSecond('https://assets.test/second.png'));
  expect(screen.getByRole('img', { name: 'Second NPC' })).toHaveAttribute('src', 'https://assets.test/second.png');
  await act(async () => resolveFirst('https://assets.test/first.png'));
  expect(screen.getByRole('img', { name: 'Second NPC' })).toHaveAttribute('src', 'https://assets.test/second.png');
});

it('clears the old portrait while the next portrait is loading', async () => {
  download.mockResolvedValueOnce('https://assets.test/first.png')
    .mockImplementationOnce(() => new Promise(() => {}));
  const view = render(portrait('First NPC', 'first.png'));
  await screen.findByRole('img', { name: 'First NPC' });
  view.rerender(portrait('Second NPC', 'second.png'));
  expect(screen.queryByRole('img', { name: 'First NPC' })).not.toBeInTheDocument();
  expect(view.container.querySelector('img[src="https://assets.test/first.png"]')).toBeNull();
});

it('uses a local fallback when Firebase art is missing and the legacy URL is a placeholder', async () => {
  download.mockRejectedValue(new Error('storage/object-not-found'));
  render(<NPCImage npcName="Lynn Collins"
    imageFiles={[{ filename: 'missing.png' }]} fallbackUrl="https://example.com/lynn.jpg" />);
  expect(await screen.findByRole('img', { name: 'Portrait unavailable for Lynn Collins' })).toHaveTextContent('LC');
  expect(screen.queryByRole('img', { name: 'Lynn Collins' })).not.toBeInTheDocument();
});

it('uses a real fallback URL when a named portrait cannot be loaded', async () => {
  download.mockRejectedValue(new Error('storage/object-not-found'));
  render(<NPCImage npcName="Lynn Collins"
    imageFiles={[{ filename: 'missing.png' }]} fallbackUrl="https://assets.test/lynn.jpg" />);
  expect(await screen.findByRole('img', { name: 'Lynn Collins' })).toHaveAttribute('src', 'https://assets.test/lynn.jpg');
});
