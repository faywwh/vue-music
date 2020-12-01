<template>
  <transition appear name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import { getSingerDetail, getSongUrl } from "api/singer";
import { createSong } from "common/js/song";
import musicList from "components/music-list/music-list";

export default {
  data() {
    return {
      songs: [],
    };
  },
  created() {
    this._getSingerDetail();
  },
  computed: {
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.avatar;
    },
    ...mapGetters(["singer"]),
  },
  methods: {
    _getSingerDetail() {
      if (!this.singer.id) {
        this.$router.push("/singer");
        return;
      }
      getSingerDetail(this.singer.id).then((res) => {
        this.songs = this._normalizeSong(res.singerSongList.data.songList);
      });
    },
    //  格式化歌曲列表数据
    _normalizeSong(list) {
      let ret = [];
      const songmidList = list.map((item) => item.songInfo.mid);
      getSongUrl({
        songmidList,
      }).then((res) => {
        res.list &&
          res.list.forEach((item, index) => {
            ret.push(
              createSong(list[index].songInfo, item.m4aUrl, item.tryPlay)
            );
          });
      });
      return ret;
    },
    //  同步操作
    // __normalizeSong(list) {
    //   let ret = [];
    //   const promiseArr = [];
    //   list.forEach((item) => {
    //     promiseArr.push(getSongUrl({ songmidList: [item.songInfo.mid] }));
    //   });
    //   Promise.all(promiseArr).then((res) => {
    //     res.forEach((data, index) => {
    //       ret.push(createSong(list[index].songInfo, data.list[0].m4aUrl));
    //     });
    //   });
    //   return ret;
    // },
  },
  components: {
    musicList,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>