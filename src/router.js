import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const admin = {
  main: () => import('@/components/routed/Admin/Main.vue'),
  applicants: () => import('@/components/routed/Admin/Applicants.vue'),
}

const _public = {
  main: () => import('@/components/routed/Public/Main.vue'),
  assessmentApply: () => import('@/components/routed/Public/AssessmentApply.vue'),
  agreementAndPayment: () => import('@/components/routed/Public/AgreementAndPayment.vue'),
  login: () => import('@/components/routed/Public/Login.vue'),
  appealQuestionnaire: () => import('@/components/routed/Public/AppealQuestionnaire.vue'),
  appealSignedSuccess: () => import('@/components/routed/Public/AppealSignedSuccess.vue'),
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
          path: '/apply',
          name: 'AssessmentApply',
          component: _public.assessmentApply,
          meta: {
            transIndex: 10,
          },
        },
        {
          path: '/agreement-and-payment',
          name: 'AgreementAndPayment',
          component: _public.agreementAndPayment,
          meta: {
            transIndex: 20,
          },
        },
        {
          path: '/appeal-questionnaire',
          name: 'AppealQuestionnaire',
          component: _public.appealQuestionnaire,
          meta: {
            transIndex: 30,
          },
        },
        {
          path: '/login',
          name: 'Login',
          component: _public.login,
          meta: {
            transIndex: 0,
          },
        },
        {
          path: '/signed-success',
          name: 'AppealSignedSuccess',
          component: _public.appealSignedSuccess,
          meta: {
            transIndex: 25,
          },
        },
        {
          path: '/',
          beforeEnter (to, from, next) {
            next({name: 'AssessmentApply'})
          },
        },
      ],
    },
    {
      path: '/admin',
      component: admin.main,
      children: [{
        path: 'applicants',
        name: 'AdminApplicants',
        component: admin.applicants,
        meta: {
          transIndex: 70,
          roles: ['ADMIN'],
        },
      },
      {
        path: '/',
        beforeEnter (to, from, next) {
          next({name: 'AdminApplicants'}) //prevents /admin from navigating to nothing
        }
      }],
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