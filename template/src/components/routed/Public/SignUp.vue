<script>
import ProInput from '$common/ProInput'
export default {
  name: 'PublicSignUp',
  components: {
    'pro-input': ProInput,
  },
  watch: {
    'form.name': function (val) {
      if (val !== 'wowz') return
      this.form = {
        name: 'Joshua Ryan',
        organization_name: 'Joshua\'s Goat Material',
        email: 'jorymullet@gmail.com',
        password: 'password',
        repeat_password: 'password',
      }
    }
  },
  data () {
    return {
      form: {
        name: '',
        organizaition_name: '',
        email: '',
        password: '',
        repeat_password: '',
      },
      formOptions: {
        name: {
          errorIf: (val) => val ? '' : 'Enter name',
          title: 'Your name',
        },
        organization_name: {
          errorIf: (val) => val ? '' : 'Enter organization name',
          title: 'Name of organization',
        },
        email: {
          errorIf: (val) => this.$regex.is(val).a('email') ? '' : 'Enter valid email',
          title: 'Email',
        },
        password: {
          errorIf: (val) => val && val.length >= 8 ? '' : 'Must be 8 characters or more',
          title: 'Password',
          type: 'password',
        },
        repeat_password: {
          errorIf: (val) => this.form.password === val ? '' : 'Passwords must match',
          title: 'Repeat password',
          type: 'password',
        },
      },
    }
  },
  methods: {
    async signUp () {
      const errors = this.$proErrors()
      if (errors.length) return errors.forEach(err => this.$toast(err))
      this.$showLoading()

      let userRes
      try {
        userRes = await this.$HTTP({
          method: 'post',
          uri: 'users',
          secure: false,
          body: this.form,
        })
      } catch (err) {
        console.log(err)
        this.$hideLoading()
        return alert(err.body.message)
      }
      const authToken = userRes.body.authToken
      await this.$auth.signInWithCustomToken(authToken)
      this.$hideLoading()
    },
  },
}
</script>

<template lang="pug">
  .public-sign-up-main
    .public-sign-up-container
      .pro-form
        .title Sign Up
        .form-row(
          v-for='(options, field) in formOptions'
        )
          pro-input(
            :options='options'
            v-model='form[field]'
          )
        .form-row.buttons-2
          .pro-button.outline.minor(
            @click='$router.go(-1)'
          ) Back
          .pro-button.outline.major(
            @click='signUp'
          ) Sign Up
</template>

<style lang="sass" scoped>
  @import '$styles/form.sass'
  .public-sign-up-main
    .public-sign-up-container
      display: grid
      justify-items: center
      .pro-form
        max-width: 500px
        width: 100%
        margin-top: 50px
</style>

