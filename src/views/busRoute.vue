<template>
  <div class="container">
    <div class="route-direction">
      <div class="toDestination">去程往{{ this.startStop }}</div>
      <div class="toDeparture">回程往{{ this.endStop }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { startStop: '', endStop: '' };
  },
  props: ['name'],
  inject: ['getAuthorizationHeader'],
  async mounted() {
    try {
      // 取得起迄站
      const StartAndEndStop = await this.axios.get(
        `https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/${this.$route.params.city}?$select=DepartureStopNameZh%2C%20DestinationStopNameZh&$filter=RouteName%2FZh_tw%20eq%20'${this.$route.params.route}'&$top=30&$format=JSON`,
        { headers: this.getAuthorizationHeader() },
      );
      this.startStop = StartAndEndStop.data[0].DepartureStopNameZh;
      this.endStop = StartAndEndStop.data[0].DestinationStopNameZh;

      // 取得所選取的路線預測到站時間
      // Direction 若為0，則為去程，從startStop出發往endStop
      // Direction 若為1，則為回程，從endStop出發往startStop
      const eachStop = await this.axios.get(
        `https://ptx.transportdata.tw/MOTC/v2/Bus/DisplayStopOfRoute/City/${this.$route.params.city}?$filter=RouteName%2FZh_tw%20eq%20'${this.$route.params.route}'&$top=30&$format=JSON`,
        { headers: this.getAuthorizationHeader() },
      );

      console.log(eachStop.data);
      console.log('busRoute mounted');
    } catch (e) {
      console.log(e);
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  background-color: #f8f8f8;
  padding: 20px;
  height: calc(100vh - 60px);
}
</style>
