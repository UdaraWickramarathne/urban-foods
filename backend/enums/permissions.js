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

export const ADMIN_PERMISSIONS = [
  PERMISSIONS.VIEW_CUSTOMERS,
  PERMISSIONS.CREATE_CUSTOMERS,
  PERMISSIONS.EDIT_CUSTOMERS,
  PERMISSIONS.DELETE_CUSTOMERS,
  PERMISSIONS.VIEW_PRODUCTS,
  PERMISSIONS.CREATE_PRODUCTS,
  PERMISSIONS.EDIT_PRODUCTS,
  PERMISSIONS.DELETE_PRODUCTS,
  PERMISSIONS.VIEW_CATEGORIES,
  PERMISSIONS.CREATE_CATEGORIES,
  PERMISSIONS.EDIT_CATEGORIES,
  PERMISSIONS.DELETE_CATEGORIES,
  PERMISSIONS.VIEW_USERS,
  PERMISSIONS.CREATE_USERS,
  PERMISSIONS.EDIT_USERS,
  PERMISSIONS.DELETE_USERS,
  PERMISSIONS.VIEW_SUPPLIERS,
  PERMISSIONS.CREATE_SUPPLIERS,
  PERMISSIONS.EDIT_SUPPLIERS,
  PERMISSIONS.DELETE_SUPPLIERS,
  PERMISSIONS.VIEW_ORDERS,
  PERMISSIONS.CREATE_ORDERS,
  PERMISSIONS.EDIT_ORDERS,
  PERMISSIONS.DELETE_ORDERS,
];


// Permission mapping from DB privilege to application permission
export const DB_PRIVILEGE_MAP = {
  SELECT: 'VIEW',
  INSERT: 'CREATE',
  UPDATE: 'EDIT',
  DELETE: 'DELETE'
};

export default {
  PERMISSIONS,
  DB_PRIVILEGE_MAP,
  ADMIN_PERMISSIONS
};
