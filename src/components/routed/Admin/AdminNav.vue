<script>
export default {
  name: 'AdminNav',
  data () {
    return {
      linkGroups: [
        {
          title: 'Database',
          links: [
            {
              name: 'Populate via CSV',
              route: 'AdminPopulate',
            }
          ]
        },
      ]
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
        .title {{group.title}}
        .links
          .link(
            v-for='link in group.links'
            @click='$router.push({name: link.route})'
          ) {{link.name}}
</template>

<style lang="sass" scoped>
  @import '$vars'
  .admin-nav-main
    .admin-nav-container
      padding: 0 40px
      .link-group
        .title
          font-weight: 400
          cursor: default
        .links
          padding: 5px 0 0 10px
          cursor: pointer
          .link
            font-size: .9em
            font-weight: 300

</style>
