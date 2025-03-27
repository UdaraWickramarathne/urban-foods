// Define available permissions
export const PERMISSIONS = {
  // Customer permissions
  VIEW_CUSTOMERS: 'VIEW_CUSTOMERS',
  CREATE_CUSTOMERS: 'CREATE_CUSTOMERS',
  EDIT_CUSTOMERS: 'EDIT_CUSTOMERS',
  DELETE_CUSTOMERS: 'DELETE_CUSTOMERS',
  
  // Product permissions
  VIEW_PRODUCTS: 'VIEW_PRODUCTS',
  CREATE_PRODUCTS: 'CREATE_PRODUCTS',
  EDIT_PRODUCTS: 'EDIT_PRODUCTS',
  DELETE_PRODUCTS: 'DELETE_PRODUCTS',
  
  // Category permissions
  VIEW_CATEGORIES: 'VIEW_CATEGORIES',
  CREATE_CATEGORIES: 'CREATE_CATEGORIES',
  EDIT_CATEGORIES: 'EDIT_CATEGORIES',
  DELETE_CATEGORIES: 'DELETE_CATEGORIES',
  
  // User permissions
  VIEW_USERS: 'VIEW_USERS',
  CREATE_USERS: 'CREATE_USERS',
  EDIT_USERS: 'EDIT_USERS',
  DELETE_USERS: 'DELETE_USERS',
  
  // Supplier permissions
  VIEW_SUPPLIERS: 'VIEW_SUPPLIERS',
  CREATE_SUPPLIERS: 'CREATE_SUPPLIERS',
  EDIT_SUPPLIERS: 'EDIT_SUPPLIERS',
  DELETE_SUPPLIERS: 'DELETE_SUPPLIERS',

  // Order permissions
  VIEW_ORDERS: 'VIEW_ORDERS',
  CREATE_ORDERS: 'CREATE_ORDERS',
  EDIT_ORDERS: 'EDIT_ORDERS',
  DELETE_ORDERS: 'DELETE_ORDERS',
};

/**
 * Check if the user has a specific permission
 * @param {Array} userPermissions - Array of permission strings returned from the backend
 * @param {String} permission - The permission to check for
 * @returns {Boolean} - Whether the user has the permission
 */
export const hasPermission = (userPermissions, permission) => {
  if (!userPermissions || !Array.isArray(userPermissions) || !permission) {
    return false;
  }
  
  return userPermissions.includes(permission);
};

/**
 * Check if the user has any of the specified permissions
 * @param {Array} userPermissions - Array of permission strings returned from the backend
 * @param {Array} permissions - Array of permissions to check
 * @returns {Boolean} - Whether the user has any of the permissions
 */
export const hasAnyPermission = (userPermissions, permissions) => {
  if (!userPermissions || !Array.isArray(userPermissions) || !permissions || !Array.isArray(permissions)) {
    return false;
  }
  
  return permissions.some(permission => userPermissions.includes(permission));
};

/**
 * Check if the user has all of the specified permissions
 * @param {Array} userPermissions - Array of permission strings returned from the backend
 * @param {Array} permissions - Array of permissions to check
 * @returns {Boolean} - Whether the user has all of the permissions
 */
export const hasAllPermissions = (userPermissions, permissions) => {
  if (!userPermissions || !Array.isArray(userPermissions) || !permissions || !Array.isArray(permissions)) {
    return false;
  }
  
  return permissions.every(permission => userPermissions.includes(permission));
};