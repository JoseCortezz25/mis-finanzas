/**
 * Budget Detail Page Messages
 * All text strings related to budget detail view functionality
 */

export const BUDGET_DETAIL_MESSAGES = {
  // Page titles and headers
  PAGE: {
    TITLE: 'Detalle de Presupuesto',
    SUBTITLE: 'Gestiona y monitorea tu presupuesto',
    BACK: 'Volver a presupuestos'
  },

  // Overview section
  OVERVIEW: {
    TITLE: 'Resumen del Presupuesto',
    STATS: 'Estadísticas',
    SPENT_LABEL: 'Gastado',
    INCOME_LABEL: 'Ingresos',
    AVAILABLE_LABEL: 'Disponible',
    TOTAL_LABEL: 'Total',
    OF_TOTAL: 'de',
    PROGRESS_LABEL: 'Progreso',
    HEALTH_STATUS: 'Estado de salud'
  },

  // Health status indicators
  HEALTH: {
    HEALTHY: 'Saludable',
    HEALTHY_DESC: 'Tu presupuesto está en buen estado',
    WARNING: 'Alerta',
    WARNING_DESC: 'Estás cerca del límite de tu presupuesto',
    ALERT: 'Cuidado',
    ALERT_DESC: 'Estás muy cerca de superar tu presupuesto',
    DANGER: 'Superado',
    DANGER_DESC: 'Has superado el límite de tu presupuesto'
  },

  // Transactions section
  TRANSACTIONS: {
    TITLE: 'Movimientos Relacionados',
    SUBTITLE: 'Todas las transacciones asociadas a este presupuesto',
    COUNT: 'movimientos',
    COUNT_SINGULAR: 'movimiento',
    LAST_MOVEMENT: 'Último movimiento',
    NO_TRANSACTIONS: 'No hay movimientos registrados',
    SHOWING_RESULTS: 'Mostrando',
    OF_RESULTS: 'de'
  },

  // Category breakdown
  CATEGORIES: {
    TITLE: 'Desglose por Categorías',
    SUBTITLE: 'Distribución de gastos por categoría',
    NO_CATEGORIES: 'Sin categorías asignadas',
    SPENT: 'gastado',
    ALLOCATED: 'asignado',
    REMAINING: 'restante'
  },

  // Actions
  ACTIONS: {
    CREATE_TRANSACTION: 'Crear movimiento',
    EDIT_BUDGET: 'Editar presupuesto',
    DELETE_BUDGET: 'Eliminar presupuesto',
    CLOSE_BUDGET: 'Cerrar presupuesto',
    REOPEN_BUDGET: 'Reabrir presupuesto',
    FILTER: 'Filtrar y ordenar',
    SHOW_MORE: 'Mostrar más',
    SHOW_LESS: 'Mostrar menos',
    REFRESH: 'Actualizar',
    EXPORT: 'Exportar'
  },

  // Filter options
  FILTER: {
    TITLE: 'Filtrar movimientos',
    ALL_TYPES: 'Todos los tipos',
    EXPENSES_ONLY: 'Solo gastos',
    INCOME_ONLY: 'Solo ingresos',
    ALL_CATEGORIES: 'Todas las categorías',
    SORT_BY: 'Ordenar por',
    SORT_DATE_DESC: 'Fecha (más reciente)',
    SORT_DATE_ASC: 'Fecha (más antiguo)',
    SORT_AMOUNT_DESC: 'Monto (mayor a menor)',
    SORT_AMOUNT_ASC: 'Monto (menor a mayor)',
    APPLY: 'Aplicar filtros',
    CLEAR: 'Limpiar filtros',
    ACTIVE_FILTERS: 'Filtros activos'
  },

  // Pagination
  PAGINATION: {
    PREVIOUS: 'Anterior',
    NEXT: 'Siguiente',
    PAGE: 'Página',
    OF: 'de',
    SHOWING: 'Mostrando',
    TO: 'a',
    RESULTS: 'resultados',
    PER_PAGE: 'Por página'
  },

  // Success messages
  SUCCESS: {
    TRANSACTION_CREATED: 'Movimiento creado exitosamente',
    BUDGET_UPDATED: 'Presupuesto actualizado exitosamente',
    BUDGET_CLOSED: 'Presupuesto cerrado exitosamente',
    BUDGET_REOPENED: 'Presupuesto reabierto exitosamente',
    DATA_REFRESHED: 'Datos actualizados'
  },

  // Error messages
  ERROR: {
    LOAD_FAILED: 'Error al cargar el presupuesto',
    NO_BUDGET: 'No se encontró el presupuesto',
    TRANSACTION_LOAD_FAILED: 'Error al cargar los movimientos',
    UPDATE_FAILED: 'Error al actualizar el presupuesto',
    CLOSE_FAILED: 'Error al cerrar el presupuesto',
    NETWORK_ERROR: 'Error de conexión. Intenta de nuevo.'
  },

  // Warning messages
  WARNING: {
    BUDGET_EXCEEDED: 'Has superado el presupuesto',
    BUDGET_EXCEEDED_DESC: 'Has gastado más del monto total asignado',
    APPROACHING_LIMIT: 'Te acercas al límite',
    APPROACHING_LIMIT_DESC: 'Has consumido más del 70% de tu presupuesto',
    NO_AMOUNT: 'Este presupuesto no tiene monto asignado',
    BUDGET_CLOSED: 'Este presupuesto está cerrado',
    BUDGET_CLOSED_DESC: 'No puedes agregar movimientos a un presupuesto cerrado'
  },

  // Tooltips
  TOOLTIPS: {
    PROGRESS_BAR: 'Porcentaje de presupuesto consumido',
    SPENT: 'Total gastado hasta ahora',
    INCOME: 'Total de ingresos registrados',
    AVAILABLE: 'Monto disponible restante',
    EDIT_BUDGET: 'Editar este presupuesto',
    CREATE_TRANSACTION: 'Agregar un nuevo movimiento a este presupuesto',
    FILTER_TRANSACTIONS: 'Filtrar y ordenar los movimientos',
    HEALTH_STATUS:
      'Estado de salud del presupuesto según el porcentaje consumido',
    VIEW_TRANSACTION: 'Ver detalles del movimiento',
    CATEGORY_BREAKDOWN: 'Desglose de gastos por categoría'
  },

  // Empty states
  EMPTY: {
    NO_TRANSACTIONS_TITLE: 'No hay movimientos',
    NO_TRANSACTIONS_DESC:
      'Este presupuesto aún no tiene movimientos registrados',
    NO_TRANSACTIONS_ACTION: 'Crear primer movimiento',
    NO_FILTER_RESULTS_TITLE: 'No se encontraron resultados',
    NO_FILTER_RESULTS_DESC:
      'No hay movimientos que coincidan con los filtros aplicados',
    NO_FILTER_RESULTS_ACTION: 'Limpiar filtros',
    NO_CATEGORY_BREAKDOWN: 'No hay categorías para mostrar',
    NO_CATEGORY_BREAKDOWN_DESC:
      'Los movimientos de este presupuesto no tienen categorías asignadas'
  },

  // Loading states
  LOADING: {
    BUDGET: 'Cargando presupuesto...',
    TRANSACTIONS: 'Cargando movimientos...',
    UPDATING: 'Actualizando...',
    CLOSING: 'Cerrando presupuesto...'
  },

  // Confirmations
  CONFIRMATIONS: {
    CLOSE_BUDGET: '¿Estás seguro de cerrar este presupuesto?',
    CLOSE_BUDGET_DESC:
      'No podrás agregar más movimientos a un presupuesto cerrado',
    DELETE_BUDGET: '¿Estás seguro de eliminar este presupuesto?',
    DELETE_BUDGET_DESC: 'Esta acción no se puede deshacer'
  },

  // Transaction types
  TRANSACTION_TYPES: {
    EXPENSE: 'Gasto',
    INCOME: 'Ingreso'
  },

  // Date formatting
  DATES: {
    TODAY: 'Hoy',
    YESTERDAY: 'Ayer',
    THIS_WEEK: 'Esta semana',
    THIS_MONTH: 'Este mes',
    LAST_MONTH: 'Mes pasado',
    CUSTOM_RANGE: 'Rango personalizado'
  }
} as const;
