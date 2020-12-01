import Vue from 'vue'
import Router from 'vue-router'

const rank = () => import('components/rank/rank')
const recommend = () => import('components/recommend/recommend')
const search = () => import('components/search/search')
const singer = () => import('components/singer/singer')
const singerDetail = () => import('components/singer-detail/singer-detail')
const disc = () => import('components/disc/disc')
const topList = () => import('components/top-list/top-list')
const userCenter = () => import('components/user-center/user-center')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/rank',
      component: rank,
      children: [
        {
          path: ':id',
          component: topList
        }
      ]
    },
    {
      path: '/search',
      component: search,
      children: [
        {
          path: ':id',
          component: singerDetail
        }
      ]
    },
    {
      path: '/singer',
      component: singer,
      children: [
        {
          path: ':id',
          component: singerDetail
        }
      ]
    },
    {
      path: '/recommend',
      component: recommend,
      children: [
        {
          path: ":id",
          component: disc
        }
      ]
    },
    {
      path: '/user',
      component: userCenter
    }
  ]
})
