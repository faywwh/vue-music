<template>
  <div class="singer" ref="singer">
    <list-view
      :data="singers"
      @select="selectSinger"
      ref="listview"
    ></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSingerList } from "api/singer";
import { getFirstLetter } from "common/js/getFirstLetter";
import ListView from "base/listview/listview";
import { mapMutations } from "vuex";
import { playlistMixin } from "common/js/mixin";

export default {
  mixins: [playlistMixin],
  data() {
    return {
      singers: [],
    };
  },
  created() {
    this._initSinger();
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.singer.style.bottom = bottom;
      this.$refs.listview.refresh();
    },
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`,
      });
      this.setSinger(singer);
    },
    _initSinger() {
      getSingerList().then((data) => {
        this.singers = this.sortName(data.singerList.data.singerlist);
      });
    },
    sortName(list) {
      list.map((item) => {
        let name = item.singer_name;
        item["Findex"] = /^\w+/.test(name)
          ? name.substring(0, 1)
          : getFirstLetter(name);
        return list;
      });
      let map = {
        hot: {
          title: "热门",
          items: [],
        },
      };
      list.forEach((item, index) => {
        if (index < 10) {
          map.hot.items.push({
            id: item.singer_mid,
            name: item.singer_name,
            avatar: item.singer_pic,
          });
        }
        const key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: [],
          };
        }
        map[key].items.push({
          id: item.singer_mid,
          name: item.singer_name,
          avatar: item.singer_pic,
        });
      });
      // 把map数据处理成有序的
      let ret = [];
      let hot = [];
      for (let key in map) {
        let val = map[key];
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val);
        } else if (val.title === "热门") {
          hot.push(val);
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret);
    },
    ...mapMutations({
      setSinger: "SET_SINGER",
    }),
  },
  components: {
    ListView,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>