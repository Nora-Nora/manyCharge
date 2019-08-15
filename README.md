# manycharge

> 智能充电桩

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

#修改

###2019-8-14
1.修改登录页优化，若已获取到用户信息，直接到首页。
2.修改提交支付时，选择充电口的刷新优化
3.修改支付，新建微信订单，修改判断当前浏览器是微信内置浏览器还是普通浏览器
4.修改充电详情，右上角刷新后，已充电时长数据为空，已修复
5.退款接口修改
6.修改ios浏览器上Date函数不兼容处理

***

###2019/8/15
1.修复登录页提示订单未支付，支付完成后跳转到支付成功，页面空白（没有存储用户信息）。
2.支付成功页面，修改布局（按钮处于当前视窗底部）。
3.多方登录导致用户token过期，清理本地存储，提示用户重新登录。
4.获取已充电时间，定时器修改为一秒执行一次。
5.修改充电时间已自动结束（非提前取消），右上角刷新，充电时间还在继续增加。
6.首页订单有未支付订单，支付成功后，本地存储新订单覆盖前面的旧订单，页面显示最新订单数据。
 
***

