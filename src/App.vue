<template>
  <RouterView />
</template>

<script setup>
  import { useTheme } from 'vuetify'
  const vuetifyTheme = useTheme()
  vuetifyTheme.global.name.value = localStorage.getItem("theme") || 'light'
</script>

<style scoped>

</style>
