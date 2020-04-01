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

<style lang="sass">
  @import '$vars'
  @import '$styles/transitions.sass'
  .public-main-main
    .public-main-container
      background-color: white
      .router-view
        height: calc(100vh - #{$nav-height})
        .public-container
          padding: 40px 40px 100px 40px
          display: grid
          justify-items: center
          .copy
            text-align: center
            display: grid
            justify-items: center
            padding: 16px 0
            .title
              @extend .font-1-bold
              max-width: 800px
              font-size: 42px
              padding: 0 0 24px
            .description
              font-size: 14px
              max-width: 456px
      @media (max-width: 600px)
        .router-view
          .public-container
            padding: 24px 40px 100px 40px
            .copy
              justify-items: left
              .title
                font-size: 36px
              .description
                min-width: unset !important
</style>
