// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import Vuex from 'vuex'
import store from './store/index.js'
import 'amfe-flexible'
import { ToastPlugin } from 'vux'
Vue.use(ToastPlugin);
import {sendHttp} from "./assets/js/request";

Vue.prototype.$axios = axios
Vue.use(Vuex)
Vue.config.productionTip = false
Vue.prototype.sendHttp = sendHttp

// 给输入框自动获取焦点
Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
});

//测试环境
Vue.prototype.baseUrl = 'http://192.168.5.8:12402';
//生产环境
//Vue.prototype.baseUrl = 'http://api.share.duoduiduo.com';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
