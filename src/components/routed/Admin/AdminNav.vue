<script>
import linkGroups from '@/global/js/adminNavLinks.json'
export default {
  name: 'AdminNav',
  data () {
    return {
      linkGroups, 
    }
  },
}
</script>

<template lang="pug">
  .admin-nav-main
    .admin-nav-container
      .link-group(
        v-for='group in linkGroups'
      )
        .links
          .link(
            v-for='link in group.links'
            :class='$route.name === link.route ? "chosen" : ""'
            @click='$route.name !== link.route && $router.push({name: link.route})'
          ) {{link.name}}
      .footer
        .link.font-1-bold(
          @click='() => $store.commit("logout")'
        ) Log out
</template>

<style lang="sass" scoped>
  @import '$vars'
  .admin-nav-main
    .admin-nav-container
      border-right: thin solid black
      padding: 40px 64px 40px 40px
      height: 100%
      min-height: calc(100vh - #{$nav-height})
      .link-group
        margin-bottom: 16px
        .title
          font-weight: 400
          cursor: default
        .links
          margin: 4px 0
          cursor: pointer
          .link
            @extend .font-1-bold
            font-size: 16px
            &.chosen
              color: $green
      .footer
        position: absolute
        bottom: 0
        padding: 24px 0
        .link
          cursor: pointer
          color: #777

</style>
