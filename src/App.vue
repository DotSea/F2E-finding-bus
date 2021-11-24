<template>
  <TheHeader />

  <router-view />
</template>

<style lang="scss">
@import './assets/base.scss';
</style>

<script>
import JsSHA from 'jssha';
import TheHeader from './components/TheHeader.vue';

export default {
  name: 'App',
  components: { TheHeader },

  provide() {
    return {
      getAuthorizationHeader() {
        const AppID = process.env.VUE_APP_API_ID;
        const AppKey = process.env.VUE_APP_API_KEY;
        const GMTString = new Date().toGMTString();
        const ShaObj = new JsSHA('SHA-1', 'TEXT');
        ShaObj.setHMACKey(AppKey, 'TEXT');
        ShaObj.update(`x-date: ${GMTString}`);
        const HMAC = ShaObj.getHMAC('B64');
        const Authorization = `hmac username="${AppID}", algorithm="hmac-sha1", headers="x-date", signature="${HMAC}"`;
        return { Authorization, 'X-Date': GMTString };
      },
    };
  },
};
</script>
