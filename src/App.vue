<template>
  <TheHeader />

  <router-view />
</template>

<style lang="scss">
@import 'reset-css';
@import './assets/base.scss';
</style>

<script>
import TheHeader from './components/TheHeader.vue';

export default { name: 'App', components: { TheHeader } };
</script>
