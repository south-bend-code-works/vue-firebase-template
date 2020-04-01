<script>
import ProInput from '$common/ProInput'
export default {
  name: 'EmailPreparer',
  props: {
    options:{
      required: true,
    },
  },
  components: {
    'pro-input': ProInput,
  },
  data() {
    return {
      form: {
        to: '',
        from: '',
        bcc: '',
        body: '',
      },
      formOptions: {
        to: {
          errorIf: (val) => this.$regex.is(val).a('email') ? '' : 'Enter valid to email',
          title: 'To',
          type: 'email',
        },
        from: {
          errorIf: (val) => this.$regex.is(val).a('email') ? '' : 'Enter valid from email',
          title: 'From',
          type: 'email',
        },
        bcc: {
          errorIf: (val) => !val || this.$regex.is(val).a('email') ? '' : 'Enter valid bcc email',
          title: 'Bcc',
          type: 'email',
        },
        body: {
          title: 'Body',
          type: 'textarea',
          height: '324px',
        },
      },
    }
  },
  computed: {
    application () {
      return this.options.application
    },
  },
  methods: {
    prepareForm () {
      this.$forceUpdate()
      this.$nextTick(() => {
        this.form.to = JSON.parse(process.env.VUE_APP_FIREBASE_CONFIG).projectId === 'correct-property-tax' ? 'AppealsDep@sjcindiana.com' : 'josh@southbendcodeschool.com'
        this.form.body = '​Dear Assessor,\n\nPlease see attached appeal form for my property.  Also attached are documents to be used as evidence of the proposed assessment.\n\nMy phone number and email are both listed on the form.  Please reach out to me if you would like to schedule a phone meeting.\n\nThank you for your time and consideration given to this important matter.\n\nRespectfully Submitted,\n\n' + this.application.name
        this.form.from = this.application.email
        this.form.bcc = this.application.email
      })
    },
    async sendEmail () {
      const errors = this.$proErrors()
      if (errors.length) return errors.forEach(err => this.$toast(err))

      this.$toast('Email sending...')
      this.$modals.hide()

      try {
        await this.$HTTP({
          method: 'post',
          uri: `applications/${this.application.id}/assessors-email`,
          body: {
            form: this.form,
            origin: window.location
          },
        })
      } catch (err) {
        console.error(err)
        this.$modals.show({
            name: 'email-preparer',
            application: this.application,
        })
        return this.$toast({
          copy: err.body.message,
          time: 5000,
        })
      }

      this.$toast('Email sent!')
    },
  },
  mounted () {
    this.prepareForm()
  },
}
</script>

<template lang="pug">
  #email-preparer-main.modal-main
    .email-prarer-container.modal-container 
      .title Prepare email to assessor
      .content
        .description Make changes as necessary before sending.
        .pro-form
          .form-row(
            v-for='(options, key) in formOptions'
          )
            pro-input(
              :options='options'
              v-model='form[key]'
            )
        .description.font-1-bold Appeal form and all evidence will be attached.
      .action
        .button(
          @click='sendEmail'
        ) Send email
        .button.cancel(
          @click='$modals.hide("email-preparer")'
        ) Cancel
</template>

<style lang="sass" scoped>
  @import '$styles/form'
  #email-preparer-main
    width: calc(100% - 40px)
    max-width: 400px
    .email-prarer-container
</style>