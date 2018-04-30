<template>
  <b-card v-bind:title="item.asset.name"><!-- todo --></b-card>
</template>

<script>
  export default {
    name: 'asset-card',
    props: {
      item: {},
    },
  };
</script>
