/**
 * User Domain Text Map
 * All text strings for user profile management
 */

export const USER_MESSAGES = {
  // Page
  PAGE: {
    TITLE: 'Perfil',
    SUBTITLE: 'Gestiona tu información personal y preferencias'
  },

  // Profile Overview
  PROFILE: {
    HEADING: 'Tu Información',
    EMAIL_LABEL: 'Correo electrónico',
    NAME_LABEL: 'Nombre',
    MEMBER_SINCE: 'Miembro desde',
    LAST_LOGIN: 'Último acceso'
  },

  // Update Name
  NAME: {
    HEADING: 'Actualizar nombre',
    LABEL: 'Nombre de usuario',
    PLACEHOLDER: 'Tu nombre',
    HINT: 'Este nombre aparecerá en tu perfil',
    MIN_LENGTH: 'Mínimo 2 caracteres',
    MAX_LENGTH: 'Máximo 50 caracteres',
    BUTTON_SAVE: 'Guardar cambios',
    BUTTON_CANCEL: 'Cancelar'
  },

  // Password Management
  PASSWORD: {
    HEADING: 'Cambiar contraseña',
    DESCRIPTION: 'Actualiza tu contraseña para mantener tu cuenta segura',
    CURRENT_LABEL: 'Contraseña actual',
    CURRENT_PLACEHOLDER: 'Ingresa tu contraseña actual',
    NEW_LABEL: 'Nueva contraseña',
    NEW_PLACEHOLDER: 'Ingresa tu nueva contraseña',
    CONFIRM_LABEL: 'Confirmar contraseña',
    CONFIRM_PLACEHOLDER: 'Confirma tu nueva contraseña',
    STRENGTH_LABEL: 'Fortaleza de la contraseña',
    BUTTON_CHANGE: 'Cambiar contraseña',
    BUTTON_CANCEL: 'Cancelar',
    WARNING:
      'Cerrarás sesión en todos tus dispositivos después de cambiar la contraseña',
    REQUIREMENTS_TITLE: 'La contraseña debe contener:',
    REQ_LENGTH: 'Al menos 8 caracteres',
    REQ_UPPERCASE: 'Una letra mayúscula',
    REQ_LOWERCASE: 'Una letra minúscula',
    REQ_NUMBER: 'Un número',
    REQ_SPECIAL: 'Un carácter especial'
  },

  // Password Strength
  STRENGTH: {
    WEAK: 'Débil',
    FAIR: 'Regular',
    GOOD: 'Buena',
    STRONG: 'Fuerte',
    VERY_STRONG: 'Muy fuerte'
  },

  // Account Deletion
  DELETE: {
    HEADING: 'Eliminar cuenta',
    DESCRIPTION: 'Elimina permanentemente tu cuenta y todos tus datos',
    BUTTON_DELETE: 'Eliminar cuenta',
    WARNING_TITLE: '⚠️ Esta acción es permanente',
    WARNING_DESC: 'Al eliminar tu cuenta:',
    WARNING_ITEM_1: 'Perderás acceso a todos tus presupuestos',
    WARNING_ITEM_2: 'Se eliminarán todos tus movimientos',
    WARNING_ITEM_3: 'Se borrarán todas tus categorías personalizadas',
    WARNING_ITEM_4: 'Esta acción no se puede deshacer',
    CONFIRM_HEADING: 'Confirmación final',
    CONFIRM_DESCRIPTION:
      'Para confirmar, escribe ELIMINAR en el campo de abajo',
    CONFIRM_LABEL: 'Escribe ELIMINAR para confirmar',
    CONFIRM_PLACEHOLDER: 'ELIMINAR',
    CONFIRM_BUTTON: 'Sí, eliminar mi cuenta',
    CANCEL_BUTTON: 'Cancelar',
    MISMATCH_ERROR: 'Debes escribir ELIMINAR para confirmar'
  },

  // Success Messages
  SUCCESS: {
    NAME_UPDATED: 'Nombre actualizado correctamente',
    PASSWORD_CHANGED: 'Contraseña cambiada. Cerrando sesión...',
    ACCOUNT_DELETED: 'Cuenta eliminada. Adiós'
  },

  // Error Messages
  ERROR: {
    NAME_TOO_SHORT: 'El nombre debe tener al menos 2 caracteres',
    NAME_TOO_LONG: 'El nombre no puede tener más de 50 caracteres',
    NAME_UPDATE_FAILED: 'No se pudo actualizar el nombre',
    PASSWORD_REQUIRED: 'La contraseña es requerida',
    PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 8 caracteres',
    PASSWORD_WEAK: 'La contraseña debe ser más fuerte',
    PASSWORD_MISMATCH: 'Las contraseñas no coinciden',
    CURRENT_PASSWORD_WRONG: 'La contraseña actual es incorrecta',
    PASSWORD_CHANGE_FAILED: 'No se pudo cambiar la contraseña',
    DELETE_FAILED: 'No se pudo eliminar la cuenta',
    NETWORK_ERROR: 'Error de conexión. Intenta de nuevo.',
    UNKNOWN_ERROR: 'Ocurrió un error inesperado'
  },

  // Loading States
  LOADING: {
    PROFILE: 'Cargando perfil...',
    UPDATING_NAME: 'Actualizando nombre...',
    CHANGING_PASSWORD: 'Cambiando contraseña...',
    DELETING_ACCOUNT: 'Eliminando cuenta...'
  },

  // Tabs
  TABS: {
    GENERAL: 'General',
    SECURITY: 'Seguridad',
    ACCOUNT: 'Cuenta'
  },

  // Tooltips
  TOOLTIPS: {
    EDIT_NAME: 'Editar tu nombre de usuario',
    CHANGE_PASSWORD: 'Actualizar tu contraseña',
    DELETE_ACCOUNT: 'Eliminar permanentemente tu cuenta'
  }
} as const;
