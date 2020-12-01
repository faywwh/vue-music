var express = require('express')
var config = require('./config/index')
var axios = require('axios')
const bodyParser = require('body-parser')

var port = process.env.PORT || config.build.port

var app = express()

var apiRoutes = express.Router()

// 获取搜索结果
apiRoutes.get("/getSuggest", function (req, res) {
  var url = "https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp";
  axios
    .get(url, {
      headers: {
        referer: "https://i.y.qq.com/",
      },
      params: req.query,
    })
    .then((response) => {
      res.json(response.data);
    })
    .catch((e) => {
      console.log(e);
    });
});

// 获取搜索热词
apiRoutes.get("/getHotKey", function (req, res) {
  var url = "https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg";
  axios
    .get(url, {
      headers: {
        referer: "https://y.qq.com/",
      },
      params: req.query,
    })
    .then((response) => {
      res.json(response.data);
    })
    .catch((e) => {
      console.log(e);
    });
});

// 获取排行榜榜单数据
apiRoutes.get("/getRank", function (req, res) {
  var url = "https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg";
  axios
    .get(url, {
      headers: {
        referer: "https://y.qq.com/",
      },
      params: req.query,
    })
    .then((response) => {
      res.json(response.data);
    })
    .catch((e) => {
      console.log(e);
    });
});

// 获取排行榜歌曲数据
apiRoutes.get("/getTopListSong", function (req, res) {
  var url = "https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg";
  axios
    .get(url, {
      headers: {
        referer: "https://y.qq.com/",
      },
      params: req.query,
    })
    .then((response) => {
      res.json(response.data);
    })
    .catch((e) => {
      console.log(e);
    });
});

// 获取推荐歌单、歌手列表、歌曲详情
apiRoutes.get("/getDiscList", function (req, res) {
  var url = "https://u.y.qq.com/cgi-bin/musics.fcg";
  axios
    .get(url, {
      headers: {
        referer: "https://y.qq.com/",
      },
      params: req.query,
    })
    .then((response) => {
      res.json(response.data);
    })
    .catch((e) => {
      console.log(e);
    });
});

// 获取推荐歌单歌曲列表
apiRoutes.get("/getDiscSong", function (req, res) {
  var url = "https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg";
  axios
    .get(url, {
      headers: {
        referer: "https://y.qq.com/",
      },
      params: req.query,
    })
    .then((response) => {
      res.json(response.data);
    })
    .catch((e) => {
      console.log(e);
    });
});

// 获取歌词
apiRoutes.get("/getLyric", function (req, res) {
  var url = "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg";
  axios
    .get(url, {
      headers: {
        referer: "https://y.qq.com/",
      },
      params: req.query,
    })
    .then((response) => {
      res.json(response.data);
    })
    .catch((e) => {
      console.log(e);
    });
});

// 获取歌曲url
apiRoutes.post("/getSongUrl", bodyParser.json(), function (req, res) {
  var { songmidList = [] } = req.body;
  var url = `https://i.y.qq.com/v8/playsong.html`;
  axios
    .get(url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
      },
      params: {
        songmid: songmidList.join(","),
        _qmp: 0,
      },
    })
    .then((result) => {
      var data = {
        code: 0,
      };
      if (/window\.songlist\s=\s([\s\S]*}\]);/.test(result.data)) {
        data.list = JSON.parse(RegExp.$1);
      } else {
        data.code = -1;
      }
      res.json(data);
    });
});

app.use("/music/api", apiRoutes);

app.use('/music', express.static('./dist'));

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})