<script>
export default {
  name: 'ProInput',
  props: {
    value: {
      required: true,
    },
    options: {
      default: {},
    },
  },
  watch: {
    input (input) {
      this.$emit('input', input)
    },
    value (newValue) {
      this.input = newValue
    },
  },
  data () {
    return {
      input: null,
      focused: false,
      entered: false,
    }
  },
  computed: {
    isActive () {
      return this.focused || this.input
    },
    placeholderCopy () {
      return (this.entered && this.error) ? this.error : this.options.title
    },
    error () {
      return this.options.errorIf && this.options.errorIf(this.input)
    },
  },
  methods: {
    handleKey (e) {
      if (e.code === 'Enter') {
        this.options.onEnter && this.options.onEnter()
      }
    },
  },
}
</script>

<template lang="pug">
  .pro-input-main
    .pro-input-container(
      :class='options.containerClass'
    )
      .input-holder(
        :class='error && entered ? "error" : ""'
      )
        .placeholder(
          :class='isActive ? "active" : ""'
        ) {{placeholderCopy}}
        input(
          v-if='options.type === "number"'
          type='number'
          v-model='input'
          @keydown='handleKey'
          @focus='focused = true'
          @blur='focused = false;entered = true'
        )
        input(
          v-if='options.type === "password"'
          type='password'
          v-model='input'
          @keydown='handleKey'
          @focus='focused = true'
          @blur='focused = false;entered = true'
        )
        input(
          v-else
          v-model='input'
          @keydown='handleKey'
          @focus='focused = true'
          @blur='focused = false;entered = true'
        )
</template>

<style lang="sass" scoped>
  @import '$vars'
  .pro-input-main
    .pro-input-container
      .input-holder
        position: relative
        margin-top: 5px
        &.error
          .placeholder
            color: red !important
          > input
            border-bottom-color: red
            &:focus
              border-bottom-color: red !important
        .placeholder
          user-select: none
          position: absolute
          top: 4px
          color: #BBB
          transition: all .25s
          font-family: $font-2
          &.active
            font-size: .7em
            top: -12px
            color: #AAA
        > input
          margin-bottom: 0
          height: 2rem
          z-index: 1
          position: relative
          padding-bottom: 3px
          color: #000
          background-color: transparent
          border: none
          border-bottom: thin black solid
          width: 100%
          font-family: $font-1
          font-size: 1.2em
          &:focus
            transition: .25s all
            border-bottom: 1px solid black !important
            box-shadow: none !important
            color: #000
            outline: none

</style>
