import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    inquiries: [],
    categories: [],
    auth: null,
    user: null,
    org: null,
    userOrgs: [],
    orgUserRelationships: [],
  },
  mutations: {
    update (state, update) {
      Object.keys(update).forEach(key => state[key] = update[key])
    },
    logout (state) {
      state.auth = null
      /**
       * Should unsubscribe to listeners in here if any were instantiated
       */
      const auth = require('../src/main').auth
      auth.signOut()
    },
  },
  actions: {
    async getInterviewData (store, {thisVue, next}) {
      const getAndParseData = (entity) => new Promise(async resolve => resolve((await thisVue.$firestore.collection(entity).get()).docs.map(doc => doc.data())))
      const categories = await getAndParseData('categories')
      const inquiries = await getAndParseData('inquiries')
      store.commit('update', {
        inquiries,
        categories,
      })
      next()
    },
  }
})
