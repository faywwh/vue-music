import axios from "axios";

// 获取热词
export function getHotKey() {
  const url = "/api/getHotKey";
  const data = {
  }

  return axios
    .get(url, {
      params: data,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    });
}

// 获取搜索结果
export function getSuggest(query, zhida, page) {
  const url = "/api/getSuggest";
  const data = {
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    w: query,
    catZhida: zhida ? 1 : 0,
    perpage: 20,
    n: 20,
    p: page,
  }

  return axios
    .get(url, {
      params: data,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    });
}