<script>
import ProNav from '$common/ProNav'
import AdminNav from '$admin/AdminNav'
export default {
  name: 'AdminMain',
  components: {
    'pro-nav': ProNav,
    'admin-nav': AdminNav,
  },
}
</script>


<template lang="pug">
  .admin-main-main
    .admin-main-container
      pro-nav
      .content
        admin-nav.admin-nav
        router-view.router-view
</template>

<style lang="sass">
  @import '$vars'
  .admin-main-main
    .admin-main-container
      height: 100vh
      background-color: white
      .content
        display: grid
        grid-template-columns: max-content auto
        .router-view
          height: calc(100vh - #{$nav-height})
          .admin-container
            padding: 40px 80px
            .header
              .title
                @extend .font-1-bold
                font-size: 40px
  @media (max-width: #{$side-nav-min})
    .admin-main-main
      .admin-main-container
        .content
          grid-template-columns: auto
          .admin-nav
            display: none
          .router-view
            .admin-container
              padding: 32px
</style>
