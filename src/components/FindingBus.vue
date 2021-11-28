<template>
  <div class="page">
    <div class="search-row">
      <button @click="openFavList"><FavIcon /></button>
      <div v-show="isFavRouteListOpen" class="fav-route-list">
        <div class="btn fav-route-item" v-if="!favRouteList || favRouteList.length === 0">
          您尚未加入常用路線
        </div>
        <div
          class="btn fav-route-item"
          @click="selectRoute(route)"
          v-for="route in favRouteList"
          :key="route.id"
        >
          {{ route.RouteName.Zh_tw }} {{ route.startStop }} - {{ route.endStop }}
        </div>
      </div>
      <input
        readonly
        class="search-column"
        @focus="openSearch"
        @keyup.enter="searchRoute"
        @keyup.esc="closeSearch"
        v-model="searchKeyWord"
        type="text"
        placeholder="搜尋公車路線"
      />
    </div>
    <!-- 常用站牌與附近站牌尚未實做，先隱藏起來 -->
    <!-- <StationCard class="mb-3" v-if="!isSearchOpen" />
    <StationCard class="pb-0" v-if="!isSearchOpen" /> -->
    <div v-if="isSearchOpen" class="search-result" @mousedown.self="closeSearch">
      <button
        @mousedown="selectRoute(route)"
        class="btn search-item mb-2"
        v-for="route in searchResult"
        :key="route.RouteUID"
      >
        <div class="route-name">{{ route.RouteName.Zh_tw }}</div>
        <div class="start-end-stop">
          {{ route.DepartureStopNameZh }} - {{ route.DestinationStopNameZh }}
        </div>
      </button>
    </div>
    <VirtualKeyboard
      :send-text="sendText"
      :init-search-result="initSearchResult"
      :delete-search-keyword="deleteSearchKeyword"
      :close-keyboard="closeKeyboard"
      @emit-selected-city="chooseCity"
      v-show="isKeyboardOpen"
      class="virtual-keyboard"
    />
  </div>
</template>

<script>
import FavIcon from '../assets/svg/fav-icon.svg';
// import StationCard from './StationCard.vue';
import VirtualKeyboard from './VirtualKeyborad.vue';

export default {
  name: 'index',
  components: {
    FavIcon,
    // StationCard,
    VirtualKeyboard,
  },
  data() {
    return {
      searchKeyWord: '',
      searchResult: [],
      isSearchOpen: false,
      selectedCity: '',
      isKeyboardOpen: false,
      isFavRouteListOpen: false,
    };
  },
  methods: {
    openFavList() {
      this.isFavRouteListOpen = !this.isFavRouteListOpen;
    },
    chooseCity(data) {
      this.selectedCity = data;
    },
    deleteSearchKeyword() {
      this.searchKeyWord = this.searchKeyWord.slice(0, -1);
    },
    initSearchResult() {
      // 清空搜尋結果
      this.searchKeyWord = '';
      if (this.searchResult !== []) {
        this.searchResult = [];
      }
    },
    // 依據關鍵字搜尋路線，並將路線的UID、起迄站、所屬縣市、中文名稱加入this.searchResult
    async searchRoute() {
      if (this.searchKeyWord !== '' && this.selectedCity) {
        const res = await this.axios.get(
          `https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/${this.selectedCity}?$select=RouteName%2C%20City%2C%20RouteUID%2C%20DepartureStopNameZh%2C%20DestinationStopNameZh&$filter=contains(RouteName%2FZh_tw%2C'${this.searchKeyWord}')&$top=30&$format=JSON`,
          { headers: this.getAuthorizationHeader() },
        );
        this.searchResult = res.data;
      }
    },
    openSearch() {
      this.isSearchOpen = true;
      this.isKeyboardOpen = true;
    },
    closeSearch() {
      this.isSearchOpen = false;
      this.isKeyboardOpen = false;
    },
    closeKeyboard() {
      this.isKeyboardOpen = false;
    },
    sendText(event) {
      this.searchKeyWord += event.target.innerText;
    },
    selectRoute(route) {
      this.$router.push({
        name: 'busRoute',
        params: {
          city: route.City,
          route: route.RouteName.Zh_tw,
          routeUID: route.RouteUID,
        },
      });
    },
  },
  watch: {
    searchKeyWord() {
      // 當key入關鍵字時，即時顯示搜尋結果
      this.searchRoute();
      if (this.searchKeyWord === '') {
        this.searchResult = [];
      }
    },
    selectedCity() {
      // 當選擇城市改變，清空關鍵字及原有搜尋結果
      this.initSearchResult();
    },
  },
  computed: {
    favRouteList() {
      return JSON.parse(localStorage.getItem('favRouteList'));
    },
  },
  inject: ['getAuthorizationHeader'],
};
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  height: calc(100vh - 60px);
}
.fav-route-list {
  width: 262px;
  height: 160px;
  position: absolute;
  background: $white;
  color: $neutrals-600;
  z-index: 99;
  border-radius: $border-radius;
  top: 66px;
  .fav-route-item {
    color: $neutrals-600;
    font-size: $font-body-m;
  }
}
.search-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: $border-radius;
  padding: 8px;
  background: #fff;
  margin-top: 20px;
  margin-bottom: 20px;
  cursor: pointer;
  .search-column {
    flex-grow: 1;
    text-align: left;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: $font-title-s;
    border: none;
  }
}
.search-result {
  background: $white;
  border-radius: $border-radius;
  height: 80%;
  overflow-y: scroll;
  padding-left: 20px;
  padding-top: 10px;
}
.search-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 40px;
  background: $white;
  border-radius: $border-radius;
  width: 100%;
  .route-name {
    min-width: 80px;
    padding-right: 20px;
    text-align: left;
  }
  .start-end-stop {
    color: $neutrals-600;
  }
}
.virtual-keyboard {
  position: absolute;
  bottom: 80px;
  left: 0;
  right: 0;
  padding: 20px;
  margin: 0 auto;
  width: 100%;
}
</style>
