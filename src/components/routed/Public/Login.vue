<script>
import ProInput from '$common/ProInput'
export default {
  name: 'PublicLogin',
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
          errorIf: val => this.$regex.is(val).an('email') ? '' : 'Please input actual email',
          title: 'Email',
        },
        password: {
          errorIf: val => val ? '' : 'Please input password',
          title: 'Password',
          type: 'password',
        },
      },
      buttonCopy: 'Submit',
    }
  },
  computed: {
    errors () {
      return this.$proErrors()
    },
  },
  methods: {
    async login () {
      if (this.errors.length) return this.errors.forEach(error => this.$toast(error))
      
      this.buttonCopy = 'Loading...'
      try {
        await this.$auth.signInWithEmailAndPassword(this.form.email, this.form.password)
      } catch (err) {
        console.error(err)
        this.buttonCopy = 'Submit'
        this.$toast(err.message)
      }
    }
  },
}
</script>

<template lang="pug">
  #login-main.public-main
    .login-container.public-container
      .copy
        .title Login
        .description This is only for admin access.
      .form-holder
        .pro-form
          .form-row(
            v-for='(options, key) in formOptions'
          )
            pro-input(
              v-model='form[key]'
              :options='options'
            )
          .form-row.buttons-1
            .pro-button.major(
              @click='login'
            ) {{buttonCopy}}
</template>

<style lang="sass" scoped>
  @import '$styles/form'
  #login-main
    .login-container
      .copy
        justify-items: center
      .form-holder
        margin-top: 24px
        width: 100%
        max-width: 400px
</style>