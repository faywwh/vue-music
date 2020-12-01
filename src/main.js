import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import fastclick from 'fastclick'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import store from './store'
import axios from 'axios'
import 'common/stylus/index.styl'

// 环境变量处理
const env = process.env.NODE_ENV
if (env === 'development') {
  axios.defaults.baseURL = '/'
} else if (env === 'production') {
  axios.defaults.baseURL = '/music'
}

Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
})

fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
