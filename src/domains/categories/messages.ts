/**
 * Categories Domain Messages
 * All text strings related to category management functionality
 */

export const CATEGORIES_MESSAGES = {
  PAGE: {
    TITLE: 'Categorías',
    SUBTITLE: 'Gestiona tus categorías personalizadas',
    LIST_TITLE: 'Mis Categorías',
    LIST_DESCRIPTION: 'Categorías personalizadas que has creado'
  },

  TABLE: {
    NAME: 'Nombre',
    DESCRIPTION: 'Descripción',
    PREVIEW: 'Vista Previa',
    ACTIONS: 'Acciones'
  },

  FORM: {
    TITLE_CREATE: 'Crear Nueva Categoría',
    TITLE_EDIT: 'Editar Categoría',
    NAME_LABEL: 'Nombre',
    NAME_PLACEHOLDER: 'Ej: Suscripciones, Gimnasio, etc.',
    DESCRIPTION_LABEL: 'Descripción (opcional)',
    DESCRIPTION_PLACEHOLDER: 'Describe para qué usarás esta categoría',
    COLOR_LABEL: 'Color',
    COLOR_HELPER:
      'Selecciona un color pastel para identificar visualmente esta categoría',
    ICON_LABEL: 'Ícono',
    ICON_SEARCH_PLACEHOLDER: 'Buscar ícono...',
    ICON_HELPER: 'Elige un ícono representativo para esta categoría',
    SUBMIT_CREATE: 'Crear Categoría',
    SUBMIT_UPDATE: 'Guardar Cambios'
  },

  CREATE_PAGE: {
    TITLE: 'Crear categoría',
    SUBTITLE: 'Define una categoría personalizada para organizar tus finanzas',
    BACK: 'Volver a categorías',
    FORM_TITLE: 'Detalles de la categoría',
    FORM_DESCRIPTION:
      'Completa la información básica y personaliza el color y el ícono.',
    GUIDE_TITLE: 'Guía rápida',
    GUIDE_ITEMS: [
      'Usa un nombre corto y reconocible',
      'Agrega una descripción para recordar su uso',
      'Elige un color e ícono que la identifiquen rápido'
    ],
    NOTE_TITLE: 'Sugerencias',
    NOTE_DESCRIPTION:
      'Las categorías personalizadas se muestran junto a las predeterminadas en tus transacciones.'
  },

  EDIT_PAGE: {
    TITLE: 'Editar categoría',
    SUBTITLE: 'Actualiza los detalles de tu categoría personalizada',
    BACK: 'Volver a categorías',
    FORM_TITLE: 'Detalles de la categoría',
    FORM_DESCRIPTION: 'Ajusta el nombre, descripción, color e ícono.',
    NOTE_TITLE: 'Nota',
    NOTE_DESCRIPTION:
      'Los cambios se reflejarán en transacciones futuras que usen esta categoría.',
    NOT_FOUND_TITLE: 'Categoría no encontrada',
    NOT_FOUND_DESCRIPTION: 'No pudimos cargar esta categoría. Intenta regresar.'
  },

  ACTIONS: {
    CREATE: 'Nueva Categoría',
    EDIT: 'Editar',
    DELETE: 'Eliminar',
    CANCEL: 'Cancelar'
  },

  DELETE_DIALOG: {
    TITLE: 'Eliminar Categoría',
    DESCRIPTION:
      '¿Estás seguro de eliminar la categoría "{name}"? Esta acción no se puede deshacer.',
    CANCEL: 'Cancelar',
    CONFIRM: 'Eliminar'
  },

  EMPTY: {
    TITLE: 'No tienes categorías personalizadas',
    DESCRIPTION:
      'Crea tu primera categoría personalizada para organizar mejor tus finanzas',
    ACTION: 'Crear Primera Categoría'
  },

  LOADING: {
    LIST: 'Cargando categorías...'
  },

  SUCCESS: {
    CREATED: 'Categoría creada exitosamente',
    UPDATED: 'Categoría actualizada exitosamente',
    DELETED: 'Categoría eliminada exitosamente'
  },

  ERROR: {
    GENERIC: 'Ocurrió un error. Inténtalo de nuevo.',
    LOAD_FAILED: 'Error al cargar categorías',
    CREATE_FAILED: 'Error al crear categoría',
    UPDATE_FAILED: 'Error al actualizar categoría',
    DELETE_FAILED: 'Error al eliminar categoría'
  }
} as const;
