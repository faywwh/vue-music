<template>
  <transition appear name="slide">
    <music-list
      :rank="rank"
      :title="title"
      :bg-image="bgImage"
      :songs="songs"
    ></music-list>
  </transition>
</template>

<script>
import MusicList from "components/music-list/music-list";
import { mapGetters } from "vuex";
import { getTopListSong } from "api/rank";
import { getSongUrl } from "api/singer";
import { createAlbumSong } from "common/js/song";

export default {
  data() {
    return {
      songs: [],
      rank: true,
    };
  },
  computed: {
    ...mapGetters(["topList"]),
    title() {
      return this.topList.topTitle;
    },
    bgImage() {
      if (this.songs.length > 0) {
        return this.songs[0].image;
      }
      return "";
    },
  },
  created() {
    this._getTopList();
  },
  methods: {
    _getTopList() {
      if (!this.topList.id) {
        this.$router.push("/rank");
        return;
      }
      getTopListSong(this.topList.id).then((res) => {
        this.songs = this._normalizeSong(res.songlist);
      });
    },
    _normalizeSong(list) {
      let ret = [];
      const songmidList = list.map((item) => item.data.songmid);
      getSongUrl({
        songmidList,
      }).then((res) => {
        res.list &&
          res.list.forEach((item, index) => {
            ret.push(
              createAlbumSong(list[index].data, item.m4aUrl, item.tryPlay)
            );
          });
      });
      return ret;
    },
  },
  components: {
    MusicList,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>