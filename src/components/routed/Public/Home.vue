<script>
import ProInput from '$common/ProInput'
export default {
  name: 'PublicHome',
  components: {
    'pro-input': ProInput,
  },
  data () {
    return {
      form: {
        email: '',
        password: '',
      },
      formOptions: {
        email: {
          errorIf: (val) => this.$regex.is(val).a('email') ? '' : 'Enter valid email',
          title: 'Email',
          onEnter: this.login,
        },
        password: {
          errorIf: () => '',
          title: 'Password',
          type: 'password',
          onEnter: this.login,
        },
      },
    }
  },
  methods: {
    async login () {
      this.$showLoading()
      let loginRes
      try {
        loginRes = await this.$auth.signInWithEmailAndPassword(this.form.email, this.form.password)
      } catch (err) {
        this.$hideLoading()
        return this.$toast(err.message)
      }
      loginRes
    },
  },
}
</script>

<template lang="pug">
  .public-home-main
    .public-home-container
      .content
        .header.font-1-thin Be confident about 
          span.bold.font-1-bold your file.
        .info-action
          .info-holder
            .item File in minutes
            .item 100s of file types
            .item Up-to-date language
          .action
            .pro-form
              .form-row(
                v-for='(options, field) in formOptions'
              )
                pro-input(
                  :options='options'
                  v-model='form[field]'
                )
              .form-row.buttons-2
                .pro-button(

                ) Forgot Password
                .pro-button.outline.major(
                  @click='login'
                ) Sign in
        .sign-up-holder
          .copy Don't have an account? 
          .pro-button.outline(
            @click='() => $router.push({name: "PublicSignUp"})'
          ) Get one here
</template>

<style lang="sass" scoped>
  @import '$vars'
  @import '$styles/form.sass'
  .public-home-main
    .public-home-container
      .content
        display: grid
        justify-items: center
        padding-top: 80px
        width: fit-content
        margin: 0 auto
        .header
          font-size: 3em
          padding: 30px 0
          > .bold
            text-decoration: underline
        .info-action
          padding: 15px 0
          width: 100%
          display: grid
          grid-template-columns: max-content auto
          .info-holder
            background-color: $nh-yellow
            border:  thin solid $nh-amber
            padding: 20px 35px
            .item
              @extend .font-1-thin
              display: list-item
              list-style-type: disc
              list-style-position: inside
              font-size: 1.4em
              margin: 25px 0
              width: fit-content
          .action
            padding: 20px 0 0 80px
            .pro-form
              .buttons-1
                padding-top: 15px
        .sign-up-holder
          padding: 50px 0
          justify-self: baseline
          > *
            display: inline
          .pro-button
            margin-left: 25px
</style>
