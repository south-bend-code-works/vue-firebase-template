<script>
import ProInput from '$common/ProInput'
export default {
  name: 'ApplicationViewer',
  components: {
    'pro-input': ProInput,
  },
  props: {
    options: {
      required: true,
    },
  },
  data () {
    return {
      personalDetails: [
        {
          title: 'Name',
          data: _ => this.application.name,
        },
        {
          title: 'Applied',
          data: _ => this.$buildDate(this.application.created, '{shortMonth} {longDate}, {year}'),
        },
        {
          title: 'Email',
          data: _ => this.application.email,
          onClick: _ => window.open(`mailto:${this.application.email}`, '_blank'),
        },
        {
          title: 'Phone',
          data: _ => this.application.phone,
          onClick: _ => window.open(`tel:${this.application.email}`, '_blank'),
        },
        {
          title: 'Parcel number',
          data: _ => this.application.parcel_number,
          onClick: _ => {
            this.$copyToClipboard(this.application.parcel_number)
            this.$toast(`Copied parcel number`)
          },
        },
        {
          title: 'Property Address',
          data: _ => this.application.property_address_string,
          onClick: _ => {
            this.$copyToClipboard(this.application.property_address_string)
            this.$toast(`Copied property address`)
          },
        },
        {
          title: 'Mailing Address',
          data: _ => this.application.mailing_address_string === this.application.property_address_string ? 'Same as property address' : this.application.mailing_address_string,
          onClick: _ => {
            this.$copyToClipboard(this.application.mailing_address_string)
            this.$toast(`Copied mailing address`)
          }
        },
        {
          title: 'Status',
          data: _ => this.application.status,
        },
      ],
      questionnaireDetails: [
        {
          title: 'Square footage',
          data: _ => this.application.questionnaire.square_footage,
        },
        {
          title: 'Year built',
          data: _ => this.application.questionnaire.year_built,
        },
        {
          title: 'Bathrooms',
          data: _ => this.application.questionnaire.bathroom_count,
        },
        {
          title: 'Has a basement?',
          data: _ => this.application.questionnaire.have_basement ? 'Yes' : 'No',
        },
        {
          title: 'Basement finished?',
          data: _ => this.application.questionnaire.basement_finished ? 'Yes' : 'No',
        },
        {
          title: 'Amenities',
          data: _ => this.application.questionnaire.amenities.length ? this.application.questionnaire.amenities.join(', ') : 'None',
        },
        {
          title: 'Legal description',
          data: _ => this.application.questionnaire.legal_description || 'None',
        },
      ],
      otherDetails: [
        {
          title: 'Appeal filed date',
          data: _ => this.$buildDate(new Date(this.application.appeal_filed_date.toDate()), '{shortMonth} {longDate}, {year}'),
          seeIf: _ => this.application.appeal_filed_date,
        },
      ],
      statusButtons: [
        {
          title: 'Approve',
          seeIf: _ => ['PENDING', 'NOT_APPEALED'].includes(this.application.status),
          action: _ => this.options.changeStatus('APPROVED'),
          class: 'major',
        },
        {
          title: 'Do not appeal',
          seeIf: _ => this.application.status === 'PENDING' || ((this.application.status === 'APPROVED') && !this.application.paid),
          action: _ => this.options.changeStatus('NOT_APPEALED'),
          class: 'outline',
        },
        {
          title: 'Send Email To Assessor',
          seeIf: _ => this.application.appeal_form_url,
          action: _ => this.$modals.show({
            name: 'email-preparer',
            application: this.application,
          }),
          class: 'major',
        },
      ],
      otherButtons: [
        {
          title: 'Resend Approved Email',
          seeIf: _ => this.application.status === 'APPROVED' && !this.application.paid,
          action: async _ => this.sendReminderEmail('payment'),
          class: 'major',
        },
        {
          title: 'View Appeal Form',
          seeIf: _ => this.application.appeal_form_url,
          action: _ => window.open(this.application.appeal_form_url, '_blank'),
          class: 'major',
        },
        {
          title: 'Resend appeal form',
          seeIf: _ => this.application.sign_request_id && !this.application.appeal_form_url,
          action: async _ => {
            if (!confirm(`Confirm that you want to resend the appeal form to ${this.application.name}.`)) return

            this.$toast('Resending...')
            try {
              await this.$HTTP({
                method: 'put',
                uri: `forms/appeal-forms/${this.application.sign_request_id}/email`,
              })
              this.$toast('Resent!')
            } catch (err) {
              console.error(err)
              this.$toast('Failed to resend.')
            }
          },
          class: 'major',
        },
        {
          title: 'Resend Questionnaire Email',
          seeIf: _ => this.application.status === 'APPROVED' && this.application.paid && !this.application.questionnaire_submitted,
          action: async _ => this.sendReminderEmail('questionnaire'),
          class: 'major',
        },
        {
          title: () => (this.application.sign_request_id ? 'Recreate' : 'Create') + ' appeal form',
          seeIf: _ => this.application.questionnaire_submitted,
          action: _ => {
            if (this.application.sign_request_id && !confirm('You have already sent an appeal form to this user. If you send another, the first will be voided. Confirm you want to send another by clicking OK.')) return
            if (!this.application.evidence.length && !confirm('You have not uploaded any evidence. Confirm you want to continue without uploading evidence.')) return
            
            this.$modals.show({
              name: 'appeal-form-fill',
              application: this.application,
              hardClose: true,
            })
          },
          class: _ => this.application.sign_request_id ? 'outline' : 'major',
        },
        {
          title: _ => this.application.archived ? 'Unarchive' : 'Archive',
          seeIf: _ => true,
          action: async _ => {
            if(!confirm(`Confirm ${this.application.archived ? 'un' : ''}archiving the application from ${this.application.name} by pressing OK.`)) return

            this.$modals.hide('application-viewer')
            this.$toast(this.application.archived ? 'Unarchiving...' : 'Archiving...')
            try {
              await this.$firestore.collection('applications').doc(this.application.id).update({archived: this.application.archived ? 0 : Date.now()})
            } catch (err) {
              console.error(err)
              return this.$toast(`Could not ${this.application.archived ? 'un' : ''}archive application`)
            }

            this.$toast(`${this.application.archived ? 'Unarchived' : 'Archived'} ${this.application.name}`)
          },
          class: 'delete',
        }
      ],
      originalAdminNotes: '',
      adminNotes: '',
      updatedApplication: null,
      window,
    }
  },
  computed: {
    application () {
      return this.updatedApplication || this.options.application
    }
  },
  methods: {
    async sendReminderEmail (entity) {
      if(!confirm(`Confirm sending reminder email to ${this.application.name} by pressing OK.`)) return
      try {
        await this.$HTTP({
          method: 'post',
          uri: `applications/${this.application.id}/${entity}/email`,
          body: {
            origin: window.location.origin,
          },
        })
        this.$toast('Email sent!')
      } catch (err) {
        console.error(err)
        this.$toast(err.body.message)
      }
    },
    logId () {
      console.log(this.application.id)
    },
    prepareAdminNotes () {
      this.originalAdminNotes = this.adminNotes = this.application.admin_notes || ''
      this.$forceUpdate()
    },
    async checkAdminNotes () {
      if (this.originalAdminNotes === this.adminNotes) return

      await this.$firestore.collection('applications').doc(this.application.id).update({admin_notes: this.adminNotes})
      this.options.reloadApplications()
    },
    getUpdatedApplication () {
      this.updatedApplication = this.options.getCurrentApplication(this.application.id)
    },
    showUploadEvidence () {
      this.$modals.show({
        name: 'upload-evidence',
        application: this.application,
        onSuccess: _ => {
          this.getUpdatedApplication()
        }
      })
    },
    async deleteEvidence (idx) {
      if(!confirm(`Click OK to confirm deleting the following evidence: ${this.application.evidence[idx].name}`)) return

      this.$toast('Deleting evidence...')

      const currentEvidence = this.$clone(this.application.evidence)
      currentEvidence.splice(idx, 1) //removes from the array and sends to firebase
      
      try {
        await this.$firestore.collection('applications').doc(this.application.id).update({evidence: currentEvidence})
      } catch (err) {
        console.error(err)
        return this.$toast('Could not delete evidence.')
      }
      
      this.getUpdatedApplication()
      this.$toast('Evidence deleted!')
    },
  },
  beforeMount () {
    this.prepareAdminNotes()
  },
  beforeDestroy () {
    this.checkAdminNotes()
  },
}
</script>

