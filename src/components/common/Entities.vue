<script>
import ProInput from '$common/ProInput'
import ProSelect from '$common/ProSelect'
import AddButton from '$common/AddButton'
import Spinner from '$common/Spinner.vue'

export default {
  name: 'Entities',
  components: {
    'pro-input': ProInput,
    'pro-select': ProSelect,
    'add-button': AddButton,
    'spinner': Spinner,
  },
  props: {
    retrievePromise: Function,
    filters: Array,
    dropdowns: Array,
    breadcrumbs: String,
    title: String,
    subtitle: String,
    refreshString: String,
    showEditEntity: Function,
    noCard: Boolean,
    addButton: String,
    headerButtons: Array,
    searchOptions: Object,
    menuOptions: Array,
    pagination: Number,
  },
  watch: {
    dropdowns() {
      this.readyDropdowns()
    },
  },
  data() {
    return {
      entities: null,
      localFilters: [],
      localDropdowns: [],
      localMenuOptions: [],
      search: '',
      // isBeingSearched,
      currentPage: 1,
      status: 'loading'
    }
  },
  computed: {
    filteredEntities() {
      if (!this.entities) return []

      let entities = this.entities

      // ensure that there are filters and at least one is engaged
      if (
        this.localFilters &&
        this.localFilters.length &&
        this.localFilters.find((lf) => lf.engaged)
      ) {
        entities = this.localFilters.reduce(
          (acc, filter) => (filter.engaged ? acc.filter(filter.func) : acc),
          entities
        )
      }

      // ensure that there are dropdowns and at least one has chosen values
      if (
        this.localDropdowns &&
        this.localDropdowns.length &&
        this.localDropdowns.find((ld) => ld.chosen.length)
      ) {
        entities = this.localDropdowns.reduce((acc, ld) => {
          if (!ld.chosen.length) return acc

          return acc.filter((entity) => ld.func(entity, ld.chosen))
        }, entities)
      }

      // if (this.search) {
      //   entities = entities.filter(entity => isBeingSearched(this.search, (entity[this.searchOptions.field] || '')))
      // }

      if (this.pagination > 0) {
        entities = entities.slice(this.pagiBottom, this.pagiTop)
      }

      return entities
    },
    pagiBottom() {
      // return ((this.currentPage - 1)  * this.pagination) || 1
      return (this.currentPage - 1) * this.pagination
    },
    pagiTop() {
      return this.currentPage * this.pagination || 1
    },
    lastPage() {
      if (this.pagination && this.entities)
        return Math.ceil((this.entities.length || 1) / this.pagination)
      else return 1
    },
    pagiPrev() {
      return this.currentPage === 1 ? this.lastPage : this.currentPage - 1
    },
    pagiNext() {
      return this.currentPage === this.lastPage ? 1 : this.currentPage + 1
    },
  },
  methods: {
    async getEntities() {
      this.entities = await this.retrievePromise()
      this.$emit('loaded', { entities: this.entities })
    },
    readyFilters() {
      if (!(this.filters && this.filters.length)) return

      this.localFilters = this.filters.map((filter, index) => ({
        toggleExclusive: () => {
          // If selecting this filter should deselect another filter
          if (filter.exclusive.length)
            filter.exclusive.forEach((partner) => {
              this.localFilters[partner].engaged = false
            })
          this.localFilters[index].engaged = true
        },
        ...filter,
      }))
    },
    readyDropdowns() {
      if (!(this.dropdowns && this.dropdowns.length)) return

      this.localDropdowns = this.dropdowns.map((dd) => ({ ...dd, chosen: [] }))

      this.checkQuery()
    },
    readyMenuOptions() {
      if (!(this.menuOptions && this.menuOptions.length)) return
      this.localMenuOptions = this.menuOptions
    },
    checkQuery() {
      const query = this.$route.query
      if (!query) return

      const filterByProject = query.filterByProject
      if (!filterByProject) return

      const dropdown = this.localDropdowns.find(
        (dd) =>
          dd.options &&
          dd.options.find((option) => option.value === filterByProject)
      )

      if (!dropdown) return

      setTimeout(() => {
        dropdown.chosen.push(filterByProject)
      }, 200)
    },
    handleFilterClick(filter) {
      if (filter.exclusive.length) filter.toggleExclusive()
      else filter.engaged = !filter.engaged
    },
  },
  async mounted() {
    if (this.refreshString) {
      this.$proOn(this.refreshString, this.getEntities)
    }
    await this.getEntities()
    await this.readyFilters()
    await this.readyDropdowns()
    await this.readyMenuOptions()
    this.status = 'ready'
  },
}
</script>

