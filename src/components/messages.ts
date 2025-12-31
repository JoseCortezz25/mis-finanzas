/**
 * UI Components Messages
 * Text strings for reusable UI components
 */

export const COMPONENT_MESSAGES = {
  // Empty state (molecule)
  EMPTY_STATE: {
    DEFAULT_TITLE: 'No hay datos',
    DEFAULT_DESCRIPTION: 'No se encontraron elementos para mostrar'
  },

  // Page header (organism)
  PAGE_HEADER: {
    BACK: 'Volver'
  },

  // Data table actions (molecule)
  DATA_TABLE_ACTIONS: {
    EDIT: 'Editar',
    DELETE: 'Eliminar',
    VIEW: 'Ver',
    MORE: 'Más acciones'
  },

  // Mobile bottom nav (organism)
  MOBILE_NAV: {
    DASHBOARD: 'Dashboard',
    BUDGET: 'Presupuesto',
    TRANSACTIONS: 'Movimientos',
    REPORTS: 'Reportes'
  },

  // App header (organism)
  APP_HEADER: {
    LOGOUT: 'Salir',
    CLOSE_SESSION: 'Cerrar sesión',
    MENU: 'Menú',
    PROFILE: 'Perfil'
  }
} as const;
