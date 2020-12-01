import axios from "axios";

// 获取排行榜榜单数据
export function getRank() {
  const url = "/api/getRank";
  const data = {
    jsonpCallback: 'jp0',
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

// 获取榜单歌曲数据
export function getTopListSong(topid) {
  const url = "/api/getTopListSong";
  const data = {
    // jsonpCallback: 'jp1',
    format: 'json',
    topid
  }

  return axios
    .get(url, {
      params: data,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    });
}