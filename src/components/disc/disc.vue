<template>
  <transition appear="" name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import musicList from "components/music-list/music-list";
import { mapGetters } from "vuex";
import { getDiscSong } from "api/recommend";
import { createAlbumSong } from "common/js/song";
import { getSongUrl } from "api/singer";

export default {
  data() {
    return {
      songs: [],
    };
  },
  computed: {
    ...mapGetters(["disc"]),
    title() {
      return this.disc.title;
    },
    bgImage() {
      return this.disc.cover;
    },
  },
  created() {
    this._initDiscSong();
  },
  components: {
    musicList,
  },
  methods: {
    _initDiscSong() {
      if (!this.disc.content_id) {
        this.$router.push({
          path: "/recommend",
        });
        return;
      }
      getDiscSong(this.disc.content_id).then((res) => {
        // console.log(res.cdlist[0].songlist);
        this.songs = this._normalizeSong(res.cdlist[0].songlist);
      });
    },
    _normalizeSong(list) {
      let ret = [];
      const songmidList = list.map((item) => item.songmid);
      getSongUrl({
        songmidList,
      }).then((res) => {
        res.list &&
          res.list.forEach((item, index) => {
            ret.push(createAlbumSong(list[index], item.m4aUrl, item.tryPlay));
          });
      });
      return ret;
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>