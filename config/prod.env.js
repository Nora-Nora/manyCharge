'use strict'

const target = process.env.npm_lifecycle_event;
let obj;

if (target == 'test') {
  //测试服
  obj = {
    NODE_ENV: '"production"',
    BASE_URL: '"http://192.168.5.8:8080"'
  }
} else {
  //正式服
  obj = {
    NODE_ENV: '"production"',
    BASE_URL: '"http://api.share.duoduiduo.com"'
  }
}

module.exports = obj;

