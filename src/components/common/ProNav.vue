<script>
import linkGroups from '@/global/js/adminNavLinks.json'
export default {
  name: 'ProNav',
  data() {
    return {
      seeMobileNav: false,
      linkGroups,
    }
  },
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
    onLinkClick (link) {
      this.seeMobileNav = false

      if (link.route === this.$route.name) return
      this.$router.push({name: link.route})
    },
  },
}
</script>

<template lang="pug">
  .pro-nav-main
    .pro-nav-container
      .title-holder(
        @click='$route.name !== "AssessmentApply" && $router.push({name: "AssessmentApply"})'
      )
        .title
          img(
            src='@/assets/img/common/logo.png'
          )
      .actions
        .logout(
          v-if='false'
          @click='logout'
        ) Logout
      .mobile-nav-button.font-1-bold(
        @click='seeMobileNav = true'
        v-if='$store.state.auth'
      ) Menu
    transition(
      name='fade'
    )
      .mobile-nav(
        v-if='seeMobileNav'
      )
        .mobile-nav-container(
          @click='seeMobileNav = false'
        )
          .content(
            @click.stop=''
          )
            .header
            .link-groups-holder
              .link-group(
                v-for='linkGroup in linkGroups'
              )
                .link.font-1-bold(
                  v-for='link in linkGroup.links'
                  :class='link.route === $route.name ? "chosen" : ""'
                  @click='onLinkClick(link)'
                ) {{link.name}}
            .footer
              .link.font-1-bold(
                @click='() => $store.commit("logout")'
              ) Log out

</template>

<style lang="sass" scoped>
  @import '$vars'
  .pro-nav-main
    position: relative
    z-index: $nav-index
    background-color: black
    .mobile-nav
      display: none
    .pro-nav-container
      height: $nav-height
      display: grid
      grid-template-columns: auto auto
      align-items: center
      padding: 5px 30px
      box-sizing: border-box
      border-bottom: thin solid black
      .title-holder
        width: fit-content
        cursor: pointer
        .title
          > img
            height: 78px
      .actions
        justify-self: end
        > *
          cursor: pointer
      .mobile-nav-button
        display: none
  @media (max-width: #{$side-nav-min})
    .pro-nav-main
      .mobile-nav
        display: block
        width: 100vw
        height: 100vh
        z-index: $mobile-nav-index
        position: absolute
        background-color: transparentize(black, .4)
        top: 0
        .mobile-nav-container
          height: 100%
          .content
            height: 100%
            background-color: white
            width: 300px
            position: absolute
            right: 0
            grid-template-rows: 48px auto
            padding: 32px
            box-sizing: border-box
            .link-groups-holder
              .link-group
                .link
                  color: $green
            .footer
              position: absolute
              padding: 32px
              bottom: 0
              .link
                cursor: pointer
                color: #777
      .pro-nav-container
        .title-holder
          .title
            > img
              height: 48px
        .actions
          display: none
        .mobile-nav-button
          display: block
          color: white
          text-align: right
          cursor: pointer
</style>
