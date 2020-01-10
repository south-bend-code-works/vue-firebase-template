<script>
export default {
  name: 'AlertModal',
  props: {
    options: {
      required: true,
    },
  }
}
</script>

<template lang="pug">
  .alert-modal.modal-main
    .modal-container
      .title ALERT
      .content {{options.message}}
      .action
        .button(
          @click='$modals.hide()'
        ) Close
</template>