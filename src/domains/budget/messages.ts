/**
 * Budget Domain Messages
 * All text strings related to budget functionality
 */

export const BUDGET_MESSAGES = {
  // Page titles and headers
  PAGE: {
    TITLE: 'Presupuestos',
    SUBTITLE: 'Gestiona tus presupuestos mensuales',
    LIST_TITLE: 'Mis presupuestos',
    LIST_DESCRIPTION: 'Listado de todos tus presupuestos'
  },

  // Actions
  ACTIONS: {
    CREATE: 'Nuevo presupuesto',
    EDIT: 'Editar presupuesto',
    DELETE: 'Eliminar presupuesto'
  },

  // Form labels
  FORM: {
    NAME_LABEL: 'Nombre del presupuesto',
    NAME_PLACEHOLDER: 'Ej: Presupuesto mensual',
    NAME_DESCRIPTION: 'Un nombre descriptivo para identificar este presupuesto',

    AMOUNT_LABEL: 'Monto total',
    AMOUNT_PLACEHOLDER: '0.00',
    AMOUNT_DESCRIPTION: 'El monto total disponible para este presupuesto',

    MONTH_LABEL: 'Mes',
    MONTH_PLACEHOLDER: 'Selecciona un mes',

    YEAR_LABEL: 'Año',
    YEAR_PLACEHOLDER: 'Selecciona un año',

    SAVE_BUTTON: 'Guardar presupuesto'
  },

  // Dialog titles
  DIALOG: {
    CREATE_TITLE: 'Crear presupuesto',
    CREATE_DESCRIPTION:
      'Crea un nuevo presupuesto mensual para gestionar tus finanzas',
    EDIT_TITLE: 'Editar presupuesto',
    EDIT_DESCRIPTION: 'Actualiza la información de tu presupuesto'
  },

  // Table columns
  TABLE: {
    NAME: 'Nombre',
    PERIOD: 'Período',
    AMOUNT: 'Monto',
    STATUS: 'Estado',
    ACTIONS: 'Acciones'
  },

  // Status labels
  STATUS: {
    DRAFT: 'Borrador',
    ACTIVE: 'Activo',
    CLOSED: 'Cerrado'
  },

  // Empty state
  EMPTY: {
    TITLE: 'No hay presupuestos',
    DESCRIPTION: 'Comienza creando tu primer presupuesto mensual',
    ACTION: 'Crear presupuesto'
  },

  // Success messages
  SUCCESS: {
    CREATED: 'Presupuesto creado exitosamente',
    UPDATED: 'Presupuesto actualizado exitosamente',
    DELETED: 'Presupuesto eliminado exitosamente'
  },

  // Confirmations
  CONFIRMATIONS: {
    DELETE: '¿Estás seguro de eliminar este presupuesto?'
  },

  // Loading states
  LOADING: {
    LIST: 'Cargando presupuestos...',
    CREATING: 'Creando presupuesto...',
    UPDATING: 'Actualizando presupuesto...',
    DELETING: 'Eliminando presupuesto...'
  }
} as const;
