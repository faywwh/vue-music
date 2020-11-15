require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var axios = require('axios')
var cheerio = require('cheerio')
var bodyParser = require('body-parser')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')
const { json } = require('express')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var apiRoutes = express.Router()

// 获取推荐歌单、歌手列表、歌曲详情
apiRoutes.get('/getDiscList', function (req, res) {
  var url = 'https://u.y.qq.com/cgi-bin/musics.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

apiRoutes.post('/getSongUrl', bodyParser.json(), function (req, res) {
  var { sign, ...data } = req.body
  var url = `https://u.y.qq.com/cgi-bin/musics.fcg?sign=${sign}`
  console.log('url', url)
  console.log('data', data)
  axios.post(url, JSON.stringify(data), {
    headers: {
      referer: 'https://i.y.qq.com/',
      'Content-type': 'application/x-www-form-urlencoded'
    }
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

app.use('/api', apiRoutes)

// app.get('/seller', async function (req, res) {
//   var html = await axios.get('https://y.qq.com/')
//   var $ = cheerio.load(html, {
//     decodeEntities: false
//   })
//   var listObj = {}
//   var ul = ''
//   var result = $.html().match(/<ul\sclass=\"event_list\sslide__list[\s\S]*<\/ul>/)
//   result && (ul = result[0])
//   $('li', ul).each(function(index, elem) {
//     var id = $(elem).find('a.event_list__link').attr('data-id')
//     var src = $(elem).find('.event_list__pic').attr('src')
//     console.log('src', src)
//     console.log('id', id)
//     if(id && src) {
//       listObj[id] = {
//         id: id,
//         src: src
//       }
//     }
//   })
//   res.json({
// 		errno: 0,
// 		data: Object.values(listObj)
// 	})
// })

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => { }
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