<template lang="pug">
.entities-main
  .entities-container
    .header
      .breadcrumbs(
        v-html='breadcrumbs'
      )
      .title-holder
        .title.dotdotdot {{ title }}
        .subtitle.dotodotdot {{ subtitle }}
      add-button(
        v-if='addButton',
        :text='addButton',
        :onClick='() => showEditEntity({ creating: true })'
      )
      .buttons-holder(v-if='headerButtons && headerButtons.length')
        router-link.pro-button.minor(
          v-for='(button, idx) in headerButtons',
          :to='button.to',
          :key='idx'
        ) {{ button.name }}
    .search-area(
      v-if='searchOptions && searchOptions.field'
    )
      .input-holder
        pro-input(
          v-model='search',
          :options='{ title: `Search by ${searchOptions.by}` }'
        )
    .dropdowns(
      v-if='localDropdowns.length'
    )
      .dropdown-holder(
        v-for='(dd, idx) in localDropdowns',
        :style='dd.helperButtons && dd.helperButtons.length ? { "grid-template-columns": `auto repeat(${dd.helperButtons.length}, max-content)` } : {}'
      )
        pro-select.dropdown(
          :title='dd.title',
          :options='dd.options',
          :multiple='true',
          v-model='localDropdowns[idx].chosen',
          :key='idx'
        )
        .helper-buttons(
          v-if='dd.helperButtons && dd.helperButtons.length'
        )
          .button(
            v-for='button in dd.helperButtons', @click='button.click'
          ) {{ button.copy }}
    .filters(
      v-if='localFilters && localFilters.length'
    )
      .filter(
        v-for='filter in localFilters',
        @click='handleFilterClick(filter)',
        :class='[{ engaged: filter.engaged }, filter.class && filter.class()]'
      ) {{ filter.copy(filter.engaged) }}
    .content(
      :class='noCard ? "" : "card"'
    )
      .entities-holder
        .entity.no-interact(
          v-if='!entities'
        )
          spinner
        .entity.no-interact(
          v-else-if='!filteredEntities.length'
        )
          .icon
            i.material-icons blocked
          .title.italic None found.
        slot(
          v-else, :entities='filteredEntities'
        )
      .pagination(
        v-if='pagination && entities && entities.length > pagination'
      )
        .prev.paginav(
          @click='currentPage = pagiPrev'
        ) 
          img.chevron(
            src='/img/arrowL.png'
          )
          span.word Previous
        .next.paginav(
          @click='currentPage = pagiNext'
        ) 
          span.word Next
          img.chevron(
            src='/img/arrowR.png'
          )
</template>

<style lang="sass" scoped>
.entities-main
  width: 100%
  .entities-container
    width: 100%
    .header
      display: grid
      grid-template-rows: auto auto
      grid-template-columns: auto auto
      row-gap: 1rem
      .breadcrumbs
        grid-column: 1/3
        grid-row: 1/2
      .title-holder
        display: grid
        grid-template-columns: 100%
        grid-template-rows: auto auto
        .subtitle
          font-weight: bold
      .add-button-main
        justify-self: right
      .buttons-holder
        justify-self: end
    .filters
      margin-bottom: 1rem
      display: flex
      user-select: none
      flex-wrap: wrap
      .filter
        cursor: pointer
        margin: 0 1rem .5rem 0
        padding: .5rem 1rem
        width: fit-content
        font-size: 12px
        box-shadow: 0 0 .5rem 0 pink
        &.underline
          box-shadow: none
          &:active
            box-shadow: none
        &.engaged
          background-color: pink
          color: white
          &.underline
            background-color: transparent
            color: black
            border-bottom: 5px solid pink
        &:active
          box-shadow: 0 0 .5rem 0 rgba(0,0,0,.4) inset
    .search-area
      padding: 1rem 0
    .dropdowns
      position: relative
      display: grid
      grid-template-columns: 1fr 1fr
      column-gap: 1rem
      margin-bottom: 1rem
      .dropdown-holder
        display: grid
        align-items: center
        column-gap: .25rem
        .helper-buttons
          .button
            color: white
            padding: .25rem .5rem
            cursor: pointer
            font-size: 12px

    .content
      width: 100%
      height: fit-content
      .entities-holder
        min-height: 14rem
        height: 100%
        display: block
        width: 100%
        > *
          padding-left: 1rem
          padding-right: 1rem
        .entity.no-interact
          display: grid
          cursor: default
          grid-template-columns: 1fr
          column-gap: 1rem
          align-items: center
          padding: 1rem
          &:hover
            background-color: transparent
      .pagination
        display: grid
        grid-template-columns: 1fr auto
        justify-items: end
        height: 100%
        align-items: end
        column-gap: 2rem
        padding: 1rem
        .paginav
          font-weight: 600
          display: inline-grid
          grid-template-columns: auto 1fr
          grid-column-gap: 0.33rem
          align-items: center
          &:hover
            cursor: pointer
          .chevron
            height: 0.75rem
</style>