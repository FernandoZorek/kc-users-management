const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/IndexPage.vue') },
      { path: 'users', component: () => import('src/pages/UsersPage.vue') },
      { path: 'groups', component: () => import('src/pages/GroupsPage.vue') },
      { path: 'roles', component: () => import('src/pages/RolesPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
