<script>
import Alert from './Alert'
import ApplicationViewer from './ApplicationViewer'
import CardInput from './CardInput'
import AppealFormFill from './AppealFormFill'
import DatePicker from './DatePicker'
import SuperAdmin from './SuperAdmin'
import EmailPreparer from './EmailPreparer'
import UploadEvidence from './UploadEvidence'
export default {
  name: 'ModalsMain',
  components: {
    'alert': Alert,
    'application-viewer': ApplicationViewer,
    'card-input': CardInput,
    'appeal-form-fill': AppealFormFill,
    'date-picker': DatePicker,
    'super-admin': SuperAdmin,
    'email-preparer': EmailPreparer,
    'upload-evidence': UploadEvidence,
  },
  data () {
    return {
      modalsOptions: {},
      keys: {},
    }
  },
  computed: {
    seeModals () {
      return Object.keys(this.modalsOptions).length
    },
    componentsList () {
      return Object.keys(this.$options.components).filter(comp => !['ModalsMain',].includes(comp))
    },
  },
  methods: {
    shouldIncludeComp (comp) {
      return Object.keys(this.modalsOptions).includes(comp)
    },
    setUpListeners () {
      this.$proOn('showModal', options => {
        if (options && this.componentsList.includes(options.name)) {
          this.modalsOptions[options.name] = options
          this.$forceUpdate()
        } else {
          alert(`Could not find and show the following modal: ${options && options.name}`)
        }
      })
      this.$proOn('hideModal', modalName => {
        // hides all modals if no modal name is declared
        if (!modalName) {
          this.modalsOptions = {}
        } else {
          delete this.modalsOptions[modalName]
        }
        this.$forceUpdate()
      })
      document.addEventListener('keydown', this.keyListener, true)
      document.addEventListener('keyup', this.keyListener, true)
    },
    onContainerClick (comp) {
      if (this.modalsOptions[comp].hardClose) return
      
      this.$modals.hide(comp)
    },
    keyListener (e) {
      if (e.type === 'keydown') {
        this.keys[e.key] = Date.now()
        if (this.keys.Meta < this.keys.s) {
          e.preventDefault()
          this.$modals.show({
            name: 'super-admin',
          })
        }
      } else if (e.type === 'keyup') {
        delete this.keys[e.key]
      }
    },
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.keyListener, true)
    document.removeEventListener('keyup', this.keyListener, true)
  },
  mounted () {
    this.setUpListeners()
  },
}
</script>

<template lang="pug">
  span
    transition(
      name='fade'
    )
      .modals-main(
        v-if='Object.keys(this.modalsOptions).length'
      )
        .modals-container(
          v-for='(comp, idx) in componentsList'
          v-if='shouldIncludeComp(comp)'
          @click='onContainerClick(comp)'
          )
            span(
              @click.stop=''
            )
              component(
                :is='comp'
                :options='modalsOptions[comp]'
                )
</template>

<style lang="sass">
  @import '$styles/transitions.sass'
  @import '$styles/form.sass'
  .modals-main
    height: 100vh
    width: 100vw
    position: fixed
    z-index: 950
    .modals-container
      height: 100%
      width: 100%
      background-color: transparentize(grey, .5)
      position: absolute
      > span
        > .modal-main
          background-color: white
          position: absolute
          left: 50%
          top: 50%
          transform: translateY(-50%) translateX(-50%)
          height: auto
          max-height: 100vh
          width: 320px
          border-radius: 10px
          box-shadow: 0 0 15px 0 transparentize(black, .7)
          border: thin grey solid
          overflow-y: scroll
          > .modal-container
            > *
              padding: 16px
            > .title
              @extend .font-1-bold
              font-size: 20px
              color: white
              background-color: $green
            > .content
              padding: 24px
              max-height: calc(100vh - 232px)
              overflow-y: scroll
              .description
                font-size: 14px
                margin-bottom: 32px
              .content-title
                font-size: 1.6em
              .input-field
                margin-top: 5px
                $input-font-size: .9em
                > input
                  margin-bottom: 8px
                  height: 2.6rem
                label
                  &.active
                    transform: translateY(-8px) scale(0.8)
            > .action
              background-color: $green
              color: white
              display: flex
              > .button
                @extend .pro-button
                border-sizing: border-box
                padding: 8px 24px
                background-color: white
                color: black
                text-align: center
                cursor: pointer
                border: white 2px solid
                transition: all .25s
                user-select: none
                margin-right: 8px
                &.minor
                  background-color: transparent
                  border-color: transparent
                &.cancel
                  background-color: transparent
                  color: white
</style>
