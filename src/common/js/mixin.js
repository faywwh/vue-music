import { mapActions, mapGetters, mapMutations } from 'vuex'
import { playMode } from "common/js/config";
import { shuffle } from "common/js/util";

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playList)
  },
  activated() {
    this.handlePlaylist(this.playList)
  },
  watch: {
    playList(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = {
  computed: {
    ...mapGetters([
      "sequenceList",
      "currentSong",
      "mode",
      "currentIndex",
      "playList",
      "favoriteList"
    ]),
    iconMode() {
      return this.mode === playMode.sequence
        ? "icon-sequence"
        : this.mode === playMode.loop
          ? "icon-loop"
          : "icon-random";
    },
  },
  methods: {
    ...mapMutations({
      setMode: "SET_MODE",
      setPlayList: "SET_PLAYLIST",
      setCurrentIndex: "SET_CURRENTINDEX",
      setPlaying: "SET_PLAYING",
    }),
    ...mapActions([
      "saveFavoriteList",
      "deleteFavoriteList"
    ]),
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      } else {
        return 'icon-not-favorite'
      }
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.mid === song.mid
      })
      return index > -1
    },
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setMode(mode);
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.setPlayList(list);
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
  }
}

export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 200
    }
  },
  computed: {
    ...mapGetters(["searchHistory"]),
  },
  methods: {
    ...mapActions([
      "saveSearchHistory",
      "deleteSearchHistory"
    ]),
    onQueryChange(query) {
      this.query = query;
    },
    blurInput() {
      this.$refs.searchBox.blur();
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query);
    },
    saveSearch() {
      this.saveSearchHistory(this.query);
    },
  }
}