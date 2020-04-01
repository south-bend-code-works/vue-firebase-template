<script>
import ProInput from '$common/ProInput'
export default {
  name: 'UploadEvidence',
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
      filename: '',
      file: null,
    }
  },
  methods: {
    chooseFile () {
      const fileInput = document.createElement('input')
      const fileInputId = `file-input-${Date.now()}`
      fileInput.id = fileInputId
      fileInput.onchange = event => {
        this.file = event.target.files[0]
        //removes the input previously placed
        document.getElementById(fileInputId).remove()
      }
      fileInput.type = 'file'
      fileInput.style.display = 'none'
      this.$el.appendChild(fileInput)
      fileInput.click()
    },
    async uploadFile () {
      if (!(this.file && this.filename)) return this.$toast('Input name and choose file')

      this.$modals.hide('upload-evidence')
      this.$toast('Uploading evidence...')

      const app = this.options.application
      
      const storageRef = this.$storage.ref(`evidence/${app.id}/${this.filename}`)
      let downloadUrl
      try {
        await storageRef.put(this.file)
        downloadUrl = await storageRef.getDownloadURL()
      } catch (err) {
        console.error(err)
        return this.$toast('Could not upload file.')
      }

      try {
        await this.$firestore.doc(`applications/${app.id}`).update({evidence: [...app.evidence, { //appends new evidence to existing evidence
          name: this.filename,
          type: this.file.type,
          download_url: downloadUrl,
        }]})
      } catch (err) {
        console.error(err)
        return this.$toast('Could not save file data to Firestore.')
      }

      this.options.onSuccess && this.options.onSuccess()
      this.$toast('Evidence uploaded!')
    },
  },
}
</script>

<template lang="pug">
  #upload-evidence-main.modal-main
    .upload-evidence-container.modal-container
      .title Upload Evidence
      .content
        .pro-form
          .form-row
            pro-input(
              v-model='filename'
              :options='{title: "Name of file", errorIf: val => val ? "" : "Enter name of file"}'
            )
          .form-row.button-and-name
            .pro-button.major(
              @click='chooseFile'
            ) Choose File
            .file-name(
              v-if='file'
            ) {{file.name}}
      .action
        .button(
          @click='uploadFile'
        ) Upload
        .button.cancel(
          @click='$modals.hide("upload-evidence")'
        ) Cancel
</template>

<style lang="sass" scoped>
  @import '$styles/form'
  #upload-evidence-main
    .upload-evidence-container
      .content
        padding-top: 32px
        .pro-form
          .button-and-name
            display: flex
            align-items: center
            .file-name
              margin-left: 16px
              font-size: 12px
              width: 130px
              word-break: break-word
</style>