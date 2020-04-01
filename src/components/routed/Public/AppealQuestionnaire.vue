<script>
import ProInput from '$common/ProInput'
export default {
  name: 'AppealQuestionnaire',
  components: {
    'pro-input': ProInput,
  },
  watch: {
    'form.comments' (comments) {
      if (comments !== 'wowz') return

      this.form = {
        square_footage: '1000 - 1500',
        year_built: '1960 – 1980',
        bathroom_count: '2',
        have_basement: true,
        basement_finished: false,
        amenities: ['Pole Building'],
        legal_description: 'Izza Muh House',
        comments: '',
      }
    },
  },
  data() {
    return {
      window,
      stage: 'appeal',
      error: '',
      form: {
        square_footage: '',
        year_built: '',
        bathroom_count: '',
        have_basement: '',
        basement_finished: '',
        amenities: [],
        legal_description: '',
        comments: '',
      },
      formOptions: {
        square_footage: {
          type: 'checkbox',
          prompt: 'What is the square footage of your house?',
          errorIf: val => val ? '' : 'Choose square footage',
          options: [
            {
              name: 'Less than 1000',
              value: 'Less than 1000',
            },
            {
              name: '1000 - 1500',
              value: '1000 - 1500',
            },
            {
              name: '1500 - 2000',
              value: '1500 - 2000',
            },
            {
              name: '2000 - 2500',
              value: '2000 - 2500',
            },
            {
              name: '2500 - 3000',
              value: '2500 - 3000',
            },
            {
              name: '3000 - 4000',
              value: '3000 - 4000',
            },
            {
              name: 'Other',
              value: 'Other',
            },
          ],
        },
        year_built: {
          type: 'checkbox',
          prompt: 'What year was your house built?',
          errorIf: val => val ? '' : 'Choose year built',
          options: [
            {
              name: 'Before 1900',
              value: 'Before 1900',
            },
            {
              name: '1900 – 1940',
              value: '1900 – 1940',
            },
            {
              name: '1940 – 1960',
              value: '1940 – 1960',
            },
            {
              name: '1960 – 1980',
              value: '1960 – 1980',
            },
            {
              name: '1980 – 2000',
              value: '1980 – 2000',
            },
            {
              name: '2000 – 2020',
              value: '2000 – 2020',
            },
          ],
        },
        bathroom_count: {
          type: 'checkbox',
          prompt: 'How many bathrooms do you have?',
          errorIf: val => val ? '' : 'Choose bathroom amount',
          options: [
            {
              name: '1',
              value: '1',
            },
            {
              name: '1.5',
              value: '1.5',
            },
            {
              name: '2',
              value: '2',
            },
            {
              name: '2.5',
              value: '2.5',
            },
            {
              name: '3 or more',
              value: '3 or more',
            },
          ],
        },
        have_basement: {
          type: 'checkbox',
          prompt: 'Do you have a basement?',
          errorIf: val => val !== '' ? '' : 'Choose if you have a basement',
          options: [
            {
              name: 'Yes',
              value: true,
            },
            {
              name: 'No',
              value: false,
            },
          ],
        },
        basement_finished: {
          type: 'checkbox',
          prompt: 'Is your basement finished?',
          errorIf: val => this.form.have_basement && (val === '') ? 'Choose if basement is finished' : '',
          seeIf: _ => this.form.have_basement,
          options: [
            {
              name: 'Yes',
              value: true,
            },
            {
              name: 'No',
              value: false,
            },
          ],
        },
        amenities: {
          type: 'checkbox',
          prompt: 'Below is a list of amenities. Check all that apply to you.',
          multiple: true,
          options: [
            {
              name: 'Attached garage',
              value: 'Attached garage',
            },
            {
              name: 'Detached garage',
              value: 'Detached garage',
            },
            {
              name: 'Pole Building',
              value: 'Pole Building',
            },
            {
              name: 'Above Ground Swimming Pool',
              value: 'Above Ground Swimming Pool',
            },
            {
              name: 'In-ground Swimming Pool',
              value: 'In-ground Swimming Pool',
            },
            {
              name: '3-season sun-room',
              value: '3-season sun-room',
            },
            {
              name: 'Utility Shed',
              value: 'Utility Shed',
            },
            {
              name: 'Addition to living area within the last 3 years',
              value: 'Addition to living area within the last 3 years',
            },
          ],
        },
        legal_description: {
          type: 'text',
          title: 'Legal description on Form 11 or property record card (optional)',
        },
        comments: {
          type: 'text',
          title: 'Comments (optional)',
        },
      },
    }
  },
  computed: {
    applicationId () {
      return this.$route.query.applicationId
    },
  },
  methods: {
    async submit () {
      if (this.$proErrors().length) return this.$proErrors().forEach(err => this.$toast(err))

      this.stage = 'loading'

      try {
        await this.$HTTP({
          method: 'post',
          uri: `applications/${this.applicationId}/questionnaire`,
          body: {
            questionnaire: this.form,
            origin: window.location.origin,
          },
        })
        this.stage = 'success'
      } catch (e) {
        console.error(e)
        this.stage = 'failure'
        this.error = e.body.message
      }
    },
  },
}
</script>

