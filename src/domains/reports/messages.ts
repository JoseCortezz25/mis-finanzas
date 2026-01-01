/**
 * Reports Domain Messages
 * All text strings related to reports functionality
 */

export const REPORTS_MESSAGES = {
  // Page header
  PAGE: {
    TITLE: 'Reportes',
    SUBTITLE: 'Análisis y estadísticas de tus finanzas'
  },

  // Period selector
  PERIOD: {
    ALL_TIME: 'Todos los tiempos',
    THIS_MONTH: 'Este mes',
    THIS_YEAR: 'Este año',
    SELECT_PERIOD: 'Selecciona período'
  },

  // Stats cards
  STATS: {
    TOTAL_INCOME: 'Total Ingresos',
    TOTAL_EXPENSES: 'Total Gastos',
    BALANCE: 'Balance',
    TRANSACTIONS: 'Movimientos'
  },

  // Transaction labels
  TRANSACTION: {
    TYPE_INCOME: 'Ingreso',
    TYPE_EXPENSE: 'Gasto',
    NO_DESCRIPTION: 'Sin descripción'
  },

  // Sections
  SECTIONS: {
    EXPENSES_BY_CATEGORY_TITLE: 'Gastos por Categoría',
    EXPENSES_BY_CATEGORY_DESCRIPTION:
      'Distribución de gastos en el período seleccionado',

    INCOME_BY_CATEGORY_TITLE: 'Ingresos por Categoría',
    INCOME_BY_CATEGORY_DESCRIPTION:
      'Distribución de ingresos en el período seleccionado',

    RECENT_TRANSACTIONS_TITLE: 'Movimientos Recientes',
    RECENT_TRANSACTIONS_DESCRIPTION:
      'Los 10 movimientos más recientes del período seleccionado'
  },

  // Charts
  CHART: {
    EXPENSES_BY_CATEGORY_ARIA_LABEL:
      'Gráfica de barras de gastos por categoría',
    OTHERS_CATEGORY: 'Otros'
  },

  // Table columns
  TABLE: {
    DATE: 'Fecha',
    TYPE: 'Tipo',
    DESCRIPTION: 'Descripción',
    AMOUNT: 'Monto'
  },

  // Category breakdown
  CATEGORY: {
    EXPENSE: 'gasto',
    EXPENSES: 'gastos',
    INCOME: 'ingreso',
    INCOMES: 'ingresos',
    ID_PREFIX: 'ID'
  },

  // Empty states
  EMPTY: {
    NO_EXPENSES: 'No hay gastos en este período',
    NO_INCOMES: 'No hay ingresos en este período',
    NO_TRANSACTIONS: 'No hay movimientos en este período'
  },

  // Loading states
  LOADING: {
    REPORTS: 'Cargando reportes...'
  }
} as const;
