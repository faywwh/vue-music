<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="onProgressTouchStart"
        @touchmove.prevent="onProgressTouchMove"
        @touchend="onProgressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
const progressBtnWidth = 16;

export default {
  props: {
    percent: {
      type: Number,
      default: 0,
    },
  },
  created() {
    this.touch = {};
  },
  methods: {
    onProgressTouchStart(e) {
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth;
    },
    onProgressTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const offsetWidth = Math.min(
        this.$refs.progressBar.clientWidth - progressBtnWidth,
        Math.max(0, e.touches[0].pageX - this.touch.startX + this.touch.left)
      );
      this._offsetWidth(offsetWidth);
    },
    onProgressTouchEnd() {
      this.touch.initiated = false;
      this._triggerPercent();
    },
    progressClick(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect();
      const offsetWidth = e.pageX - rect.left;
      this._offsetWidth(offsetWidth);
      this._triggerPercent();
    },
    _offsetWidth(offsetWidth) {
      this.$refs.progress.style.width = offsetWidth + "px";
      this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`;
    },
    _triggerPercent() {
      const percent =
        this.$refs.progress.clientWidth /
        (this.$refs.progressBar.clientWidth - progressBtnWidth);
      this.$emit("percentChange", percent);
    },
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
        let offsetWidth = barWidth * newPercent;
        this._offsetWidth(offsetWidth);
      }
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);

    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>