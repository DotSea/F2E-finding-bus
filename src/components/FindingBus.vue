<template>
  <div class="page">
    <div class="search-row">
      <button><FavIcon /></button>
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
      <button @mousedown="searchRoute(item)"><SearchIcon /></button>
    </div>

    <StationCard class="mb-3" v-if="!isSearchOpen" />
    <StationCard class="pb-0" v-if="!isSearchOpen" />
    <div v-else class="search-result" @mousedown.self="closeSearch">
      <button
        @mousedown="selectRoute(item)"
        class="btn search-item mb-2"
        v-for="(item, index) in searchResult"
        :key="index"
      >
        {{ item.RouteName.Zh_tw }} {{ item.DepartureStopNameZh }} -
        {{ item.DestinationStopNameZh }}
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
import SearchIcon from '../assets/svg/search-icon.svg';
import StationCard from './StationCard.vue';
import VirtualKeyboard from './VirtualKeyborad.vue';

export default {
  name: 'index',
  components: {
    FavIcon,
    SearchIcon,
    StationCard,
    VirtualKeyboard,
  },
  data() {
    return {
      searchKeyWord: '',
      searchResult: [],
      isSearchOpen: false,
      selectedCity: '',
      isKeyboardOpen: false,
    };
  },
  methods: {
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
      console.log(event.target.innerText);
      this.searchKeyWord += event.target.innerText;
    },
    selectRoute(stop) {
      this.$router.push({
        name: 'busRoute',
        params: {
          city: stop.City,
          route: stop.RouteName.Zh_tw,
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
  inject: ['getAuthorizationHeader'],
};
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  height: calc(100vh - 60px);
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
  height: 80%;
  overflow-y: scroll;
}
.search-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 40px;
  background: $white;
  border-radius: $border-radius;
  width: 100%;
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
