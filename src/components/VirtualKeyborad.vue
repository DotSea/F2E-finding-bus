<template>
  <div class="container virtual-keyboard">
    <div class="row row-cols-5 g-0">
      <div class="col-11">
        <button class="select-city mb-2" @click="openCitySelector" v-if="!isCitySelectorOpen">
          選擇城市
        </button>
      </div>
      <div class="col-1">
        <button @click="closeKeyboard">
          <font-awesome-icon :icon="['fas', 'chevron-down']" />
        </button>
      </div>

      <div class="col" v-if="!isCitySelectorOpen">
        <button :disabled="!selectedCity" class="keyboard-btn mb-2" @click="sendText($event)">
          紅
        </button>
        <button :disabled="!selectedCity" class="keyboard-btn mb-2" @click="sendText($event)">
          棕
        </button>
        <button :disabled="!selectedCity" class="keyboard-btn mb-2" @click="sendText($event)">
          橘
        </button>
        <button :disabled="!selectedCity" class="keyboard-btn mb-2" @click="sendText($event)">
          幹線
        </button>
      </div>
      <div class="col" v-if="!isCitySelectorOpen">
        <button :disabled="!selectedCity" class="keyboard-btn mb-2" @click="sendText($event)">
          藍
        </button>
        <button :disabled="!selectedCity" class="keyboard-btn mb-2" @click="sendText($event)">
          綠
        </button>
        <button :disabled="!selectedCity" class="keyboard-btn mb-2" @click="sendText($event)">
          小
        </button>
        <button :disabled="!selectedCity" class="keyboard-btn mb-2" @click="sendText($event)">
          更多
        </button>
      </div>
      <div class="col" v-if="!isCitySelectorOpen">
        <button :disabled="!selectedCity" class="keyboard-btn mb-2" @click="sendText($event)">
          1
        </button>
        <button :disabled="!selectedCity" class="keyboard-btn mb-2" @click="sendText($event)">
          4
        </button>
        <button :disabled="!selectedCity" class="keyboard-btn mb-2" @click="sendText($event)">
          7
        </button>
        <button :disabled="!selectedCity" class="keyboard-btn mb-2" @click="initSearchResult">
          重設
        </button>
      </div>
      <div class="col" v-if="!isCitySelectorOpen">
        <button :disabled="!selectedCity" class="keyboard-btn mb-2" @click="sendText($event)">
          2
        </button>
        <button :disabled="!selectedCity" class="keyboard-btn mb-2" @click="sendText($event)">
          5
        </button>
        <button :disabled="!selectedCity" class="keyboard-btn mb-2" @click="sendText($event)">
          8
        </button>
        <button :disabled="!selectedCity" class="keyboard-btn mb-2" @click="sendText($event)">
          0
        </button>
      </div>
      <div class="col" v-if="!isCitySelectorOpen">
        <button :disabled="!selectedCity" class="keyboard-btn mb-2" @click="sendText($event)">
          3
        </button>
        <button :disabled="!selectedCity" class="keyboard-btn mb-2" @click="sendText($event)">
          6
        </button>
        <button :disabled="!selectedCity" class="keyboard-btn mb-2" @click="sendText($event)">
          9
        </button>
        <button :disabled="!selectedCity" class="keyboard-btn mb-2" @click="deleteSearchKeyword">
          <font-awesome-icon :icon="['fas', 'backspace']" />
        </button>
      </div>
    </div>
    <div class="city-selector row row-cols-5 g-2" v-show="isCitySelectorOpen">
      <div v-for="(cityEng, cityZh) in cityName" :key="cityEng" class="col">
        <button
          @click="chooseCity($event)"
          :value="cityEng"
          :class="{ 'keyboard-btn': true, active: this.selectedCity === cityEng, 'mb-1': true }"
        >
          {{ cityZh }}
        </button>
      </div>

      <div class="col-7">
        <div class="large-btn">
          <button class="keyboard-btn text-secondary mb-1" @click="openCitySelector">返回</button>
          <button class="keyboard-btn mb-1">確定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'keyboard',
  data() {
    return {
      isCitySelectorOpen: false,
      selectedCity: '',
    };
  },
  methods: {
    openCitySelector() {
      this.isCitySelectorOpen = !this.isCitySelectorOpen;
    },
    chooseCity(event) {
      // 選擇城市
      this.selectedCity = event.target.value;
      this.$emit('emitSelectedCity', this.selectedCity);
      this.openCitySelector();
    },
  },
  props: ['sendText', 'initSearchResult', 'deleteSearchKeyword', 'closeKeyboard'],
  computed: {
    cityName() {
      return {
        基隆市: 'Keelung',
        臺北市: 'Taipei',
        新北市: 'NewTaipei',
        桃園市: 'Taoyuan',
        新竹市: 'Hsinchu',
        新竹縣: 'HsinchuCounty',
        苗栗縣: 'MiaoliCounty',
        臺中市: 'Taichung',
        彰化縣: 'ChanghuaCounty',
        南投縣: 'NantouCounty',
        雲林縣: 'YunlinCounty',
        嘉義縣: 'ChiayiCounty',
        嘉義市: 'Chiayi',
        臺南市: 'Tainan',
        高雄市: 'Kaohsiung',
        屏東縣: 'PingtungCounty',
        宜蘭縣: 'YilanCounty',
        花蓮縣: 'HualienCounty',
        臺東縣: 'TaitungCounty',
        金門縣: 'KinmenCounty',
        澎湖縣: 'PenghuCounty',
        連江縣: 'LienchiangCounty',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.virtual-keyboard {
  background: $neutrals-300;
  border-radius: $border-radius;

  .select-city {
    border-radius: $border-radius;
    background: $white;
    font-size: 14px;
    font-weight: 400;
    width: 124px;
    height: 38px;
    margin-left: 20px;
    &:hover:enabled {
      background: lighten($primary, 10);
      color: $white;
    }
  }

  .col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .keyboard-btn {
    border-radius: $border-radius;
    width: 59px;
    height: 59px;
    text-align: center;
    background: $white;
    font-size: 14px;
    font-weight: 400;
    &:disabled {
      cursor: not-allowed;
    }
    &:hover:enabled {
      background: lighten($primary, 10);
      color: $white;
    }
  }
  .active {
    background: $primary;
    color: $white;
  }
  .large-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 10px;
    padding-left: 10px;
    .keyboard-btn {
      width: calc(50% - 5px);
    }
  }
  @include media-breakpoint-down(s) {
    .keyboard-btn {
      width: 40px;
      height: 40px;
    }
  }
}
</style>
