<script>
export default {
  name: 'AppealSignedSuccess',
  data () {
    return {
      window,
    }
  },
}
</script>

<template lang="pug">
  #appeal-signed-success-main.public-main
    .appeal-signed-success-container.public-container
      .copy
        .title Appeal signed!
      .image-holder
        i.green.material-icons thumb_up
      .copy
        .description Thanks for signing the appeal form. We can now file your appeal. You will receive an email when this occurs.
      .pro-button.major(
        @click='window.open("https://www.correctpropertytax.com/")'
      ) Visit Our Site
</template>

<style lang="sass" scoped>
  #appeal-signed-success-main
    .appeal-signed-success-container
      .image-holder
        padding-bottom: 24px
        .green
          color: $green
          font-size: 48px
      .pro-button
        margin-top: 16px
</style>