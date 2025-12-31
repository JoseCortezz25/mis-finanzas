/**
 * Budget Categories Configuration
 * Defines available categories for budget allocation
 */

import type { LucideIcon } from 'lucide-react';
import {
  Utensils,
  Car,
  Gamepad2,
  Heart,
  ShoppingBag,
  Wrench,
  BookOpen,
  MoreHorizontal
} from 'lucide-react';

export interface BudgetCategory {
  id: string;
  label: string;
  icon: LucideIcon;
  bgColor: string;
  iconColor: string;
}

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  {
    id: 'comida',
    label: 'Comida',
    icon: Utensils,
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-500'
  },
  {
    id: 'transporte',
    label: 'Transporte',
    icon: Car,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500'
  },
  {
    id: 'entretenimiento',
    label: 'Entretenimiento',
    icon: Gamepad2,
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-500'
  },
  {
    id: 'salud',
    label: 'Salud',
    icon: Heart,
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-500'
  },
  {
    id: 'compras',
    label: 'Compras',
    icon: ShoppingBag,
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-500'
  },
  {
    id: 'servicios',
    label: 'Servicios',
    icon: Wrench,
    bgColor: 'bg-cyan-50',
    iconColor: 'text-cyan-500'
  },
  {
    id: 'educacion',
    label: 'Educación',
    icon: BookOpen,
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600'
  },
  {
    id: 'otros',
    label: 'Otros gastos',
    icon: MoreHorizontal,
    bgColor: 'bg-slate-50',
    iconColor: 'text-slate-500'
  }
];
