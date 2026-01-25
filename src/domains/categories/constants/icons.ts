/**
 * Icon constants for category selection
 * Provides a curated gallery of 34+ Lucide React icons organized by category
 */

import {
  // Existing icons
  Utensils,
  Car,
  Home,
  Heart,
  ShoppingBag,
  Smartphone,
  Gift,
  Wallet,
  Laptop,
  TrendingUp,
  DollarSign,
  BookOpen,
  Gamepad2,
  MoreHorizontal,
  Coins,
  // New icons
  Plane,
  Coffee,
  Film,
  Music,
  Dumbbell,
  Briefcase,
  PiggyBank,
  CreditCard,
  Bus,
  Bike,
  Train,
  Fuel,
  Pizza,
  Beer,
  IceCream,
  Shirt,
  Watch,
  Dog,
  Flower,
  type LucideIcon
} from 'lucide-react';

export interface IconOption {
  id: string;
  component: LucideIcon;
  label: string;
  category: 'general' | 'transport' | 'food' | 'lifestyle' | 'money';
}

export const AVAILABLE_ICONS: IconOption[] = [
  // General (8 icons)
  {
    id: 'home',
    component: Home,
    label: 'Casa',
    category: 'general'
  },
  {
    id: 'briefcase',
    component: Briefcase,
    label: 'Trabajo',
    category: 'general'
  },
  {
    id: 'shopping-bag',
    component: ShoppingBag,
    label: 'Compras',
    category: 'general'
  },
  {
    id: 'gift',
    component: Gift,
    label: 'Regalo',
    category: 'general'
  },
  {
    id: 'heart',
    component: Heart,
    label: 'Salud',
    category: 'general'
  },
  {
    id: 'book-open',
    component: BookOpen,
    label: 'Educación',
    category: 'general'
  },
  {
    id: 'smartphone',
    component: Smartphone,
    label: 'Tecnología',
    category: 'general'
  },
  {
    id: 'more-horizontal',
    component: MoreHorizontal,
    label: 'Otros',
    category: 'general'
  },

  // Transport (6 icons)
  {
    id: 'car',
    component: Car,
    label: 'Auto',
    category: 'transport'
  },
  {
    id: 'bus',
    component: Bus,
    label: 'Bus',
    category: 'transport'
  },
  {
    id: 'bike',
    component: Bike,
    label: 'Bici',
    category: 'transport'
  },
  {
    id: 'train',
    component: Train,
    label: 'Tren',
    category: 'transport'
  },
  {
    id: 'plane',
    component: Plane,
    label: 'Avión',
    category: 'transport'
  },
  {
    id: 'fuel',
    component: Fuel,
    label: 'Combustible',
    category: 'transport'
  },

  // Food (5 icons)
  {
    id: 'utensils',
    component: Utensils,
    label: 'Comida',
    category: 'food'
  },
  {
    id: 'coffee',
    component: Coffee,
    label: 'Café',
    category: 'food'
  },
  {
    id: 'pizza',
    component: Pizza,
    label: 'Pizza',
    category: 'food'
  },
  {
    id: 'beer',
    component: Beer,
    label: 'Bebidas',
    category: 'food'
  },
  {
    id: 'ice-cream',
    component: IceCream,
    label: 'Postres',
    category: 'food'
  },

  // Lifestyle (8 icons)
  {
    id: 'film',
    component: Film,
    label: 'Cine',
    category: 'lifestyle'
  },
  {
    id: 'music',
    component: Music,
    label: 'Música',
    category: 'lifestyle'
  },
  {
    id: 'gamepad-2',
    component: Gamepad2,
    label: 'Juegos',
    category: 'lifestyle'
  },
  {
    id: 'dumbbell',
    component: Dumbbell,
    label: 'Gym',
    category: 'lifestyle'
  },
  {
    id: 'shirt',
    component: Shirt,
    label: 'Ropa',
    category: 'lifestyle'
  },
  {
    id: 'watch',
    component: Watch,
    label: 'Accesorios',
    category: 'lifestyle'
  },
  {
    id: 'dog',
    component: Dog,
    label: 'Mascota',
    category: 'lifestyle'
  },
  {
    id: 'flower',
    component: Flower,
    label: 'Jardín',
    category: 'lifestyle'
  },

  // Money (7 icons)
  {
    id: 'wallet',
    component: Wallet,
    label: 'Efectivo',
    category: 'money'
  },
  {
    id: 'credit-card',
    component: CreditCard,
    label: 'Tarjeta',
    category: 'money'
  },
  {
    id: 'piggy-bank',
    component: PiggyBank,
    label: 'Ahorros',
    category: 'money'
  },
  {
    id: 'dollar-sign',
    component: DollarSign,
    label: 'Dinero',
    category: 'money'
  },
  {
    id: 'trending-up',
    component: TrendingUp,
    label: 'Inversiones',
    category: 'money'
  },
  {
    id: 'coins',
    component: Coins,
    label: 'Monedas',
    category: 'money'
  },
  {
    id: 'laptop',
    component: Laptop,
    label: 'Freelance',
    category: 'money'
  }
];

export const DEFAULT_ICON = AVAILABLE_ICONS[0];

/**
 * Get icon option by id
 * @param id - Icon identifier
 * @returns IconOption or default icon if not found
 */
export function getIconById(id: string): IconOption {
  return AVAILABLE_ICONS.find(icon => icon.id === id) || DEFAULT_ICON;
}
