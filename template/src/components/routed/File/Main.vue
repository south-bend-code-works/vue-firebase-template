<script>
import ProNav from '$common/ProNav'
export default {
  name: 'FileMain',
  components: {
    'pro-nav': ProNav,
  },
  watch: {
    /**
     * Controls the transitions between pages based on the transIndex
     * smaller pages are on the left and bigger pages are on the right
     */
    '$route' (newRoute, oldRoute) {
      const isHigherRoute = newRoute.meta.transIndex > oldRoute.meta.transIndex
      this.transtionName = isHigherRoute ? 'slide-left' : 'slide-right'
    },
  },
  data () {
    return {
      transtionName: 'slide-left',
    }
  },
  async mounted () {
    /**
     * Figure out what you need here
     */
  },
}
</script>

<template lang="pug">
  .file-main-main
    .file-main-container
      pro-nav
      transition(
        :name='transtionName'
        mode='out-in'
      )
        router-view.router-view(
          :key="$route.name"
        )
</template>

<style lang="sass" scoped>
  @import '$vars'
  @import '$styles/transitions.sass'
  .file-main-main
    .file-main-container
      background-color: white
      .router-view
        height: calc(100vh - #{$nav-height})
</style>
