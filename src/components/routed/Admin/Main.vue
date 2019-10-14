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
        admin-nav
        router-view.router-view
</template>

<style lang="sass" scoped>
  @import '$vars'
  .admin-main-main
    .admin-main-container
      height: 100vh
      background-color: white
      .content
        display: grid
        grid-template-columns: max-content auto
        margin-top: 40px
        .router-view
          height: calc(100vh - #{$nav-height})
</style>
