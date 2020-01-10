<script>
import ProNav from '$common/ProNav'
export default {
  name: 'PublicMain',
  components: {
    'pro-nav': ProNav,
  },
  watch: {
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
}
</script>


<template lang="pug">
  .public-main-main
    .public-main-container
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
  .public-main-main
    .public-main-container
      background-color: white
      .router-view
        height: calc(100vh - #{$nav-height})
</style>
