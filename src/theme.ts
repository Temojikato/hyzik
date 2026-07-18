import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const omniaTheme = extendTheme({
  config,
  fonts: {
    heading: `'Segoe UI Variable Display', 'Segoe UI', sans-serif`,
    body: `'Segoe UI Variable Text', 'Segoe UI', sans-serif`,
    mono: `'Cascadia Code', 'SFMono-Regular', monospace`,
    hymmnos: `'Hymmnos', sans-serif`,
  },
  colors: {
    background: '#080B12',
    surface: '#111725',
    surfaceRaised: '#182033',
    border: '#2B3650',
    text: '#EDF2FF',
    textMuted: '#9BA8C2',
    textHeader: '#C5A7FF',
    primary: '#9A6DFF',
    secondary: '#45D6CB',
    accent: '#F1C76B',
    danger: '#F26B83',
  },
  styles: {
    global: {
      'html, body, #root': { minHeight: '100%' },
      body: {
        bg: 'background',
        color: 'text',
        backgroundImage:
          'radial-gradient(circle at 12% 0%, rgba(117,83,187,.18), transparent 34rem), radial-gradient(circle at 100% 12%, rgba(44,149,153,.12), transparent 30rem)',
        backgroundAttachment: 'fixed',
      },
      '::selection': { bg: 'primary', color: 'white' },
    },
  },
  radii: { panel: '18px' },
  shadows: {
    panel: '0 18px 50px rgba(0,0,0,.26)',
    focus: '0 0 0 3px rgba(154,109,255,.32)',
  },
  components: {
    Button: {
      baseStyle: { borderRadius: '10px', fontWeight: 650 },
      defaultProps: { colorScheme: 'purple' },
    },
    Modal: {
      baseStyle: {
        dialog: { bg: 'surface', color: 'text', border: '1px solid', borderColor: 'border', borderRadius: 'panel' },
        overlay: { bg: 'rgba(2,4,9,.76)', backdropFilter: 'blur(7px)' },
      },
    },
    Drawer: {
      baseStyle: { dialog: { bg: 'surface', color: 'text' } },
    },
    Input: {
      defaultProps: { focusBorderColor: 'primary' },
      variants: { outline: { field: { bg: 'surfaceRaised', color: 'text', borderColor: 'border', _placeholder: { color: 'textMuted' } } } },
    },
    Select: {
      defaultProps: { focusBorderColor: 'primary' },
      variants: { outline: { field: { bg: 'surfaceRaised', color: 'text', borderColor: 'border' }, icon: { color: 'textMuted' } } },
    },
    Textarea: {
      defaultProps: { focusBorderColor: 'primary' },
      variants: { outline: { bg: 'surfaceRaised', color: 'text', borderColor: 'border', _placeholder: { color: 'textMuted' } } },
    },
    FormLabel: { baseStyle: { color: 'textMuted' } },
    Tabs: { defaultProps: { colorScheme: 'purple' } },
  },
});
