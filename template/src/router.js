import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const admin = {
  main: () => import('@/components/routed/Admin/Main.vue'),
}

const _public = {
  main: () => import('@/components/routed/Public/Main.vue'),
  home: () => import('@/components/routed/Public/Home.vue'),
  signUp: () => import('@/components/routed/Public/SignUp.vue'),
}

const file = {
  main: () => import('@/components/routed/File/Main.vue'),
  dashboard: () => import('@/components/routed/File/Dashboard.vue'),
}

const authorizeEntry = (options) => {
  const main = require('../src/main')
  const auth = main.auth
  if (!auth.currentUser) return options.next({name: 'PublicHome', query: {redirect: options.to.fullPath}})
  options.next()
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
          path: '/',
          name: 'PublicHome',
          component: _public.home,
          meta: {
            transIndex: 0,
          },
        },
        {
          path: 'sign-up',
          name: 'PublicSignUp',
          component: _public.signUp,
          meta: {
            transIndex: 30,
          },
        },
      ],
    },
    {
      path: '/files',
      component: file.main,
      beforeEnter: (to, from, next) => {
        authorizeEntry({to, from, next})
      },
      children: [
        {
          path: '/',
          name: 'FileDashboard',
          component: file.dashboard,
          meta: {
            transIndex: 50,
          },
        },
      ],
    },
    {
      path: 'admin',
      component: admin.main,
    },
  ]
})

export default router