<script>
export default {
  name: 'ProNav',
  computed: {
    auth () {
      return this.$store.state.auth
    },
  },
  methods: {
    logout () {
      this.$store.commit('logout')
      this.$router.push({name: 'PublicHome'})
    },
  },
}
</script>

<template lang="pug">
  .pro-nav-main
    .pro-nav-container
      .title-holder
        .title(
          @click='$flashLoading(() => $router.push({name: "PublicHome"}))'
        ) Vue Firebase Template
      .actions
        .logout(
          v-if='auth'
          @click='logout'
        ) Logout
</template>

<style lang="sass" scoped>
  @import '$vars'
  .pro-nav-main
    position: relative
    z-index: $nav-index
    .pro-nav-container
      height: $nav-height
      background-color: $nh-amber
      display: grid
      grid-template-columns: auto auto
      align-items: center
      padding: 5px 30px
      box-sizing: border-box
      border-bottom: thin solid black
      .title-holder
        width: fit-content
        .title
          font-family: $font-2
          font-size: 1.5em
          position: relative
          top: 0px
          cursor: pointer
      .actions
        justify-self: end
        > *
          cursor: pointer
</style>
