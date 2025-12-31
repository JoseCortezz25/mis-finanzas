/**
 * Icon Mapper
 * Maps icon identifiers (strings from database) to lucide-react icon components
 */

import {
  Utensils,
  Car,
  Gamepad2,
  Heart,
  ShoppingBag,
  DollarSign,
  BookOpen,
  MoreHorizontal,
  Home,
  Smartphone,
  Gift,
  Wallet,
  Laptop,
  TrendingUp,
  Coins,
  type LucideIcon
} from 'lucide-react';

/**
 * Map of icon identifiers to lucide-react components
 */
const ICON_MAP: Record<string, LucideIcon> = {
  // Expense categories
  utensils: Utensils,
  car: Car,
  'gamepad-2': Gamepad2,
  heart: Heart,
  'shopping-bag': ShoppingBag,
  'dollar-sign': DollarSign,
  'book-open': BookOpen,
  'more-horizontal': MoreHorizontal,
  home: Home,
  smartphone: Smartphone,
  gift: Gift,

  // Income categories
  wallet: Wallet,
  laptop: Laptop,
  'trending-up': TrendingUp,
  coins: Coins
};

const DEFAULT_ICON = Wallet;

/**
 * Get lucide-react icon component from icon identifier
 * @param iconId - Icon identifier from database (e.g., 'utensils', 'car')
 * @returns Lucide icon component
 */
export function getIconComponent(iconId: string): LucideIcon {
  return ICON_MAP[iconId.toLowerCase()] || DEFAULT_ICON;
}
