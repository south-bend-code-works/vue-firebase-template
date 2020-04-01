<script>
import EntitiesTable from '$common/EntitiesTable'
export default {
  name: 'AdminApplicants',
  components: {
    'entities-table': EntitiesTable,
  },
  data() {
    return {
      state: 'loading',
      currentKey: '',
      applications: [],
      loadingApplicationIds: [],
      unsubscribe: null,
      baseCells: [
        {
          name: 'Applied',
          getInfo: application => this.$buildDate(application.created, '{month}-{date}-{year}'),
          sortFunc: (a, b) => b.created - a.created,
        },
        {
          name: 'Name',
          getInfo: application => application.name,
          sortFunc: (a, b) => a.name.localeCompare(b.name),
        },
        {
          name: '',
          getInfo: application => 'See Details',
          classFunc: _ => 'pro-button outline',
          onClick: this.viewApplicant,
          style: {
            'justify-self': 'right',
          }
        },
      ],
      conditionalCells: {},
      statusButtons: {
        pending: {
          title: 'Pending',
          ref: this.$firestore.collection('applications')
            .where('status', '==', 'PENDING')
            .where('archived', '==', 0),
        },
        notAppealed: {
          title: 'Not Appealed',
          ref: this.$firestore.collection('applications')
            .where('status', '==', 'NOT_APPEALED')
            .where('archived', '==', 0),
        },
        approvedUnpaid: {
          title: 'Approved - unpaid',
          ref: this.$firestore.collection('applications')
            .where('status', '==', 'APPROVED')
            .where('paid', '==', false)
            .where('archived', '==', 0),
        },
        approvedPaid: {
          title: 'Approved - paid',
          ref: this.$firestore.collection('applications')
            .where('status', '==', 'APPROVED')
            .where('paid', '==', true)
            .where('questionnaire_submitted', '==', false)
            .where('archived', '==', 0),
        },
        questionnaireSubmitted: {
          title: 'Questionaire Submitted',
          ref: this.$firestore.collection('applications')
            .where('status', '==', 'APPROVED')
            .where('paid', '==', true)
            .where('questionnaire_submitted', '==', true)
            .where('appeal_form_url', '==', null)
            .where('sign_request_id', '==', null)
            .where('archived', '==', 0),
        },
        appealSent: {
          title: 'Appeal Sent',
          ref: this.$firestore.collection('applications')
            .where('status', '==', 'APPROVED')
            .where('paid', '==', true)
            .where('questionnaire_submitted', '==', true)
            .where('appeal_form_url', '==', null)
            .where('archived', '==', 0),
          filter: application => application.sign_request_id, //ensures an appeal has been sent
        },
        appealSigned: {
          title: 'Appeal Signed',
          ref: this.$firestore.collection('applications')
            .where('status', '==', 'APPROVED')
            .where('paid', '==', true)
            .where('questionnaire_submitted', '==', true)
            .where('archived', '==', 0),
          filter: app => app.sign_request_id && app.appeal_form_url && !app.appeal_filed_date,
        },
        appealFiled: {
          title: 'Appeal Filed',
          ref: this.$firestore.collection('applications')
            .where('status', '==', 'APPROVED')
            .where('paid', '==', true)
            .where('questionnaire_submitted', '==', true)
            .where('archived', '==', 0),
          filter: app => app.appeal_filed_date,
        },
        archived: {
          title: 'Archived',
          ref: this.$firestore.collection('applications')
            .where('archived', '>', 0)
        },
      },
    }
  },
  methods: {
    viewApplicant (application) {
      this.$modals.show({
        name: 'application-viewer',
        application,
        changeStatus: status => {
          if(!confirm(`Confirm updating the application status of ${application.name} to ${status} by pressing OK.`)) return

          this.$modals.hide('application-viewer')
          this.updateApplicationStatus(application, status)
        },
        reloadApplications: _ => this.getApplications(this.currentKey),
        getCurrentApplication: applicationId => this.applications.find(app => applicationId === app.id)
      })
    },
    getApplications (key) {
      this.unsubscribe && this.unsubscribe()
      return new Promise(async resolve => {
        const button = this.statusButtons[key]
        this.unsubscribe = button.ref.onSnapshot((qs) => {
          this.applications = qs.docs
            .map(doc => doc.data())
            .filter(button.filter || (_ => true))
          this.state = 'applicants'
          this.currentKey = key
          resolve()
        })
      })
    },
    isLoading (applicationId) {
      return this.loadingApplicationIds.includes(applicationId)
    },
    async updateApplicationStatus (application, status) {
      this.loadingApplicationIds.push(application.id)

      try {
        await this.$HTTP({
          uri: `applications/${application.id}/status`,
          method: 'put',
          body: {
            status,
            origin: window.location.origin,
          },
        })
      } catch (err) {
        this.$toast(err.body.message)
        return this.loadingApplicationIds.remove(application.id)
      }

      await this.getApplications(this.currentKey)

      this.loadingApplicationIds.remove(application.id)
      this.$toast(`Updated ${application.name}'s status to ${status}`)
    },
  },
  mounted () {
    this.getApplications(this.$route.query.statusKey || 'pending')
  },
}
</script>

<template lang="pug">
  #admin-applicants.admin-main
    .admin-applicants-container.admin-container
      .header
        .title Applicants
      transition(
        name='from-top'
        mode='out-in'
      )
        .content(
          key='applicants'
          v-if='state === "applicants"'
        )
          .status-buttons-holder
            .pro-button(
              v-for='(button, key) in statusButtons'
              :class='key === currentKey ? "major" : ""'
              @click='getApplications(key)'
            ) {{button.title}}
          entities-table#applicants-table(
            :entities='applications'
            :cells='baseCells'
            @onEntityClick='viewApplicant'
            customColumnWidths='100px 200px auto'
          )
        .content(
          key='loading'
          v-else-if='state === "loading"'
        )
          .loading
            .image
              img(
                src='@/assets/svg/cube.svg'
              )

</template>

<style lang="sass">
  @import '$styles/transitions.sass'
  @import '$styles/form.sass'
  .admin-main
    .admin-container
      .content
        display: grid
        grid-template-columns: auto
        padding: 32px 0
        .status-buttons-holder
          margin-bottom: 16px
          display: flex
          flex-wrap: wrap
        #applicants-table
          max-width: 800px
        .loading
          justify-self: center
          display: grid
          justify-items: center
          .copy
            font-size: 20px
          .image
            width: 64px
            > img
              width: 100%
  @media (max-width: #{$side-nav-min})
    .admin-main
      .admin-container
        .content
          width: 100%
          padding: 16px 0
          #applicants-table
            max-width: unset
            width: 100%
  @media (max-width: 480px)
    #applicants-table
      .entities-holder
        .entity
          grid-template-columns: 100px auto auto !important
          .cell
            &.pro-button
              display: none
</style>