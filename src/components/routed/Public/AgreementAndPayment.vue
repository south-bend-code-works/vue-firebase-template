<script>
export default {
  name: 'AgreementAndPayment',
  data() {
    return {
      window,
      stage: 'payment',
    }
  },
  methods: {
    async showCardModal () {
      if (!this.applicationId) return this.$toast({
        copy: 'Something went wrong. Please click on link in email again.',
        time: 4000,
      })

      const [application, prices] = (await Promise.all([
        this.$firestore.collection('applications').doc(this.applicationId).get(),
        this.$firestore.collection('system').doc('prices').get(),
      ])).map(ss => ss.data() || {})

      const amount = application.override_price || prices.residential //in case price is overridden by the specific application

      this.$modals.show({
        name: 'card-input',
        message: `You will be charged ${this.$toCurrency(amount)}`,
        onSuccess: token => new Promise(async (resolve, reject) => {
          try {
            await this.$HTTP({
              method: 'post',
              uri: `applications/${this.applicationId}/payment`,
              body: {
                token,
                origin: window.location.origin,
              },
              secure: false,
            })
            resolve()
            this.$modals.hide('card-input')
            this.stage = 'success'
          } catch (err) {
            const isAlreadyPaid = this.$dig(err, ['body', 'code']) === 'ALREADY_PAID'
            if (isAlreadyPaid) {
              this.$toast('Already paid! You will not be charged again.')
              resolve()
              this.$modals.hide('card-input')
              this.stage = 'success'
            } else {
              console.log(err)
              reject(err.body.message)
            }
          }
        }),
      })
    },
  },
  computed: {
    applicationId () {
      return this.$route.query.applicationId
    },
  },
}
</script>

<template lang="pug">
  #agreement-and-payment-main.public-main
    .agreement-and-payment-container.public-container
      transition(
        name='from-top'
        mode='out-in'
      )
        .content(
          v-if='stage === "payment"'
          key='payment'
        )
          .copy
            .title Your application has been approved!
            .description 
              | We believe your property should be reassessed and are excited to begin.
            .description
              | Before continuing, we require client's to pay for our services. After
              | successful payment, we can begin with the reassessment.
          .action
            //.disclaimer By continuing, you agree to all previous statements.
            .pro-button.major(
              @click='showCardModal'
            ) Continue to payment
        .content(
          v-if='stage === "success"'
          key='success'
        )
          .copy
            .title Payment Success!
            .image-holder
              i.material-icons thumb_up
            .action
              .disclaimer Click below to start your appeal.
              .pro-button.major.center(
                @click='() => $router.push({name: "AppealQuestionnaire", query: {applicationId}})'
              ) Start appeal

</template>

<style lang="sass" scoped>
  @import '$styles/transitions.sass'
  #agreement-and-payment-main
    .agreement-and-payment-container
      .content
        display: grid
        justify-items: center
        .copy
          .description
            min-width: 456px
            margin-bottom: 16px
            text-align: left
            &.center
              text-align: center
          .image-holder
            margin-bottom: 24px
            justify-self: center
            > i
              font-size: 64px
              color: green
          .pro-button
            margin: 16px 0
          .explain-holder
            overflow-y: scroll
            max-height: 400px
            border: thin black solid
            padding: 16px
            border-radius: 8px
            box-shadow: 0 0 8px 0 inset $darkgrey
        .action
          display: grid
          //justify-items: center
          max-width: 456px
          width: 100%
          .disclaimer
            @extend .font-1-bold
            //width: 320px
            //text-align: center
            margin-bottom: 24px
          .pro-button
            &.center
              justify-self: center
</style>