<template lang="pug">
  #appeal-questionnaire-main.public-main
    .appeal-questionnaire-container.public-container
      transition(
        name='from-top'
        mode='out-in'
      )
        .content(
          v-if='stage === "appeal"'
          key='appeal'
        )
          .copy
            .title Appeal Questionnaire
            .explain-holder
              .description Congratulations, you have made a smart choice in getting help with your appeal!  Please click below to answer a few questions about your property.  Once complete you will receive a confirmation email.  Rest assured we will do our very best to make sure you have the best evidence to ensure a successful appeal.  If you have any questions along the way, please reach out to us.  We are here to help!
              .description The following is a short series of questions It should take no more than 10 minutes to answer. Once that is done Correct Property Tax will prepare your appeal, attached evidence, and email it to you for your signature.  You can sign it electronically, then we will file it with the assessor.
              .description Once the appeal is filed you will be placed in the assessor’s queue to be processed.  The assessor’s process sometimes takes up to 6 or 8 months to complete.  The timeline depends on the number of appeals filed and the assessor’s office procedures.
              .description When the assessor processes your appeal, they will reach out to you either by phone or mail to either approve your appeal or request an interview with you.  Once that is complete, they will either approve or deny your appeal.  Whether they approve the appeal or deny the appeal, you will receive a form for you to sign and send back indicating whether you agree or disagree with their decision.
              .description If you agree, sign it and send it back.  The assessment will be adjusted, and the appeal is done.
              .description If you disagree, SIGN ON THE LINE INDICATING THAT YOU DISAGREE and send it back to the assessor.  That will prompt the assessor to schedule a hearing.  They will notify you within 30 days of the hearing date. 
              .description If you are required to attend a hearing, please read the following:
              .description At the hearing simply present the evidence provided to you by Correct Property Tax and state why you think the assessment is too high. The board will then vote to approve the reduction or deny it.  Whether they approve or deny the appeal, you will receive a form indicating the boards decision.  If you disagree with their decision, within 30 days you can appeal it further to the State Tax Board.
              .description Correct Property Tax LLC is not associated with an attorney nor do we offer legal advice.  All appeal forms prescribed by the State of Indiana include the following statement “As a result of filing this petition, the assessment may increase, may decrease, or may stay the same.”  CPT is confident in their decision to move forward with an appeal however, we do not guarantee the results.
          .questionnaire.pro-form
            .question.form-row(
              v-for='(options, key) in formOptions'
              v-if='!options.seeIf || options.seeIf()'
            )
              pro-input(
                :options='options'
                v-model='form[key]'
              )
            .form-row.buttons-1
              .pro-button.major(
                @click='submit'
              ) Submit answers
        .content(
          v-if='stage === "loading"'
          key='loading'
        )
          .copy 
            .title Sending answers...
            .image-holder
              img(
                src='@/assets/svg/cube.svg'
              )
        .content(
          v-if='stage === "success"'
          key='success'
        )
          .copy
            .title Success!
            .image-holder.success
              i.material-icons thumb_up
          .copy
            .description Thanks for submitting these answers. We will now begin preparing your appeal.
          .action
            .pro-button.major.center(
              @click='window.open("https://www.correctpropertytax.com/")'
            ) Back to website
        .content(
          v-if='stage === "failure"'
          key='failure'
        )
          .copy
            .title Something went wrong...
            .image-holder
              i.material-icons thumb_down
          .copy
            .description.center {{error ? 'Submission failed for the following reason:' : 'Try reloading the page and submitting the answers again.'}}
          .action
            .disclaimer {{error}}
            .pro-button.major.center(
              @click='() => window.open("mailto:beth@correctpropertytax.com", "_blank")'
            ) Need help?

</template>

<style lang="sass" scoped>
  @import '$styles/transitions.sass'
  @import '$styles/form.sass'
  #appeal-questionnaire-main
    .appeal-questionnaire-container
      .content
        display: grid
        justify-items: center
        .questionnaire
          width: 100%
          margin-top: 16px
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
            &.success
              color: green
            > img
              width: 80px
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
            text-align: center
            margin-bottom: 24px
          .pro-button
            &.center
              justify-self: center
</style>