import { commonParams } from "./config";
import axios from "axios";

export function getSingerList() {
  const url = "/api/getDiscList";
  const data = Object.assign({}, commonParams, {
    sign: "zzaskhsx0ik0h42u5k2f3fef04bda3a286eeb40136f6b80f4a",
    data: {
      comm: {
        ct: 24,
        cv: 0,
      },
      singerList: {
        module: "Music.SingerListServer",
        method: "get_singer_list",
        param: {
          area: -100,
          sex: -100,
          genre: -100,
          index: -100,
          sin: 0,
          cur_page: 1,
        },
      },
    },
  });

  return axios
    .get(url, {
      params: data,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    });
}

export function getSongUrl({ singerMid = '0025NhlN2yWrP4', songmid = '003hFxQh276Cv5', songtype = 0 }) {
  // const signData = {
  //   comm: {
  //     ct: 24,
  //     cv: 0,
  //   },
  //   singerSongList: {
  //     method: "GetSingerSongList",
  //     param: {
  //       order: 1,
  //       singerMid: singerMid,
  //       begin: 0,
  //       num: 10,
  //     },
  //     module: "musichall.song_list_server",
  //   },
  // };
  const data = {
    sign: 'zzafi7i9ytawy496a6231fcce5873aac177284c42746c',
    // sign: getSign(signData),
    req_0: {
      module: "vkey.GetVkeyServer",
      method: "CgiGetVkey",
      param: {
        guid: "8947964065",
        songmid: [songmid],
        songtype: [songtype],
        filename: ["RS02002q83Sd2G7Y7D.mp3"],
        uin: "857763476",
        loginflag: 1,
        platform: "23",
        h5to: "speed",
      },
    },
    comm: {
      g_tk: 1347101315,
      uin: 857763476,
      format: "json",
      platform: "h5"
    },
  };
  console.log(data)
  return axios.post("/api/getSongUrl", data).then((res) => {
    return Promise.resolve(res.data);
  });
}

export function getSingerDetail(singerId) {
  const url = "/api/getDiscList";
  const data = {
    comm: {
      ct: 24,
      cv: 0,
    },
    singerSongList: {
      method: "GetSingerSongList",
      param: {
        order: 1,
        singerMid: singerId,
        begin: 0,
        num: 10,
      },
      module: "musichall.song_list_server",
    },
  };
  let sign = getSign(data)
  const params = Object.assign(
    {},
    {
      sign,
      data,
    }
  );

  return axios
    .get(url, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    });
}

function getSign(data) {
  let str = "abcdefghijklmnopqrstuvwxyz0123456789";
  let count = Math.floor(Math.random() * 7 + 10);
  let sign = "zza";
  for (let i = 0; i < count; i++) {
    sign += str[Math.floor(Math.random() * 36)];
  }
  sign += window.__sign_hash_20200305("CJBPACrRuNy7" + JSON.stringify(data));
  return sign
}
