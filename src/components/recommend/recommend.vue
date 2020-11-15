<template>
  <div class="recommend">
    <scroll class="recommend-content" :data="distData" ref="Scroll">
      <div>
        <div
          v-if="recommends.length"
          class="slider-wrapper"
          ref="sliderWrapper"
        >
          <slider>
            <div v-for="(item, index) in recommends" :key="index">
              <a href="http://www.baidu.com">
                <img :src="item.url" class="needsclick" @load="loadImage" />
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="(item, index) in distData" :key="index">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.cover" />
              </div>
              <div class="text">
                <h2 class="name">{{ item.title }}</h2>
                <p class="desc">
                  播放量：{{ parseInt(item.listen_num / 1000) / 10 }}万
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container">
        <loading v-if="!distData.length"></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from "base/scroll/scroll";
import slider from "base/slider/slider";
import Loading from "base/loading/loading";
import { getDiscList } from "api/recommend";

export default {
  data() {
    return {
      recommends: [
        {
          url:
            "//y.gtimg.cn/music/common/upload/MUSIC_FOCUS/3210779.jpg?max_age=2592000",
        },
        {
          url:
            "//y.gtimg.cn/music/common/upload/MUSIC_FOCUS/3210493.jpg?max_age=2592000",
        },
        {
          url:
            "//y.gtimg.cn/music/common/upload/MUSIC_FOCUS/3215539.jpg?max_age=2592000",
        },
      ],
      distData: [],
    };
  },
  components: {
    slider,
    Scroll,
    Loading,
  },
  created() {
    this._getDiscList();
  },
  methods: {
    _getDiscList() {
      getDiscList().then((res) => {
        this.distData = res.recomPlaylist.data.v_hot;
      });
    },
    loadImage() {
      if (!this.checked) {
        this.checked = true;
        this.$refs.Scroll.refresh();
      }
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
