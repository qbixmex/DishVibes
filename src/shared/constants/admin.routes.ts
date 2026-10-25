export const ADMIN_ROUTES = {
  DASHBOARD: '/admin/dashboard',
  DISHES: '/admin/dishes',
  DISHES_SHOW: (id: string) => `/admin/dishes/${id}`,
  DISHES_CREATE: (id: string) => `/admin/dishes/create/${id}`,
  DISHES_EDIT: (id: string) => `/admin/dishes/edit/${id}`,
};
