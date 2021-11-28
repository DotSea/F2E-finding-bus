<template>
  <div class="container">
    <div class="nav">
      <button @click="backToIndex" class="btn back-to-index"><BackIcon /></button>
      <div class="station-name">
        {{ this.$route.params.route }}
      </div>
      <div class="options">
        <button class="btn" @click="addToFavList">
          <LikeIconActive v-if="isRouteInFavList" />
          <LikeIconNormal v-else />
        </button>
        <button class="btn"><InfoIcon /></button>
        <button class="btn"><NotificationIcon /></button>
        <button class="btn"><MapIcon /></button>
        <button @click="getRouteInfo" class="btn"><UpdateIcon /></button>
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
              :class="{ 'background-icon': true, 'bg-melon': stop.VehicleType === 1 }"
            />
            <div class="bus-plate-numb">
              <BarrierFreeBus class="type-icon" v-if="stop.VehicleType === 1" />
              <NormalBus class="type-icon" v-else />
              <span :class="{ 'text-black': stop.VehicleType === 1 }">{{ stop.PlateNumb }}</span>
            </div>
          </div>
          <CircleIcon class="stop-icon" />
        </div>
      </div>
    </div>
    <div class="update-timer">
      <div class="copyright pb-0">Design by Zoe Kang/Code by DotSea</div>
      <div class="pb-0">{{ this.countNumber }}秒前更新</div>
    </div>
  </div>
</template>

<script>
import BackIcon from '../assets/svg/back-icon.svg';
import LikeIconActive from '../assets/svg/like-icon-active.svg';
import LikeIconNormal from '../assets/svg/like-icon-normal.svg';
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
      countNumber: 0,
      favRouteList: [],
      isThisRouteInFavList: false,
    };
  },
  props: ['name'],
  inject: ['getAuthorizationHeader'],
  components: {
    BackIcon,
    InfoIcon,
    LikeIconActive,
    LikeIconNormal,
    NotificationIcon,
    MapIcon,
    UpdateIcon,
    CircleIcon,
    BusPlateNumb,
    NormalBus,
    BarrierFreeBus,
  },
  methods: {
    addToFavList() {
      if (!this.isRouteInFavList) {
        this.favRouteList.push({
          RouteUID: this.$route.params.routeUID,
          City: this.$route.params.city,
          RouteName: { Zh_tw: this.$route.params.route },
          startStop: this.startStop,
          endStop: this.endStop,
        });
        alert('已加入至常用路線');
      } else {
        this.favRouteList = this.favRouteList.filter(
          (item) => item.RouteUID !== this.$route.params.routeUID,
        );
        alert('已從常用路線內移除');
      }
      localStorage.setItem('favRouteList', JSON.stringify(this.favRouteList));
    },

    backToIndex() {
      this.$router.push('/');
    },
    changeDirection() {
      this.isForthRoutePage = !this.isForthRoutePage;
    },
    async getRouteInfo() {
      this.countNumber = 0;
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
        `https://ptx.transportdata.tw/MOTC/v2/Bus/${
          this.$route.params.city
          === ('Taipei' || 'NewTaipei' || 'Taoyuan' || 'Taichung' || 'Tainan')
            ? 'DisplayStopOfRoute'
            : 'StopOfRoute'
        }/City/${this.$route.params.city}?$filter=RouteName%2FZh_tw%20eq%20'${
          this.$route.params.route
        }'&$top=30&$format=JSON`,
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
      /// 如果仍有公車在路上跑的話，則透過公車車牌取得公車種類，並加入至公車資料
      const busPlateNumb = busNearStop.data.map((stop) => Object.values(stop)[0]);
      if (busPlateNumb.length !== 0) {
        /// / 字串處理：處理成api格式
        const busApiType = busPlateNumb
          .map((plateNumb) => `(PlateNumb eq '${plateNumb}')`)
          .join('or');
        const vehicleTypeData = await this.axios.get(
          `https://ptx.transportdata.tw/MOTC/v2/Bus/Vehicle/City/${this.$route.params.city}?$filter=${busApiType}&$top=30&$format=JSON`,
          { headers: this.getAuthorizationHeader() },
        );
        busNearStop.data.forEach((nearbyBus) => {
          vehicleTypeData.data.forEach((itemType) => {
            if (nearbyBus.PlateNumb === itemType.PlateNumb) {
              Object.assign(nearbyBus, itemType);
            }
          });
        });
      }
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
    },
  },
  computed: {
    isRouteInFavList() {
      return this.favRouteList.some((item) => item.RouteUID === this.$route.params.routeUID);
    },
  },
  async mounted() {
    try {
      await this.getRouteInfo();
      // 當分頁開啟時，開始計時，每60秒更新一次資料
      // 當分頁關閉時，停止計時，並將秒數設為59
      // 當分頁重新開啟時，秒數會加1變為60，然後重新更新資料，並從0開始計時
      setInterval(() => {
        if (document.visibilityState === 'visible') {
          this.countNumber += 1;
          if (this.countNumber === 60) {
            this.getRouteInfo();
            this.countNumber = 0;
          }
        } else {
          this.countNumber = 59;
        }
      }, 1000);

      // 抓取存在localStorage的常用站牌資料
      if (localStorage.getItem('favRouteList') !== null) {
        this.favRouteList = JSON.parse(localStorage.getItem('favRouteList'));
      } else {
        this.favRouteList = [];
      }
    } catch (e) {
      console.log(e);
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
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
  height: calc(100vh - (60px + 45px + 48px + 20px));
  padding: 0 20px 40px 20px;

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
.update-timer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 40px;

  height: 20px;
  width: 100%;
  position: absolute;
  background: lighten($primary, 5);
  color: $white;
  bottom: 0;
  left: 0;

  .copyright {
    font-size: $font-body-m;
  }
}
</style>
<style lang="scss">
.bg-melon {
  rect {
    fill: $secondary;
  }
  path {
    fill: $secondary;
  }
}
</style>
