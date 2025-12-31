/**
 * Category color mapping
 * Maps category names to pastel background colors
 */

export interface CategoryColors {
  bgColor: string;
  iconColor: string;
}

const CATEGORY_COLORS: Record<string, CategoryColors> = {
  // Main categories
  comida: {
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600'
  },
  transporte: {
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  entretenimiento: {
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  salud: {
    bgColor: 'bg-red-100',
    iconColor: 'text-red-600'
  },
  compras: {
    bgColor: 'bg-pink-100',
    iconColor: 'text-pink-600'
  },
  servicios: {
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  educación: {
    bgColor: 'bg-indigo-100',
    iconColor: 'text-indigo-600'
  },
  educacion: {
    bgColor: 'bg-indigo-100',
    iconColor: 'text-indigo-600'
  },
  'otros gastos': {
    bgColor: 'bg-gray-100',
    iconColor: 'text-gray-600'
  },
  otros: {
    bgColor: 'bg-gray-100',
    iconColor: 'text-gray-600'
  },
  // Additional common categories
  vivienda: {
    bgColor: 'bg-amber-100',
    iconColor: 'text-amber-600'
  },
  tecnología: {
    bgColor: 'bg-cyan-100',
    iconColor: 'text-cyan-600'
  },
  tecnologia: {
    bgColor: 'bg-cyan-100',
    iconColor: 'text-cyan-600'
  },
  regalos: {
    bgColor: 'bg-rose-100',
    iconColor: 'text-rose-600'
  },
  // Income categories
  salario: {
    bgColor: 'bg-emerald-100',
    iconColor: 'text-emerald-600'
  },
  freelance: {
    bgColor: 'bg-teal-100',
    iconColor: 'text-teal-600'
  },
  inversiones: {
    bgColor: 'bg-lime-100',
    iconColor: 'text-lime-600'
  },
  'otros ingresos': {
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600'
  }
};

const DEFAULT_COLORS: CategoryColors = {
  bgColor: 'bg-slate-100',
  iconColor: 'text-slate-600'
};

/**
 * Get category colors based on category name
 * @param categoryName - Category name
 * @returns CategoryColors object with background and icon colors
 */
export function getCategoryColors(categoryName: string): CategoryColors {
  const normalizedName = categoryName.toLowerCase().trim();
  return CATEGORY_COLORS[normalizedName] || DEFAULT_COLORS;
}
