import { getLyric } from 'api/song'
import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64'

export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url, tryPlay }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
    this.tryPlay = tryPlay
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }
}

export function createSong(songInfo, url, tryPlay) {
  return new Song({
    id: songInfo.album.id,
    mid: songInfo.mid,
    singer: songInfo.singer[0].name,
    name: songInfo.name,
    album: songInfo.album.name,
    duration: songInfo.interval,
    image: `//y.gtimg.cn/music/photo_new/T002R300x300M000${songInfo.album.mid}_1.jpg?max_age=2592000`,
    url: url,
    tryPlay: tryPlay
  })
}

export function createAlbumSong(song, url, tryPlay) {
  return new Song({
    id: song.albumid,
    mid: song.songmid,
    singer: song.singer[0].name,
    name: song.songname,
    album: song.albumname,
    duration: song.interval,
    image: `//y.gtimg.cn/music/photo_new/T002R300x300M000${song.albummid}_1.jpg?max_age=2592000`,
    url: url,
    tryPlay: tryPlay
  })
}

export function createTopListSong(song, url, tryPlay) {
  return new Song({
    id: song.data.albumid,
    mid: song.data.songmid,
    singer: song.singer[0].name,
    name: song.songname,
    album: song.albumname,
    duration: song.interval,
    image: `//y.gtimg.cn/music/photo_new/T002R300x300M000${song.albummid}_1.jpg?max_age=2592000`,
    url: url,
    tryPlay: tryPlay
  })
}