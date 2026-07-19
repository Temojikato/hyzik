/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const lexiconPath = path.join(root, 'campaign files', '_reference', 'HYMMNOS_LEXICON_INDEX.json');
const outputDirectory = path.join(root, 'src', 'generated');
const songsDirectory = path.join(root, 'campaign files', '_reference', 'songs');
const songMetadata = {
  FLOOR_01_CONTAINMENT_IS_NOT_SAFETY: ['Floor I — Containment Is Not Safety', 'Tower Floor 1'],
  FLOOR_02_SEVEN_WHISPERS: ['Floor II — Seven Whispers', 'Tower Floor 2'],
  FLOOR_03_THE_WITNESS_IS_UNRELIABLE: ['Floor III — The Witness Is Unreliable', 'Tower Floor 3'],
  FLOOR_04_THE_SONG_IS_EXECUTABLE: ['Floor IV — The Song Is Executable', 'Tower Floor 4'],
  FLOOR_05_THE_LAST_SAFE_SONG: ['Floor V — The Last Safe Song', 'Tower Floor 5'],
  PERPETUAL_SLIME_ROOM_THE_HOARD_THAT_WAITS: ['The Hoard That Waits', 'Perpetual Slime Room'],
  VENESTRIA_THEME_TEST: ['Venestria — Abandoned Song', 'Tower Floor 1'],
};
const { assignCypherId } = require('./hymmnosCypherAssignment');

const slug = (value) => value
  .normalize('NFKD')
  .replace(/[^\w.-]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .toLowerCase();

const buildLexicon = () => {
  const source = JSON.parse(fs.readFileSync(lexiconPath, 'utf8')).entries;
  const seen = new Map();
  const publicEntries = source.map((entry, index) => {
    const base = slug(entry.headword) || `entry-${index + 1}`;
    const occurrence = (seen.get(base) || 0) + 1;
    seen.set(base, occurrence);
    const id = occurrence === 1 ? base : `${base}-${occurrence}`;
    return {
      id,
      headword: entry.headword,
      pronunciation: entry.pronunciation,
      partOfSpeech: entry.part_of_speech,
      dialect: entry.dialect,
      cypherId: assignCypherId(entry),
    };
  });
  fs.writeFileSync(path.join(outputDirectory, 'hymmnosPublicIndex.json'), `${JSON.stringify(publicEntries)}\n`);
  return publicEntries;
};

const songTitle = (markdown, fallback) => {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : fallback;
};

const buildSongs = (publicEntries) => {
  const lookup = new Map(publicEntries.map((entry) => [entry.headword.toLowerCase(), entry.id]));
  const files = fs.readdirSync(songsDirectory).filter((name) => name.endsWith('.md')).sort();
  const songs = files.map((file) => {
    const markdown = fs.readFileSync(path.join(songsDirectory, file), 'utf8');
    const block = markdown.match(/## Custom lyrics[\s\S]*?```text\s*([\s\S]*?)```/i)?.[1] || '';
    let direction = '';
    const lines = [];
    for (const raw of block.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line) continue;
      if (line.startsWith('[') || line.startsWith('{')) {
        direction = line.replace(/^\[|\]$/g, '').replace(/^\{|\}$/g, '');
        continue;
      }
      if (/instrumental|no words|non-lexical/i.test(line)) continue;
      const words = line.match(/[A-Za-z][A-Za-z0-9.'-]*/g) || [];
      const tokenIds = words.map((word) => lookup.get(word.toLowerCase()) || lookup.get(word.replace(/[.,!?;:]+$/, '').toLowerCase())).filter(Boolean);
      lines.push({ hymmnos: line, tokenIds, direction });
    }
    const key = file.replace(/\.md$/i, '');
    const metadata = songMetadata[key];
    return {
      id: slug(key),
      title: metadata?.[0] || songTitle(markdown, key.replace(/_/g, ' ')),
      location: metadata?.[1] || (/FLOOR[_ ]0?(\d)/i.test(file) ? `Tower Floor ${file.match(/FLOOR[_ ]0?(\d)/i)[1]}` : undefined),
      lines,
    };
  });
  fs.writeFileSync(path.join(outputDirectory, 'campaignSongs.json'), `${JSON.stringify(songs, null, 2)}\n`);
};

fs.mkdirSync(outputDirectory, { recursive: true });
const publicEntries = buildLexicon();
buildSongs(publicEntries);
console.log(`Built ${publicEntries.length} public lexicon entries and the campaign song catalog.`);
