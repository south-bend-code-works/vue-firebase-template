<script>
import ProToast from '$common/ProToast'
import Loading from '$common/Loading'
export default {
  name: 'App',
  components: {
    'pro-toast': ProToast,
    'loading': Loading,
  },
  methods: {
    getEntities (uid) {
      return uid
    },
    async listenForUser () {
      this.$auth.onAuthStateChanged(async (auth) => {
        this.$store.commit('update', {auth})
        if (auth) {
          const entities = await this.getEntities(auth.uid)
          console.log(entities)
          this.$router.push({name: 'FileDashboard'})
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
    router-view
    pro-toast
    loading
</template>

<style lang="sass">
  @import '$vars'
  body
    background-color: $nh-yellow
    margin: 0
    font-family: $font-1
  #app
    position: relative
</style>
