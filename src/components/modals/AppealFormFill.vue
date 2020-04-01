<script>
import ProInput from '$common/ProInput'
export default {
  name: 'AppealFormFill',
  components: {
    'pro-input': ProInput,
  },
  props: {
    options: {
      required: true,
    },
  },
  watch: {
    'form.legal_description' (desc) {
      if (desc !== 'wowz') return

      this.form.land_current = 51000
      this.form.improvements_current = 42000
      this.form.land_should = 45000
      this.form.improvements_should = 30000
      this.form.legal_description = ''
    },
  },
  data() {
    return {
      form: {
        county: '',
        township: '',
        name: '',
        phone: '',
        email: '',
        property_address_string: '',
        mailing_address_string: '',
        parcel_number: '',
        land_current: '',
        improvements_current: '',
        land_should: '',
        improvements_should: '',
        legal_description: '',
        reasons_for_request: '',
      },
      formOptions: {
        county: {
          errorIf: (val) => val ? '' : 'Enter county',
          title: 'County',
        },
        township: {
          errorIf: (val) => val ? '' : 'Enter township',
          title: 'Township',
        },
        name: {
          errorIf: (val) => val ? '' : 'Enter property owner\'s name',
          title: 'Property Owner\'s Name',
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
        property_address_string: {
          errorIf: (val) => val ? '' : 'Choose property address',
          title: 'Property Address',
        },
        mailing_address_string: {
          errorIf: (val) => val ? '' : 'Choose mailing address',
          title: 'Mailing Address',
        },
        parcel_number: {
          errorIf: (val) => this.$regex.is(val).a('parcelNumber') ? '' : 'Parcel number is formatted as ##-##-##-###-###.###-###',
          title: 'Parcel Number',
        },
        land_current: {
          errorIf: (val) => val || (val === 0) ? '' : 'Enter current land value',
          title: 'Current Land Value',
          type: 'number',
        },
        improvements_current: {
          errorIf: (val) => val || (val === 0) ? '' : 'Enter current improvements value',
          title: 'Current Improvements Value',
          type: 'number',
        },
        land_should: {
          errorIf: (val) => val || (val === 0) ? '' : 'Enter reassessed land value',
          title: 'Reassessed Land Value',
          type: 'number',
        },
        improvements_should: {
          errorIf: (val) => val || (val === 0) ? '' : 'Enter reassessed improvements value',
          title: 'Reassessed Improvements Value',
          type: 'number',
        },
        legal_description: {
          title: 'Legal Description (optional)',
        },
        reasons_for_request: {
          errorIf: (val) => val ? '' : 'Include reasons for request',
          title: 'Reasons For Request',
          type: 'textarea',
          height: '150px',
        },
      },
    }
  },
  methods: {
    prepareForm () {
      Object.keys(this.form).forEach(key => {
        this.form[key] = this.options.application[key]
      })
      // autofills county and township to save time
      const fieldToComponentName = {
        county: 'administrative_area_level_2',
        township: 'administrative_area_level_3'
      }
      Object.keys(fieldToComponentName).forEach(field => {
        this.form[field] = this.options.application.property_address_components.find(comp => comp.types.includes(fieldToComponentName[field])).long_name
      })
      // starting text that is typically what Beth desires
      this.form.reasons_for_request = 'Proposed assessment is based on sales comparison data and physical characteristics of my property. See attached evidence supporting the proposal.'
      // legal_description is within questionnaire so we must dig it out
      this.form.legal_description = this.options.application.questionnaire.legal_description
    },
    readyForm () {
      const form = this.$clone(this.form)
      form.legal_description = form.legal_description || 'N/A'

      // adds a break every 100ish
      const lineBreaker = '______IBREAKTHELINE______'
      form.reasons_for_request = form.reasons_for_request
        .split(' ') // splits into 'words' of sorts as to avoid adding breaks between words
        // then checks to see if the current line is under 100 and adds a break if not
        .reduce((acc, chunk, idx) => acc + chunk + ((acc.length - acc.lastIndexOf(lineBreaker)) < 100 ? ' ' : lineBreaker), '')
        .split(lineBreaker)

      // forces the array to be 8 long
      form.reasons_for_request = [...form.reasons_for_request, ...Array(Math.max(8 - form.reasons_for_request.length, 0)).fill('|')]

      //MAKE THE STATUSES CHANGE AND INCLUDE NEW STATUSES AND FIGURE OUT HOW TO RESEND REMAKE 

      return form
    },
    async sendAppealForm () {
      if (this.$proErrors().length) return this.$proErrors().forEach(err => this.$toast(err))

      const form = this.readyForm()

      /* eslint-disable */
      //return console.log(form)

      try {
        this.$toast('Sending...')
        this.$modals.hide('appeal-form-fill')
        this.$modals.hide('application-viewer')
        const appealFormResponse = await this.$HTTP({
          method: 'post',
          uri: 'forms/appeal-form',
          body: {
            applicationId: this.options.application.id,
            form,
            origin: window.location.origin,
          },
        })
        this.$toast('Sent!')
      } catch (err) {
        console.error(err)
        this.$toast(err.body.message)
      }
    },
  },
  beforeMount () {
    this.prepareForm()
  },
}
</script>

<template lang="pug">
  #appeal-form-fill-main.modal-main
    .appeal-form-fill-container.modal-container
      .title Appeal Form Prefill
      .content
        .instruction Make adjustments and fill in the data as necessary.
        .form-holder
          .pro-form
            .form-row(
              v-for='(options, key) in formOptions'
            )
              pro-input(
                v-model='form[key]'
                :options='options'
              )
      .action
        .button(
          @click='sendAppealForm'
        ) Send appeal form
        .button.cancel(
          @click='$modals.hide("appeal-form-fill")'
        ) Cancel
</template>

<style lang="sass" scoped>
  @import '$styles/form'
  #appeal-form-fill-main
    .appeal-form-fill-container
      .content
        .instruction
          @extend .font-1-bold
          font-size: 14px
        .form-holder
          margin-top: 32px
</style>