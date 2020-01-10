<script>
import * as time from '@/global/js/time.ts'
export default {
  name: 'FileDashboard',
  data () {
    return {
      time,
      files: [],
      loading: true,
    }
  },
  methods: {
    onNewFile () {
      this.$modals.show({
        name: 'alert',
        message: 'This is an example of a modal. Instead of showing this alert, the button just pushed should likely have some other functionality.'
      })
    },
  },
  mounted () {
    this.loading = false
    this.$hideLoading()
  },
}
</script>

<template lang="pug">
  .file-dashboard-main
    .file-dashboard-container
      .previous-files-holder
        .title Previous Files
        transition(
          name='fade'
          mode='out-in'
        )
          .files.no-files
            .copy You have no previous files. Click 'Start New File' to get started --->
      .file-areas-holder
        .file-area.new(
          @click='onNewFile'
        )
          .content
            .copy
              .action Start New File


</template>

<style lang="sass" scoped>
  @import '$vars'
  @import '$styles/transitions.sass'
  .file-dashboard-main
    .file-dashboard-container
      display: grid
      grid-template-columns: auto 300px
      height: 100%
      .previous-files-holder
        padding: 40px 50px
        .title
          font-size: 1.3em
        .files
          display: grid
          .files-by-year
            .year-title
              font-size: 1.8em
              padding: 15px 0
              color: $nh-darkgrey
              font-family: $font-2
            .files-by-month
              .month-title
                border-bottom: thin black solid
                width: 272px
                padding-bottom: 4px
                margin-bottom: 10px
              .files-holder
                padding: 10px 0
                display: flex
                flex-wrap: wrap
                .file
                  border: thin solid black
                  padding: 10px
                  width: 250px
                  margin: 0 10px 10px 0
                  position: relative
                  cursor: pointer
                  &.new
                    border: thin solid $nh-amber
                    background-color: $nh-yellow
                    .new-file-tag
                      display: block
                      position: absolute
                      top: -12px
                      right: 5px
                      font-size: .8em
                      border: thin solid $nh-amber
                      background-color: white
                      padding: 3px
                  .new-file-tag
                    display: none
                  .file-title
                    font-size: 1.2em
                  .detail
                    font-family: $font-2
                    font-size: .8em
                  .buttons-holder
                    display: grid
                    grid-template-columns: max-content auto
                    padding-top: 20px
                    align-items: center
                    .time
                    font-size: .8em
                    .download
                      transform: rotate(180deg)
                      justify-self: end
          &.loading
            .image
              justify-self: center
              width: fit-content
              > img
                width: 100px
          &.no-files
            float: right
            text-align: right
            padding: 50px 25px
            max-width: 500px
            .copy
              font-size: 1.5em
              color: #CCC
      .file-areas-holder
        height: 100%
        .file-area
          display: grid
          align-items: center
          justify-items: center
          cursor: pointer
          transition: all .25s
          border-left: thin black solid
          height: 100%
          .content
            font-family: $font-2
            position: relative
            .copy
              .action
                font-size: 1.2em
                transition: all .25s
              .details
                padding: 5px 0 0 15px
                .detail
                  font-size: .8em
          &:hover
            .content
              .copy
                .action
                  font-size: 1.22em
          &.current
            display: none
        &.has-current
          .file-area
            &.new
              height: 70%
            &.current
              height: 30%
              background-color: $nh-yellow
              border-top: thin black solid
              display: grid

</style>
