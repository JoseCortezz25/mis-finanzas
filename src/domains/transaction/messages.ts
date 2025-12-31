/**
 * Transaction Domain Messages
 * All text strings related to transaction functionality
 */

export const TRANSACTION_MESSAGES = {
  // Page titles and headers
  PAGE: {
    TITLE: 'Movimientos',
    SUBTITLE: 'Registra y gestiona tus ingresos y gastos',
    LIST_TITLE: 'Mis movimientos',
    LIST_DESCRIPTION: 'Historial de todos tus ingresos y gastos'
  },

  // Actions
  ACTIONS: {
    CREATE: 'Nuevo movimiento',
    EDIT: 'Editar movimiento',
    DELETE: 'Eliminar movimiento',
    REGISTER: 'Registrar movimiento'
  },

  // Form labels
  FORM: {
    TYPE_LABEL: 'Tipo de movimiento',
    TYPE_PLACEHOLDER: 'Selecciona el tipo',

    AMOUNT_LABEL: 'Monto',
    AMOUNT_PLACEHOLDER: '0.00',

    CATEGORY_LABEL: 'Categoría',
    CATEGORY_PLACEHOLDER: 'Selecciona una categoría',

    DATE_LABEL: 'Fecha',

    PAYMENT_METHOD_LABEL: 'Método de pago (opcional)',
    PAYMENT_METHOD_PLACEHOLDER: 'Ej: Tarjeta de crédito, Efectivo',

    DESCRIPTION_LABEL: 'Descripción (opcional)',
    DESCRIPTION_PLACEHOLDER: 'Breve descripción del movimiento',

    NOTES_LABEL: 'Notas (opcional)',
    NOTES_PLACEHOLDER: 'Notas adicionales',

    SAVE_BUTTON: 'Guardar movimiento'
  },

  // Transaction types
  TYPES: {
    INCOME: 'Ingreso',
    EXPENSE: 'Gasto'
  },

  // Dialog titles
  DIALOG: {
    CREATE_TITLE: 'Registrar movimiento',
    CREATE_DESCRIPTION: 'Registra un nuevo ingreso o gasto',
    EDIT_TITLE: 'Editar movimiento',
    EDIT_DESCRIPTION: 'Actualiza la información del movimiento'
  },

  // Table columns
  TABLE: {
    TYPE: 'Tipo',
    DATE: 'Fecha',
    DESCRIPTION: 'Descripción',
    AMOUNT: 'Monto',
    ACTIONS: 'Acciones'
  },

  // Empty state
  EMPTY: {
    TITLE: 'No hay movimientos',
    DESCRIPTION: 'Comienza registrando tu primer ingreso o gasto',
    ACTION: 'Registrar movimiento'
  },

  // Success messages
  SUCCESS: {
    CREATED: 'Movimiento registrado exitosamente',
    UPDATED: 'Movimiento actualizado exitosamente',
    DELETED: 'Movimiento eliminado exitosamente'
  },

  // Confirmations
  CONFIRMATIONS: {
    DELETE: '¿Estás seguro de eliminar este movimiento?'
  },

  // Loading states
  LOADING: {
    LIST: 'Cargando movimientos...',
    CREATING: 'Registrando movimiento...',
    UPDATING: 'Actualizando movimiento...',
    DELETING: 'Eliminando movimiento...'
  },

  // Other
  NO_DESCRIPTION: 'Sin descripción'
} as const;