<template lang="pug">
  #application-viewer-main.modal-main
    .application-viewer-container.modal-container
      .title(
        @click='logId'
      ) {{application.name}}
      .content
        .details-holder
          .details-group-title(
            v-if='application.questionnaire_submitted'
          ) Property Questionnaire
          .detail(
            v-if='application.questionnaire_submitted'
            v-for='detail in questionnaireDetails'
          )
            .detail-title {{detail.title}}
            .detail-data {{detail.data()}}
          .details-group-title Personal
          .detail(
            v-for='detail in personalDetails'
            @click='detail.onClick && detail.onClick()'
          )
            .detail-title {{detail.title}}
            .detail-data(
              :class='detail.onClick ? "clickable" : ""'
            ) {{detail.data()}}
          .details-group-title(
            v-if='application.questionnaire_submitted'
          ) Evidence
          .detail
            .evidence-holder
              .evidence(
                v-if='!application.evidence.length'
              ) No evidence uploaded yet
              .evidence(
                v-for='(evidence, idx) in application.evidence'
              ) 
                .name(
                  @click='_ => window.open(evidence.download_url)'
                ) {{evidence.name}}
                i.x.material-icons(
                  @click='_ => deleteEvidence(idx)'
                ) cancel
            .pro-button.major(
              @click='showUploadEvidence'
            ) Upload evidence
          .details-group-title(
            v-if='otherDetails.filter(detail => !detail.seeIf || detail.seeIf()).length'
          ) Other
          .detail(
            v-for='detail in otherDetails'
            v-if='!detail.seeIf || detail.seeIf()'
          )
            .detail-title {{detail.title}}
            .detail-data {{detail.data()}}
          .details-group-title Action
          .detail(
            v-if='statusButtons.filter(button => button.seeIf()).length'
          )
            .detail-title Change Status
            .buttons-holder
              .pro-button(
                v-for='button in statusButtons'
                v-if='button.seeIf()'
                @click='button.action'
                :class='button.class'
              ) {{button.title}}
          .detail
            .detail-title Other
            .buttons-holder
              .pro-button(
                v-for='button in otherButtons'
                v-if='button.seeIf()'
                @click='button.action'
                :class='$maybeFunc(button.class)'
              ) {{$maybeFunc(button.title)}}
            .detail-title Admin notes
            .admin-notes
              pro-input(
                :options='{type: "textarea",}'
                v-model='adminNotes'
              )
      .action
        .button(
          @click='$modals.hide("application-viewer")'
        ) Close
</template>

<style lang="sass" scoped>
  @import '$styles/form.sass'
  #application-viewer-main
    width: calc(100% - 24px)
    max-width: 500px
    .application-viewer-container
      .content
        max-height: calc(100vh - 220px)
        overflow-y: scroll
        .details-holder
          .details-group-title
            @extend .font-1-bold
            border-bottom: 3px solid black
            margin-bottom: 8px
            &:not(:first-child)
              margin-top: 24px
          .detail
            display: grid
            font-size: 14px
            margin-bottom: 8px
            .evidence-holder
              margin: 8px 0 16px
              display: flex
              flex-wrap: wrap
              .evidence
                position: relative
                margin: 0 16px 16px 0
                .name
                  border: thin black solid
                  padding: 8px 16px
                  cursor: pointer
                .x
                  position: absolute
                  right: -6px
                  top: -4px
                  color: red
                  font-size: 14px
                  background-color: white
                  cursor: pointer
            .detail-title
              margin-bottom: 4px
            .detail-data
              @extend .font-1-bold
              &.clickable
                cursor: pointer
                text-decoration: underline
            .buttons-holder
              display: flex
              flex-wrap: wrap
              .pro-button
                margin: 0 8px 8px 0
                padding: 8px 16px
</style>