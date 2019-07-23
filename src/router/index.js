import Vue from 'vue'
import Router from 'vue-router'
import home from '@/pages/home/home'
import login from '@/pages/login/login'
import paySuc from '@/pages/paySuccess'
import chargeDetail from '@/pages/chargeDetail/chargeDetail'
import chargeEnd from '@/pages/chargeDetail/chargeEnd'

Vue.use(Router)

export default new Router({
  routes: [
    {
      //首页
      path: '/',
      name: 'home',
      component: home
    },
    {
      //登录页
      path: '/login',
      name: 'login',
      component: login
    },
    {
      //支付完成
      path: '/paySuc',
      name: 'paySuc',
      component: paySuc
    },
    {
      //充电详情
      path: '/chargeDetail',
      name: 'chargeDetail',
      component: chargeDetail
    },
    {
      //充电结束
      path: '/chargeEnd',
      name: 'chargeEnd',
      component: chargeEnd
    }
  ]
})
