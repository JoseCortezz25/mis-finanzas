/**
 * Dashboard Domain Messages
 * All text strings related to dashboard functionality
 */

export const DASHBOARD_MESSAGES = {
  // Page header
  PAGE: {
    TITLE: 'Dashboard',
    SUBTITLE: 'Resumen de tus finanzas personales'
  },

  // Stats cards
  STATS: {
    TOTAL_INCOME: 'Total Ingresos',
    TOTAL_EXPENSES: 'Total Gastos',
    BALANCE: 'Balance',
    CURRENT_BUDGET: 'Presupuesto Actual',
    INCOME_MINUS_EXPENSES: 'Ingresos - Gastos',
    NO_BUDGET: 'Sin presupuesto',
    HISTORICAL: 'Histórico'
  },

  // Sections
  SECTIONS: {
    ACTIVE_BUDGETS_TITLE: 'Presupuestos Activos',
    ACTIVE_BUDGETS_DESCRIPTION: 'Tus presupuestos actualmente en uso',
    TRANSACTIONS_SUMMARY_TITLE: 'Resumen de Movimientos',
    TRANSACTIONS_SUMMARY_DESCRIPTION: 'Total de transacciones registradas'
  },

  // Summary labels
  SUMMARY: {
    TOTAL_TRANSACTIONS: 'Total de movimientos',
    INCOMES: 'Ingresos',
    EXPENSES: 'Gastos',
    NET_BALANCE: 'Balance neto'
  },

  // Empty states
  EMPTY: {
    NO_ACTIVE_BUDGETS: 'No hay presupuestos activos',
    NO_TRANSACTIONS: 'No hay movimientos registrados'
  },

  // Loading states
  LOADING: {
    DEFAULT: 'Cargando...',
    STATS: 'Cargando estadísticas...',
    BUDGETS: 'Cargando presupuestos...'
  }
} as const;
