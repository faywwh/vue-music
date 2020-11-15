export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}

export function createSong(songInfo) {
  return new Song({
    id: songInfo.album.id,
    mid: songInfo.album.mid,
    singer: songInfo.singer[0].name,
    name: songInfo.name,
    album: songInfo.album.name,
    duration: songInfo.interval,
    image: `//y.gtimg.cn/music/photo_new/T002R300x300M000${songInfo.album.mid}_1.jpg?max_age=2592000`,
    url: `ddddd`
  })
}