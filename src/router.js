import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const admin = {
  main: () => import('@/components/routed/Admin/Main.vue'),
}

const _public = {
  main: () => import('@/components/routed/Public/Main.vue'),
  login: () => import('@/components/routed/Public/Login.vue'),
}

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: _public.main,
      children: [
        {
          path: '/login',
          name: 'Login',
          component: _public.login,
          meta: {
            transIndex: 0,
          },
        },
      ],
    },
  ]
})

router.beforeEach((to, from, next) => {
  // /* eslint-disable */
  // return next()

  const store = require('./store.js').default
  
  const roles = to.meta.roles
  if (!roles) return next()

  const user = store.state.user
  if (!(user && roles.includes(user.role))) return next({name: 'Login', query: {redirect: to.fullPath}})
  
  next()
})

export default router