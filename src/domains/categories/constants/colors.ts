/**
 * Color constants for category selection
 * Provides a curated palette of 15 pastel colors
 */

export interface ColorOption {
  id: string;
  hex: string;
  name: string;
  tailwindBg: string;
}

export const PASTEL_COLORS: ColorOption[] = [
  {
    id: 'lavender',
    hex: '#A5B4FC',
    name: 'Lavanda',
    tailwindBg: 'bg-indigo-300'
  },
  { id: 'pink', hex: '#FBCFE8', name: 'Rosa', tailwindBg: 'bg-pink-300' },
  { id: 'mint', hex: '#6EE7B7', name: 'Menta', tailwindBg: 'bg-emerald-300' },
  {
    id: 'peach',
    hex: '#FED7AA',
    name: 'Durazno',
    tailwindBg: 'bg-orange-300'
  },
  { id: 'sky', hex: '#7DD3FC', name: 'Cielo', tailwindBg: 'bg-sky-300' },
  { id: 'lemon', hex: '#FDE047', name: 'Limón', tailwindBg: 'bg-yellow-300' },
  { id: 'coral', hex: '#FCA5A5', name: 'Coral', tailwindBg: 'bg-red-300' },
  { id: 'sage', hex: '#86EFAC', name: 'Salvia', tailwindBg: 'bg-green-300' },
  { id: 'lilac', hex: '#C4B5FD', name: 'Lila', tailwindBg: 'bg-purple-300' },
  { id: 'cream', hex: '#FEF08A', name: 'Crema', tailwindBg: 'bg-yellow-200' },
  { id: 'aqua', hex: '#5EEAD4', name: 'Aqua', tailwindBg: 'bg-teal-300' },
  {
    id: 'rose',
    hex: '#FDA4AF',
    name: 'Rosa Suave',
    tailwindBg: 'bg-rose-300'
  },
  {
    id: 'periwinkle',
    hex: '#A78BFA',
    name: 'Pervinca',
    tailwindBg: 'bg-violet-300'
  },
  {
    id: 'apricot',
    hex: '#FDBA74',
    name: 'Albaricoque',
    tailwindBg: 'bg-orange-300'
  },
  {
    id: 'powder',
    hex: '#BAE6FD',
    name: 'Azul Polvo',
    tailwindBg: 'bg-sky-200'
  }
];

export const DEFAULT_COLOR = PASTEL_COLORS[0];
