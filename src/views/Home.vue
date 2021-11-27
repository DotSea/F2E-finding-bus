<template>
  <div class="container">
    <div class="status">
      <div class="btn">找公車</div>
      <button class="btn">路線規劃</button>
    </div>
    <FindingBus />
  </div>
</template>
<script>
import FindingBus from '../components/FindingBus.vue';

export default {
  name: 'index',
  data() {
    return { isSearchOpen: false };
  },
  components: { FindingBus },
};
</script>

<style lang="scss" scoped>
.container {
  background-color: #f8f8f8;
  padding: 20px;
  height: calc(100vh - 60px);
  width: 100%;
}
.status {
  display: flex;
  justify-content: center;
  border-radius: $border-radius;
  background: #fff;
  .btn {
    background: #fff;
    padding-top: 12px;
    padding-bottom: 12px;
    font-weight: 500;
    font-size: $font-title-s;
    line-height: 23px;
    color: $neutrals-500;
    width: 50%;
    border-radius: $border-radius;
    border: none;
    &:hover {
      background: $primary;
      color: #fff;
    }
  }
}
</style>
