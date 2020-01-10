<script>
import Alert from './Alert'
export default {
  name: 'ModalsMain',
  components: {
    'alert': Alert,
  },
  data () {
    return {
      modalsOptions: {},
    }
  },
  computed: {
    seeModals () {
      return Object.keys(this.modalsOptions).length
    },
    componentsList () {
      return Object.keys(this.$options.components).filter(comp => comp !== 'ModalsMain')
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
    },
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
          @click='$modals.hide(comp)'
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
  .modals-main
    height: 100vh
    width: 100vw
    position: fixed
    z-index: 999
    .modals-container
      height: 100%
      width: 100%
      background-color: transparentize(grey, .5)
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
          box-shadow: 0 0 15px 0 grey
          border: thin grey solid
          overflow-y: scroll
          > .modal-container
            > *
              padding: 15px
            > .title
              font-size: 1.2em
              color: white
              background-color: #999
            > .content
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
              background-color: #999
              color: white
              display: grid
              > .button
                padding: 3px 5px
                background-color: white
                border-radius: 5px
                color: black
                text-align: center
                cursor: pointer
                border: white 2px solid
                transition: all .25s
                user-select: none
                &:hover
                  box-shadow: 0 0 5px 0 #444
                &.cancel
                  background-color: transparent
                  color: white
</style>
