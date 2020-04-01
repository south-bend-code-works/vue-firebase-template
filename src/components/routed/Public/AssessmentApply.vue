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
        phone: '5743121467',
        email: 'jorymullet@gmail.com',
        property_address_string: '633 Cottage Grove Ave, South Bend, IN 46616, USA',
        mailing_address_string: '',
        parcel_number: '71-08-02-452-011.000-026',
      }
    }
  },
  data () {
    return {
      window: window,
      state: 'user',
      error: '',
      seeMailingAddress: false,
      form: {
        name: '',
        phone: '',
        email: '',
        property_address_string: '',
        property_address_components: [],
        mailing_address_string: '',
        mailing_address_components: [],
        parcel_number: '',
      },
      formOptions: {
        name: {
          errorIf: (val) => val ? '' : 'Enter property owner\'s name',
          title: 'Property Owner\'s Name',
        },
        property_address_string: {
          errorIf: (val) => val ? '' : 'Choose property address',
          title: 'Property Address',
          type: 'address',
          onAddressSelect: (data) => {
            this.form.property_address_components = data.address_components
            if (this.seeMailingAddress) return 

            this.form.mailing_address_components = data.address_components
          },
          help: {
            copy: 'Mailing address different than property address?',
            action: () => this.seeMailingAddress = !this.seeMailingAddress,
            seeIf: () => !this.seeMailingAddress,
          },
        },
        mailing_address_string: {
          errorIf: (val) => val || !this.seeMailingAddress ? '' : 'Choose mailing address',
          seeIf: () => this.seeMailingAddress,
          title: 'Mailing Address',
          type: 'address',
          onAddressSelect: (data) => {
            this.form.mailing_address_components = data.address_components
          },
        },
        parcel_number: {
          errorIf: (val) => this.$regex.is(val).a('parcelNumber') ? '' : 'Parcel number is formatted as ##-##-##-###-###.###-###',
          title: 'Parcel Number',
          help: {
            copy: 'What is this?',
            action: () => this.$modals.show({
              name: 'alert',
              title: 'What is a parcel number?',
              message: `
                A parcel number is assigned by your local tax assessment office and is used to help identify your property for tax, title, deed and property line reasons.<br/></br/>
                The format of the parcel number is as follows: <b><br/><br/> ##-##-##-###-###.###-###</br> ex. 12-34-56-789-012.345-678</b><br/><br/>
                If you live in St. Joseph County, you can find your parecel number by clicking <a target='_blank' href='http://in-stjoseph-assessor.governmax.com/'>here</a>,
                clicking 'I accept', change 'Starts with' to 'Contains', input your name, click 'Go', and the next page will have the parcel ID which is your parcel number.
                `,
            }),
          },
        },
        phone: {
          errorIf: (val) => this.$regex.is(val).a('phone') ? '' : 'Enter valid phone number',
          title: 'Phone Number',
          type: 'phone',
        },
        email: {
          errorIf: (val) => this.$regex.is(val).a('email') ? '' : 'Enter valid email',
          title: 'Email',
          type: 'email',
        },
      },
    }
  },
  methods: {
    readyForm () {
      if (!this.seeMailingAddress) {
        this.form.mailing_address_string = this.form.property_address_string
      }
    },
    async signUp () {
      const errors = this.$proErrors()
      if (errors.length) return errors.forEach(err => this.$toast(err))
      this.readyForm()

      this.state = 'loading'

      let waitedLongEnough = false
      let responseReturned = false

      setTimeout(() => {
        waitedLongEnough = true
        if (responseReturned) {
          this.state = 'success'
        }
      }, 2500)

      try {
        await this.$HTTP({
          method: 'post',
          uri: 'applications',
          secure: false,
          body: {
            application: this.form,
            origin: window.location.origin,
          },
        })
        responseReturned = true
        if (waitedLongEnough) {
          this.state = 'success'
        }
      } catch (err) {
        this.state = 'error'
        console.log(err)
        this.error = err.body.message
      }
    },
  },
}
</script>

<template lang="pug">
  .public-apply-main.public-main
    transition(
      name='from-top'
      mode='out-in'
    )
      .public-apply-container.public-container(
        v-if='state === "user"'
        key='form'
      )
        .copy
          .title Apply to have your property assessment analyzed for free
          .description When CPT analyses your assessment, you will increase your chance of success!  Our professionals have analyzed hundreds of properties in Indiana and have countless hours of education and certification.  What that means for you is an in-depth assessment, and just leverage you need to ensure a fair tax. Fill out the form to get started!
        .pro-form
          .form-row(
            v-for='(options, field) in formOptions'
            v-if='!options.seeIf || options.seeIf()'
          )
            pro-input(
              :options='options'
              v-model='form[field]'
            )
            .help-holder
              .help(
                v-if='options.help && (!options.help.seeIf || options.help.seeIf())'
                @click='options.help.action'
              ) {{options.help.copy}}
          .form-row
            .pro-button.major(
              @click='signUp'
            ) Sign Up
      .public-apply-container.public-container(
        v-if='state === "loading"'
        key='loading'
      ) 
        .copy
          .title Sending application...
        .image-holder
          img(
            src='@/assets/svg/cube.svg'
          )
      .public-apply-container.public-container(
        v-if='state === "success"'
        key='success'
      ) 
        .copy
          .title Success!
        .image-holder
          i.green.material-icons thumb_up
        .copy
          .description Thanks for applying! We will look into your property and let you know next steps in less than a week.
        .button-holder
          .pro-button.major(
            @click='() => window.open("https://www.correctpropertytax.com/")'
          ) Back to website
      .public-apply-container.public-container(
        v-if='state === "error"'
        key='error'
      ) 
        .copy
          .title An error occurred
        .image-holder
          i.material-icons thumb_down
        .copy
          .description We're sorry, but the following error has occured:
          .error.font-1-bold {{error}}
          .description Try reloading the page and trying again.
        .button-holder
          .pro-button.major(
            @click='() => window.location.reload()'
          ) Reload page

</template>

<style lang="sass" scoped>
  @import '$styles/transitions.sass'
  @import '$styles/form.sass'
  .public-apply-main
    .public-apply-container
      .button-holder
        padding: 40px 0
      .image-holder
        margin-bottom: 24px
        > img
          width: 80px
        > i
          font-size: 64px
          &.green
            color: $green
        .error
          margin: 8px 0
          //text-align: left
      .pro-form
        max-width: 500px
        width: 100%
        margin-top: 50px
        .form-row
          position: relative
          .help-holder
            display: grid
            justify-items: right
            .help
              @extend .font-1-bold
              font-size: 14px
              text-decoration: underline
              cursor: pointer
              position: relative
              top: 4px
              color: $green
              text-align: right
              width: fit-content
</style>

