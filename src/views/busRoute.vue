<template>
  <div class="container">
    <div class="nav">
      <button class="btn back-to-index"><BackIcon /></button>
      <div class="station-name">{{ this.$route.params.route }}</div>
      <div class="options">
        <button class="btn"><LikeIcon /></button>
        <button class="btn"><InfoIcon /></button>
        <button class="btn"><NotificationIcon /></button>
        <button class="btn"><MapIcon /></button>
        <button class="btn"><UpdateIcon /></button>
      </div>
    </div>
    <div class="route-direction">
      <button
        :class="{ btn: true, 'forth-route': true, 'btn-active': isForthRoutePage }"
        @click="changeDirection"
      >
        去程往{{ this.endStop }}
      </button>
      <button
        :class="{ btn: true, 'forth-route': true, 'btn-active': !isForthRoutePage }"
        @click="changeDirection"
      >
        回程往{{ this.startStop }}
      </button>
    </div>
    <div class="stop-list">
      <div
        v-for="(stop, index) in isForthRoutePage ? forthRoute : returnRoute"
        :key="index"
        class="stop-item"
      >
        <div class="stop-time">
          <p class="stop-status" v-if="stop.StopStatus !== 0">
            {{
              stop.StopStatus === 1
                ? '未發車'
                : stop.StopStatus === 2
                ? '交管不停'
                : stop.StopStatus === 3
                ? '末班駛離'
                : '今日未營運'
            }}
          </p>
          <p
            v-else-if="stop.StopStatus === 0 && Math.floor(stop.EstimateTime / 60) >= 1"
            :class="{ 'text-danger': Math.floor(stop.EstimateTime / 60) <= 3 }"
          >
            {{ Math.floor(stop.EstimateTime / 60) }}分
          </p>
          <p v-else class="text-danger">進站中</p>
        </div>
        <div class="stop-name">{{ stop.StopName.Zh_tw }}</div>
        <div class="bus-info">
          <div v-if="stop.PlateNumb">
            <BusPlateNumb
              :class="{ 'background-icon': true, 'barrier-free-bus': stop.VehicleType === 1 }"
            />
            <div :class="{ 'bus-plate-numb': true, 'barrier-free-bus': stop.VehicleType === 1 }">
              <BarrierFreeBus class="type-icon" v-if="stop.VehicleType === 1" />
              <NormalBus class="type-icon" v-else /> {{ stop.PlateNumb }}
            </div>
          </div>
          <CircleIcon class="stop-icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BackIcon from '../assets/svg/back-icon.svg';
import LikeIcon from '../assets/svg/like-icon-active.svg';
import InfoIcon from '../assets/svg/info-icon.svg';
import NotificationIcon from '../assets/svg/notification.svg';
import MapIcon from '../assets/svg/map.svg';
import UpdateIcon from '../assets/svg/update.svg';
import CircleIcon from '../assets/svg/circle.svg';
import BusPlateNumb from '../assets/svg/bus-plate-numb.svg';
import NormalBus from '../assets/svg/type-normal-bus.svg';
import BarrierFreeBus from '../assets/svg/type-barrier‑free.svg';

