<template>
  <div class="search-row">
    <button><FavIcon /></button>
    <button v-if="!isSearchOpen" @click="openSearch" class="search-column">找公車</button>
    <input
      v-else
      class="search-column"
      @keyup.enter="searchRoute"
      @keyup.esc="closeSearch"
      v-model="searchKeyWord"
      type="text"
      placeholder="搜尋公車路線"
    />
    <button><SearchIcon @click="searchRoute" /></button>
  </div>

  <StationCard class="mb-3" v-if="!isSearchOpen" />
  <StationCard class="pb-0" v-if="!isSearchOpen" />
  <div
    @click="selectRoute"
    class="searchItem mb-2"
    v-else
    v-for="(item, index) in searchResult"
    :key="index"
  >
    路線：{{ item.RouteName.Zh_tw }}|| 起站：{{ item.DepartureStopNameZh }}|| 迄站：{{
      item.DestinationStopNameZh
    }}{{ item.RouteUID }} {{ item.CityCode }}
  </div>
</template>

<script>
import FavIcon from '../assets/svg/fav-icon.svg';
import SearchIcon from '../assets/svg/search-icon.svg';
import StationCard from './StationCard.vue';

export default {
  name: 'index',
  components: { FavIcon, SearchIcon, StationCard },
  data() {
    return {
      searchKeyWord: '',
      searchResult: [],
      isSearchOpen: false,
    };
  },
  methods: {
    // 依據關鍵字搜尋路線，並將路線的UID、起迄站、所屬縣市、中文名稱加入this.searchResult
    async searchRoute() {
      const res = await this.axios.get(
        `https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/NewTaipei?$select=RouteName%2C%20CityCode%2C%20RouteUID%2C%20DepartureStopNameZh%2C%20DestinationStopNameZh&$filter=contains(RouteName%2FZh_tw%2C'${this.searchKeyWord}')&$top=30&$format=JSON`,
        { headers: this.getAuthorizationHeader() },
      );
      this.searchResult = res.data;
      console.log(res.data);
    },
    openSearch() {
      this.isSearchOpen = true;
    },
    closeSearch() {
      this.isSearchOpen = false;
    },
    selectRoute() {
      console.log('select');
      this.$router.push('busroute');
    },
  },
  inject: ['getAuthorizationHeader'],
};
</script>

<style lang="scss" scoped>
.search-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: $border-radius;
  border: 1px solid black;
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
.searchItem {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  background: $white;
  border-radius: $border-radius;
}
</style>
