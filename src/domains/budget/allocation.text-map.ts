/**
 * Text map for allocation-related UI elements
 * All user-facing text for budget allocation features
 */
export const allocationTextMap = {
  // Headings
  chartTitle: 'Distribución de Asignaciones',
  chartSubtitle: 'Cómo está distribuido tu fondo general',
  formTitle: 'Asignar ingreso de General',

  // Actions
  addAllocationButton: 'Añadir Ingreso de General',
  confirmButton: 'Asignar',
  cancelButton: 'Cancelar',
  deleteButton: 'Eliminar',

  // Form Labels
  amountLabel: 'Monto',
  categoryLabel: 'Categoría',
  dateLabel: 'Fecha',
  descriptionLabel: 'Descripción (opcional)',

  // Placeholders
  amountPlaceholder: '0.00',
  categoryPlaceholder: 'Seleccionar categoría',
  descriptionPlaceholder: 'Añade una nota si deseas',

  // Helper Text
  amountHelper: 'Ingreso a asignar del fondo general',
  categoryHelper: 'Categoría para rastrear esta asignación',

  // Feedback Messages
  successCreate: 'Ingreso creado exitosamente',
  successDelete: 'Ingreso eliminada',
  errorCreate: 'Error al crear ingreso',
  errorDelete: 'Error al eliminar ingreso',

  // Validation Errors
  amountRequired: 'El monto es requerido',
  amountPositive: 'El monto debe ser mayor a 0',
  amountTooLarge: 'El monto es demasiado grande',
  categoryRequired: 'Debe seleccionar una categoría',
  dateInvalid: 'Fecha inválida',
  descriptionTooLong: 'La descripción no puede exceder 200 caracteres',

  // Empty States
  noAllocationsYet: 'Aún no has hecho asignaciones',
  noAllocationsDescription:
    'Comienza asignando dinero del fondo general a tus presupuestos',
  noAllocationsAction: 'Crear primera asignación',

  // Chart Legend
  unallocated: 'Sin asignar',
  totalAllocated: 'Total asignado',

  // Transaction List
  allocationLabel: 'Asignación',
  allocationDescription: 'Asignación del fondo general',
  allocationFromGeneral: 'del fondo general',

  // Confirmation Dialog
  deleteConfirmTitle: '¿Eliminar asignación?',
  deleteConfirmMessage: 'Esta acción no se puede deshacer.',
  deleteConfirmButton: 'Sí, eliminar',
  deleteCancelButton: 'Cancelar',

  // Loading States
  loadingChart: 'Cargando distribución...',
  loadingAllocations: 'Cargando asignaciones...',
  creating: 'Creando asignación...',
  deleting: 'Eliminando...'
} as const;

// Type for autocomplete
export type AllocationTextKey = keyof typeof allocationTextMap;
