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
    this._getSingerDetail(this.singer.id);
    getSongUrl({
      data: 1,
    });
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
    _getSingerDetail(singerId) {
      getSingerDetail(singerId).then((res) => {
        this.songs = this._normalizeSong(res.singerSongList.data.songList);
        console.log(this.songs);
      });
    },
    _normalizeSong(list) {
      let ret = [];
      for (let item of list) {
        ret.push(createSong(item.songInfo));
      }
      return ret;
    },
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