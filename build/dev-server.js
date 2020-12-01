require("./check-versions")();

var config = require("../config");
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}

var opn = require("opn");
var path = require("path");
var express = require("express");
var axios = require("axios");
var cheerio = require("cheerio");
var bodyParser = require("body-parser");
var webpack = require("webpack");
var proxyMiddleware = require("http-proxy-middleware");
var webpackConfig = require("./webpack.dev.conf");
const { json } = require("express");

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port;
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser;
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable;

var app = express();
var compiler = webpack(webpackConfig);

var apiRoutes = express.Router();

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

apiRoutes.get("/seller", async function (req, res) {
  var result = await axios.get("https://y.qq.com/");
  var $ = cheerio.load(result.data, {
    decodeEntities: false,
  });
  var listObj = {};
  $(".event_list.slide__list.js_list li").each(function (index, elem) {
    var id = $(elem).find(".event_list__link").attr("data-id");
    var src = $(elem).find(".event_list__pic").attr("src");
    console.log("src", src);
    console.log("id", id);
    if (id && src) {
      listObj[id] = {
        id: id,
        src: src,
      };
    }
  });
  res.send(result.data);
  // res.json({
  // 	errno: 0,
  // 	data: Object.values(listObj)
  // })
});

app.use("/api", apiRoutes);

var devMiddleware = require("webpack-dev-middleware")(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true,
});

var hotMiddleware = require("webpack-hot-middleware")(compiler, {
  log: () => { },
});
// force page reload when html-webpack-plugin template changes
compiler.plugin("compilation", function (compilation) {
  compilation.plugin("html-webpack-plugin-after-emit", function (data, cb) {
    hotMiddleware.publish({ action: "reload" });
    cb();
  });
});

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context];
  if (typeof options === "string") {
    options = { target: options };
  }
  app.use(proxyMiddleware(options.filter || context, options));
});

// handle fallback for HTML5 history API
app.use(require("connect-history-api-fallback")());

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// serve pure static assets
var staticPath = path.posix.join(
  config.dev.assetsPublicPath,
  config.dev.assetsSubDirectory
);
app.use(staticPath, express.static("./static"));

var uri = "http://localhost:" + port;

var _resolve;
var readyPromise = new Promise((resolve) => {
  _resolve = resolve;
});

console.log("> Starting dev server...");
devMiddleware.waitUntilValid(() => {
  console.log("> Listening at " + uri + "\n");
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== "testing") {
    opn(uri);
  }
  _resolve();
});

var server = app.listen(port);

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close();
  },
};
