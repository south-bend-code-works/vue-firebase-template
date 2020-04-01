<script>
import ProToast from '$common/ProToast'
import Loading from '$common/Loading'
import ModalsMain from '$modals/Main'
export default {
  name: 'App',
  components: {
    'pro-toast': ProToast,
    'loading': Loading,
    'modals-main': ModalsMain,
  },
  methods: {
    getUser (uid) {
      return new Promise(async resolve => {
        resolve((await this.$firestore.collection('users').doc(uid).get()).data())
      })
    }, 
    async listenForUser () {
      this.$auth.onAuthStateChanged(async (auth) => {
        this.$store.commit('update', {auth})
        if (auth) {
          const user = await this.getUser(auth.uid)
          this.$store.commit('update', {user})

          const defaultRoute = 'AdminApplicants'
          if (this.$route.name === defaultRoute) return //don't duplicate

          if (!['Login'].includes(this.$route.name)) return //don't navigate if the page has a plan
          
          this.$router.push(this.$route.query.redirect || {name: 'AdminApplicants'})
        }
      })
    },
  },
  mounted () {
    this.listenForUser()
  },
}
</script>


<template lang='pug'>
  #app
    modals-main
    router-view
    pro-toast
    loading
</template>

<style lang="sass">
  @import '$vars'
  body
    margin: 0
    font-family: $font-1
  #app
    position: relative
  input[type=number]::-webkit-inner-spin-button, 
  input[type=number]::-webkit-outer-spin-button
    -webkit-appearance: none
    margin: 0
</style>
