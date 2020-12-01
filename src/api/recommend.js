import { commonParams } from './config'
import axios from 'axios'

export function getDiscList() {
  const url = '/api/getDiscList'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq.json',
    hostUin: 0,
    loginUin: 0,
    needNewCode: 0,
    sign: 'zza79qn9pk23yzlstv1099cdff7fe034e6f3eaf2265079283d',
    format: 'json',
    data: {
      comm: {
        ct: 24
      },
      recomPlaylist: {
        method: 'get_hot_recommend',
        param: {
          async: 1,
          cmd: 2
        },
        module: 'playlist.HotRecommendServer'
      }
    }
  })

  return axios
    .get(url, {
      params: data
    })
    .then((res) => {
      return Promise.resolve(res.data)
    })
}

export function getDiscSong(disstid) {
  const url = '/api/getDiscSong'

  const data = {
    disstid,
    format: 'json',
    type: '1',
    inCharset: 'utf8',
    outCharset: 'utf-8'
  }

  return axios
    .get(url, {
      params: data
    })
    .then((res) => {
      return Promise.resolve(res.data)
    })
}