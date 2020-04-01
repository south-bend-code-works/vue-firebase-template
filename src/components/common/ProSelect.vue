<script>
export default {
  name: 'ProSelect',
  props: ['value','options','title','id','disabled'], // options must have the format [{name: <display_name>: value: <important_value>}]
  watch: {
    value (newValue) {
      const isChoice = this.options.find(option => option.value === newValue)
      this.choice = isChoice ? isChoice.value : null
    },
    isOpen (isOpen) {
      if (isOpen) {
        this.lastOpened = Date.now()
      }
    },
  },
  data () {
    return {
      isOpen: false,
      ref: null,
      choice: null,
      lastOpened: 0,
      focusIdx: null,
    }
  },
  computed: {
    choiceName () {
      const isChoice = this.options.find(option => option.value === this.choice)
      return isChoice && isChoice.name
    },
    contentClasses () {
      const classes = []
      if (this.isOpen) classes.push('is-open')
      if (this.choice) classes.push('chosen')
      if (this.disabled) classes.push('disabled')
      return classes.join(' ')
    },
  },
  methods: {
    onClick () {
      this.isOpen = true
    },
    listenForEvents () {
      document.addEventListener('click', (e) => {
        if (this.disabled) {
          this.isOpen = false
          return
        }
        this.isOpen = e.path.find(ele => ele.classList && ele.classList.contains(this.ref))
        this.$forceUpdate()
      })
    },
    listenForChoice () {
      this.$proOn('set-pro-select-choice', (options) => {
        if (options.id && (options.id === this.id)) {
          this.onSelect({value: options.choice})
        }
      })
    },
    onSelect (option) {
      if (option.value === this.choice) return
      this.choice = null
      setTimeout(() => {
        this.choice = option.value
        this.$emit('input', option.value)
        this.isOpen = false
      }, 1)
    },
    onFocus () {
      this.isOpen = true
    },
  },
  mounted () {
    this.listenForEvents()
    this.listenForChoice()
    this.ref = String(Math.random())
  },
}
</script>

<template lang="pug">
  .pro-select-main(
    :class='ref'
    tabindex='0'
    @focus='onFocus'
    @click='onClick'
    @blur='isOpen = false'
  )
    .pro-select-container
      .content(
        :class='contentClasses'
      )
        .title {{title}}
        .value-holder
          transition(
            name='from-bottom'
          )
            .name(
              v-if='choice'
            ) {{choiceName}}
          .arrow
            i.material-icons expand_more
        .dropdown
          transition(
            name='fade'
          )
            .option-holder(
              v-if='isOpen'
            )
              .option(
                v-for='(option, idx) in options'
                @click='onSelect(option)'
              ) {{option.name}}
</template>

<style lang="sass" scoped>
  @import '$vars'
  @import '$styles/transitions.sass'
  .pro-select-main
    &:focus
      outline: none
    .pro-select-container
      .content
        position: relative
        cursor: pointer
        &.disabled
          opacity: .4
          cursor: not-allowed
        &.is-open
          .value-holder
            .arrow
              transform: rotate(180deg)
        &.chosen
          .title
            top: -12px
            font-size: .7em
            color: #AAA
            .value-holder
              .arrow
                transform: rotate(180deg)
        &
        .title
          font-family: $font-2
          position: absolute
          top: 5px
          transition: .25s all
        .value-holder
          border-bottom: thin black solid
          height: 37px
          .name
            position: absolute
            font-size: 1.2em
            top: 5px
          .arrow
            position: absolute
            right: 0
            top: 5px
            transition: .25s all
        .dropdown
          .option-holder
            border: thin solid black
            border-top: none
            position: absolute
            width: 100%
            background-color: white
            z-index: 1
            max-height: 308px
            overflow: scroll
            .option
              padding: 5px 0 5px 5px
              cursor: pointer
              font-size: 1.1em
              &:hover
                background-color: #F4F4F4
</style>
