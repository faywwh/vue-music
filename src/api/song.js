import axios from "axios";
// import { commonParams } from './config'

// 获取歌词
export function getLyric(songmid) {
  const url = "/api/getLyric";
  const data = {
    songmid,
    format: "json",
  }

  return axios
    .get(url, {
      params: data,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    });
}