import axios from "axios";
import router from "../../router";
import Qs from 'qs'
import Vue from 'vue'

//设置拦截
// 发起普通请求，不验证token
let baseRequest = axios.create({});

// 带token的请求，可能导致跨域
let authRequest = axios.create({});

// authRequest请求拦截器
authRequest.interceptors.request.use(
  config => {
    if (localStorage.getItem("Authorization")) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = localStorage.getItem("Authorization");
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// authRequest响应拦截器
authRequest.interceptors.response.use(
  function (response) {
    return responseReturn(response)
  },
  error => {
    return Promise.reject(error);
  }
);

// baseRequest响应拦截器
baseRequest.interceptors.response.use(
  function (response) {
    return responseReturn(response)
  },
  error => {
    return Promise.reject(error);
  }
);

// 处理返回
function responseReturn(response) {
  let res = response.data;
  if (res.code == '200' || res.code == '0') {
    return res;
  } else if (res.code == '1100') {
    // Vue.$vux.toast.text('请重新登录');
    // // 用户端登录丢失
    // let appointProjectCode = window.localStorage.getItem('appointProjectCode');
    // window.sessionStorage.clear();
    //  router.replace({
    //    path: '/login/' + appointProjectCode
    //  });
    //
    //  window.sessionStorage.clear();
    //  window.localStorage.clear();
    return res;
  } else {
    Vue.$vux.toast.text(res.message);
    return res;
  }
}

//封装请求
export function sendHttp(obj) {
  let {url, method = 'get', data = null, auth = true, stringify = true} = obj;
  return new Promise((resolve, reject) => {
    if (method === 'get') {
      if (auth) {
        authRequest({
          url: url,
          method: method,
          params: data
        }).then(res => {
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      } else {
        baseRequest({
          url: url,
          method: method,
          params: data
        }).then(res => {
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      }
    } else {
      let datas = data;
      console.log(datas)
      if (stringify) {
        datas = Qs.stringify(data);
      }
      if (auth) {
        authRequest({
          url: url,
          method: method,
          data: datas,
        }).then(res => {
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      } else {
        baseRequest({
          url: url,
          method: method,
          data: datas,
        }).then(res => {
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      }
    }
  })
}



