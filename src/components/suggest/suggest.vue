<template>
  <scroll
    class="suggest"
    :data="result"
    :pullup="pullup"
    :beforeScroll="beforeScroll"
    @scrollToEnd="searchMore"
    @beforeScroll="listScroll"
    ref="suggest"
  >
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-for="(item, index) in result"
        :key="index"
        @click="selectItem(item)"
      >
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text">{{ getDisplayName(item) }}</p>
        </div>
      </li>
      <loading v-show="hasMore"></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉、暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import { getSuggest } from "api/search";
import Scroll from "base/scroll/scroll";
import { createAlbumSong } from "common/js/song";
import { getSongUrl } from "api/singer";
import Loading from "base/loading/loading";
import { mapMutations, mapActions } from "vuex";
import NoResult from "base/no-result/no-result";

export default {
  props: {
    query: {
      type: String,
      default: "",
    },
    showSinger: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      page: 1,
      result: [],
      pullup: true,
      beforeScroll: true,
      hasMore: true,
    };
  },
  watch: {
    query(newV) {
      if (newV) {
        this.search();
      }
    },
  },
  methods: {
    ...mapMutations({
      setSinger: "SET_SINGER",
    }),
    ...mapActions(["insertSong"]),
    refresh() {
      this.$refs.suggest.refresh();
    },
    selectItem(item) {
      // console.log(item);
      if (item.type === "singer") {
        const singer = {
          id: item.singermid,
          name: item.singername,
          avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.singermid}.jpg?max_age=2592000`,
        };
        this.$router.push({
          path: `/search/${item.singermid}`,
        });
        this.setSinger(singer);
      } else {
        this.insertSong(item);
      }
      this.$emit("select");
    },
    getDisplayName(item) {
      if (item.type === "singer") {
        return item.singername;
      } else {
        return `${item.name}-${item.singer}`;
      }
    },
    getIconCls(item) {
      if (item.type === "singer") {
        return "icon-mine";
      } else {
        return "icon-music";
      }
    },
    async search() {
      this.page = 1;
      this.hasMore = true;
      this.$refs.suggest.scrollTo(0, 0);
      const { data } = await getSuggest(this.query, this.showSinger, this.page);
      this.result = await this._getResult(data);
      this._checkMore(data);
    },
    searchMore() {
      if (!this.hasMore) {
        return;
      }
      this.page++;
      getSuggest(this.query, this.showSinger, this.page).then(async (res) => {
        this.result = this.result.concat(await this._getResult(res.data));
        this._checkMore(res.data);
      });
    },
    listScroll() {
      this.$emit("listScroll");
    },
    _checkMore(data) {
      const song = data.song;
      if (
        !song.list.length ||
        song.curnum + (song.curpage - 1) * 20 >= song.totalnum
      ) {
        this.hasMore = false;
      }
    },
    async _getResult(data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid && this.page === 1) {
        ret.push({ ...data.zhida, ...{ type: "singer" } });
      }
      if (data.song) {
        ret = ret.concat(await this._normalizeSong(data.song.list));
      }
      return ret;
    },
    async _normalizeSong(list) {
      let ret = [];
      const songmidList = list.map((item) => item.songmid);
      const res = await getSongUrl({
        songmidList,
      });
      res.list &&
        res.list.forEach((item, index) => {
          ret.push(createAlbumSong(list[index], item.m4aUrl, item.tryPlay));
        });
      return ret;
    },
  },
  components: {
    Scroll,
    Loading,
    NoResult,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }

    .icon {
      flex: 0 0 30px;
      width: 30px;

      [class^='icon-'] {
        font-size: 14px;
        color: $color-text-d;
      }
    }

    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;

      .text {
        no-wrap();
      }
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>