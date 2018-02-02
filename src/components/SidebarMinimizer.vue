<template>
  <button class="sidebar-minimizer" type="button" @click="sidebarMinimize();brandMinimize()"></button>
</template>

<script>
  export default {
    name: 'app-sidebar-minimizer',
    methods: {
      sidebarMinimize() {
        document.body.classList.toggle('sidebar-minimized');
      },
      brandMinimize() {
        document.body.classList.toggle('brand-minimized');
      },
    },
  };
</script>
