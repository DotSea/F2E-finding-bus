<template>
  <div class="accordion accordion-flush" id="accordion">
    <div class="accordion-item">
      <h2 class="accordion-header" id="headingOne">
        <button
          class="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseOne"
          aria-expanded="true"
          aria-controls="collapseOne"
        >
          常用站牌
        </button>
      </h2>
      <div
        id="collapseOne"
        class="accordion-collapse collapse show"
        aria-labelledby="headingOne"
        data-bs-parent="#accordion"
      >
        <!-- 站牌資訊 -->
        <div class="accordion-body row">
          <div class="col-4">
            <div class="arrival-time p-2">3分</div>
          </div>
          <div class="station-info col-7">
            <p class="station-name mb-2">幸福站</p>
            <div class="route-info row">
              <p class="bus-name col-2 mb-0">299</p>
              <p class="direction col-10 mb-0">往永春高中</p>
            </div>
          </div>
          <div class="option-column col-1">
            <button class="like-icon"><LikeIcon /></button>
            <button class="info-icon"><InfoIcon /></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LikeIcon from '../assets/svg/like-icon-active.svg';
import InfoIcon from '../assets/svg/info-icon.svg';

export default {
  components: { LikeIcon, InfoIcon },
};
</script>
<style lang="scss" scoped>
.arrival-time {
  text-align: center;
  width: 98px;
  height: 45px;
  font-size: 18px;
  line-height: 26px;
  background: $neutrals-300;
  border-radius: $border-radius;
}
.station-info {
  display: flex;
  flex-direction: column;
  .station-name {
    font-size: 18px;
  }
  .route-info {
    display: flex;
    justify-content: flex-start;
    color: $neutrals-600;
    padding-left: 5px;
    margin-bottom: 0px;
  }
}
.option-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
</style>
