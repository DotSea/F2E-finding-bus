<template>
  <div class="container">
    <MenuIcon class="menu" />
    <div class="logo"><BusLogo />公車好找</div>
    <div class="climate"><WeatherLogo />天氣 <TemperatureLogo />氣溫</div>
  </div>

  <div>123</div>
</template>

<script>
import BusLogo from '../assets/svg/Bus-white.svg';
import MenuIcon from '../assets/svg/menu.svg';
import WeatherLogo from '../assets/svg/weather.svg';
import TemperatureLogo from '../assets/svg/temperature.svg';

export default {
  name: 'TheHeader',
  components: {
    BusLogo,
    MenuIcon,
    WeatherLogo,
    TemperatureLogo,
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 60px;
  background-color: $primary-blue;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 23px;
  padding-right: 23px;
}

.logo {
  min-width: 93px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.climate {
  min-width: 107px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
