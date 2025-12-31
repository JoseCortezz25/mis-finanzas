/**
 * Shared Domain Messages
 * Common text strings used across multiple domains
 */

export const SHARED_MESSAGES = {
  // Common actions
  ACTIONS: {
    CREATE: 'Crear',
    EDIT: 'Editar',
    DELETE: 'Eliminar',
    SAVE: 'Guardar',
    CANCEL: 'Cancelar',
    CLOSE: 'Cerrar',
    CONFIRM: 'Confirmar',
    BACK: 'Volver',
    CONTINUE: 'Continuar',
    SEARCH: 'Buscar',
    FILTER: 'Filtrar',
    EXPORT: 'Exportar',
    REFRESH: 'Actualizar'
  },

  // Loading states
  LOADING: {
    DEFAULT: 'Cargando...',
    SAVING: 'Guardando...',
    DELETING: 'Eliminando...',
    LOADING_DATA: 'Cargando datos...'
  },

  // Common labels
  LABELS: {
    NAME: 'Nombre',
    DESCRIPTION: 'Descripción',
    DATE: 'Fecha',
    AMOUNT: 'Monto',
    STATUS: 'Estado',
    ACTIONS: 'Acciones',
    CATEGORY: 'Categoría',
    TYPE: 'Tipo',
    NOTES: 'Notas',
    CREATED_AT: 'Creado',
    UPDATED_AT: 'Actualizado'
  },

  // Confirmation messages
  CONFIRMATIONS: {
    DELETE: '¿Estás seguro de eliminar este elemento?',
    UNSAVED_CHANGES: 'Tienes cambios sin guardar. ¿Deseas continuar?',
    CANCEL_ACTION: '¿Deseas cancelar esta acción?'
  },

  // Success messages
  SUCCESS: {
    CREATED: 'Creado exitosamente',
    UPDATED: 'Actualizado exitosamente',
    DELETED: 'Eliminado exitosamente',
    SAVED: 'Guardado exitosamente'
  },

  // Navigation
  NAV: {
    DASHBOARD: 'Dashboard',
    BUDGET: 'Presupuesto',
    TRANSACTIONS: 'Movimientos',
    REPORTS: 'Reportes',
    SETTINGS: 'Configuración',
    LOGOUT: 'Salir',
    CLOSE_SESSION: 'Cerrar sesión'
  },

  // Months
  MONTHS: {
    JANUARY: 'Enero',
    FEBRUARY: 'Febrero',
    MARCH: 'Marzo',
    APRIL: 'Abril',
    MAY: 'Mayo',
    JUNE: 'Junio',
    JULY: 'Julio',
    AUGUST: 'Agosto',
    SEPTEMBER: 'Septiembre',
    OCTOBER: 'Octubre',
    NOVEMBER: 'Noviembre',
    DECEMBER: 'Diciembre'
  },

  // App info
  APP: {
    NAME: 'Mis Finanzas',
    TAGLINE: 'Gestión Personal de Finanzas'
  }
} as const;

/**
 * Get month name by number (1-12)
 */
export function getMonthName(month: number): string {
  const months = Object.values(SHARED_MESSAGES.MONTHS);
  return months[month - 1] || '';
}