export default {
  data() {
    return {
      isForthRoutePage: true,
      startStop: '', // 起站
      endStop: '', // 迄站
      forthRoute: '', // 去程所有站點
      returnRoute: '', // 回程所有站點
    };
  },
  props: ['name'],
  inject: ['getAuthorizationHeader'],
  components: {
    BackIcon,
    InfoIcon,
    LikeIcon,
    NotificationIcon,
    MapIcon,
    UpdateIcon,
    CircleIcon,
    BusPlateNumb,
    NormalBus,
    BarrierFreeBus,
  },
  methods: {
    test() {
      this.isForthRoutePage = !this.isForthRoutePage;
    },
    changeDirection() {
      this.isForthRoutePage = !this.isForthRoutePage;
    },
  },

  async mounted() {
    try {
      // 取得起迄站
      const StartAndEndStop = await this.axios.get(
        `https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/${this.$route.params.city}?$select=DepartureStopNameZh%2C%20DestinationStopNameZh&$filter=RouteName%2FZh_tw%20eq%20'${this.$route.params.route}'&$top=30&$format=JSON`,
        { headers: this.getAuthorizationHeader() },
      );
      this.startStop = StartAndEndStop.data[0].DepartureStopNameZh;
      this.endStop = StartAndEndStop.data[0].DestinationStopNameZh;
      // 取得所選取的路線去程及回程所經站牌
      // Direction 若為0，則為去程，從startStop出發往endStop
      // Direction 若為1，則為回程，從endStop出發往startStop

      // 若為台北、新北、桃園、台中、台南，api使用DisplayStopOfRoute。
      // 若為其他縣市，則使用: StopOfRoute
      // 兩者差異詳見tdx官方說明: https://reurl.cc/vgjNnl
      const eachStop = await this.axios.get(
        `https://ptx.transportdata.tw/MOTC/v2/Bus/DisplayStopOfRoute/City/${this.$route.params.city}?$filter=RouteName%2FZh_tw%20eq%20'${this.$route.params.route}'&$top=30&$format=JSON`,
        { headers: this.getAuthorizationHeader() },
      );
      this.forthRoute = eachStop.data.filter((stop) => stop.Direction === 0)[0].Stops;
      this.returnRoute = eachStop.data.filter((stop) => stop.Direction === 1)[0].Stops;
      // 取得去回程所經站牌的到站時間預測
      const estimateTime = await this.axios.get(
        `https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/City/${this.$route.params.city}/${this.$route.params.route}?$format=JSON`,
        { headers: this.getAuthorizationHeader() },
      );
      const forthRouteEstimate = estimateTime.data.filter((stop) => stop.Direction === 0);
      const returnRouteEstimate = estimateTime.data.filter((stop) => stop.Direction === 1);
      this.forthRoute.forEach((stopInfo) => {
        forthRouteEstimate.forEach((estimateStopTime) => {
          if (stopInfo.StopUID === estimateStopTime.StopUID) {
            Object.assign(stopInfo, estimateStopTime);
          }
        });
      });
      this.returnRoute.forEach((stopInfo) => {
        returnRouteEstimate.forEach((estimateStopTime) => {
          if (stopInfo.StopUID === estimateStopTime.StopUID) {
            Object.assign(stopInfo, estimateStopTime);
          }
        });
      });
      // 取得站點附近的公車資料
      const busNearStop = await this.axios.get(
        `https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeNearStop/City/${this.$route.params.city}?$select=PlateNumb%20%2C%20StopUID%2C%20BusStatus%2C%20DutyStatus&$filter=RouteName%2FZh_tw%20eq%20%27${this.$route.params.route}%27&$format=JSON`,
        { headers: this.getAuthorizationHeader() },
      );
      /// 透過公車車牌取得公車種類，並加入至公車資料
      const busPlateNumb = busNearStop.data.map((stop) => Object.values(stop)[0]);
      /// / 字串處理：處理成api格式
      const busApiType = busPlateNumb
        .map((plateNumb) => `(PlateNumb eq '${plateNumb}')`)
        .join('or');
      const busType = await this.axios.get(
        `https://ptx.transportdata.tw/MOTC/v2/Bus/Vehicle/City/${this.$route.params.city}?$filter=${busApiType}&$top=30&$format=JSON`,
      );
      busNearStop.data.forEach((nearbyBus) => {
        busType.data.forEach((itemType) => {
          if (nearbyBus.PlateNumb === itemType.PlateNumb) {
            Object.assign(nearbyBus, itemType);
          }
        });
      });

      ///  加入至去回程各站點中
      const busNearForthStop = busNearStop.data.filter((stop) => stop.Direction === 0);
      const busNearReturnStop = busNearStop.data.filter((stop) => stop.Direction === 1);
      this.forthRoute.forEach((stop) => {
        busNearForthStop.forEach((nearbyBus) => {
          if (stop.StopUID === nearbyBus.StopUID) {
            Object.assign(stop, nearbyBus);
          }
        });
      });
      this.returnRoute.forEach((stop) => {
        busNearReturnStop.forEach((nearbyBus) => {
          if (stop.StopUID === nearbyBus.StopUID) {
            Object.assign(stop, nearbyBus);
          }
        });
      });
    } catch (e) {
      console.log(e);
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  background-color: $white;
  height: calc(100vh - 60px);
  padding: 0;
}
.nav {
  display: flex;
  align-items: center;
  .back-to-index {
    width: 60px;
    height: 45px;
  }
  .station-name {
    flex-grow: 1;
    font-size: $font-title-m;
    font-weight: 500;
  }
  .options {
    min-width: 51%;
    display: flex;
    justify-content: space-around;
    .btn {
      flex-grow: 1;
      cursor: pointer;
      &:hover {
        background: lighten($primary, 15%);
      }
    }
  }
}

.route-direction {
  width: 100%;
  .btn {
    border-radius: 0px;
    width: 50%;
    border-bottom: 1px solid $neutrals-400;
    color: $neutrals-600;
    height: 48px;
  }
  .btn-active {
    border-bottom: 3px solid $primary;
    color: $black;
  }
}
.stop-list {
  display: block;
  height: calc(100vh - (60px + 45px + 48px));
  padding: 0 20px;
  padding-bottom: 20px;
  overflow-y: scroll;
  border-bottom: 1px solid $neutrals-600;
}
.stop-item {
  display: flex;
  align-items: center;
  padding-top: 12px;
}
.stop-time {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 78px;
  min-height: 35px;
  padding: 0 6px;
  background-color: $neutrals-200;
  border-radius: $border-radius;
  font-size: $font-title-s;
  font-weight: 500;
  color: $neutrals-700;
  p {
    margin: 0;
  }
}
.stop-status {
  color: $neutrals-600;
}
.stop-name {
  flex-grow: 1;
  margin-left: 20px;
  font-size: $font-body-l;
  font-weight: 400;
  color: $black;
}
.bus-info {
  position: relative;
  margin-right: 20px;
  .background-icon {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -92%);
    z-index: 2;
  }

  .stop-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .bus-plate-numb {
    display: flex;
    color: $white;
    font-size: 10px;
    font-weight: 400;
    position: absolute;
    bottom: 0;
    left: 0;
    transform: scale(0.833) translate(-60%, -37.5%);
    -webkit-transform: scale(0.833) translate(-60%, -37.5%);
    -moz-transform: scale(0.833) translate(-60%, -37.5%);
    z-index: 99;
    white-space: nowrap;
    .type-icon {
      z-index: 99;
    }
  }
}
</style>
<style lang="scss">
.barrier-free-bus {
  color: $white;
  rect {
    fill: $secondary;
  }
  path {
    fill: $secondary;
  }
}
.type-icon {
  path {
    fill: $black;
  }
}
</style>
