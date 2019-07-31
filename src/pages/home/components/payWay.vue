<template>
  <div class="payWay">
    <div class="title">支付方式</div>
    <div class="selectBox">
      <div class="wechat">
        <div class="left"><i></i>微信支付</div>
        <div :class="['right',{ selected: payType===0 }]" @click="paySelect(0)"></div>
      </div>
      <div class="zhifubao">
        <div class="left"><i></i>支付宝支付</div>
        <div :class="['right',{ selected: payType===1 }]" @click="paySelect(1)"></div>
      </div>
    </div>
    <btn>
      <div @click="isPay">确认支付</div>
    </btn>
    <remote-js src="http://pv.sohu.com/cityjson?ie=utf-8"></remote-js>
  </div>
</template>

<script>
  import btn from '@/components/btn'

  export default {
    name: "payWay",
    data() {
      return {
        payType: 0,
        userIp: '',
        orderNum: '',
        isWeixin:false
      }
    },
    mounted() {
    },
    created() {
      //判断是否支付成功
      // if (this.orderNum) {
      //   sendHttp({
      //     url: baseUrl + '/order/getOrderByWechat',
      //     method: 'get',
      //     data: {orderNum: this.orderNum}
      //   }).then(res => {
      //     if (res.code == '200') {
      //       //支付成功，开启充电口
      //       let id = this.$store.state.chargingId;
      //       let orderNum = this.orderNum;
      //       sendHttp({
      //         url: baseUrl + '/device/openDevice', method: 'post', data: {
      //           id: id,
      //           orderNum: orderNum
      //         }
      //       }).then(res=>{
      //         if(res.code=='200'){
      //           this.$router.push({path: '/paySuc'});
      //         }
      //       }).catch(error=>{
      //         console.log(error);
      //       });
      //
      //
      //     }
      //   }).catch(error => {
      //     console.log(error);
      //   });
      // }

    },
    components: {
      btn,
      //获取用户ip
      'remote-js': {
        render(createElement) {
          return createElement('script', {attrs: {type: 'text/javascript', src: this.src}});
        },
        props: {
          src: {type: String, required: true},
        },
      }
    },
    props: ['equipmentInfor'],
    methods: {
      paySelect(num) {
        this.payType = num;
        this.$store.state.payType = num;
      },
      //点击支付
      isPay() {
        if (this.isUse()) {
          let phoneNum = window.localStorage.getItem('phoneNum');
          let token = window.sessionStorage.getItem('Authorization');
          //获取用户ip
          let ip = returnCitySN["cip"];
          this.userIp = ip;
          if (ip && this.$store.state.deviceSN) {
            //console.log(this.userIp);

            //微信支付
            if (this.payType == 0) {
              this.$store.state.payType = this.payType;
              //传入的money，单位为分
              let money = this.$store.state.chargeMoney*100;
              let moneyFen = Number(money.toFixed(1));
              //预估时间
              let time = Math.round(this.$store.state.useTime);
              //新建微信订单
              this.sendHttp({
                url: this.baseUrl + '/order/newOrderByWechat', method: 'post', data: {
                  userIp: this.userIp,
                  deviceSN: this.$store.state.deviceSN,
                  chargingId: this.$store.state.chargingId,
                  money: moneyFen,
                  useTime: time,
                  payType: this.payType,
                  phone: phoneNum,
                  token: token
                }
              }).then(res => {
                console.log(res);
                if(res.code=='200'){
                  this.orderNum = res.data.orderNum;
                  window.sessionStorage.setItem('orderNum',res.data.orderNum);
                  let data = res.data;
                  let vm = this;
                  //判断打开方式
                  let ua = navigator.userAgent.toLowerCase();
                  this.isWeixin = ua.indexOf('micromessenger') != -1;
                  if(this.isWeixin){
                    //微信内置浏览器打开
                    if (typeof WeixinJSBridge === 'undefined') {
                      if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', vm.onBridgeReady(data), false);
                      } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', vm.onBridgeReady(data));
                        document.attachEvent('onWeixinJSBridgeReady', vm.onBridgeReady(data));
                      }
                    } else {
                      vm.onBridgeReady(data);
                    }
                  }else{
                    //普通浏览器打开
                    window.location.href = res.data.mweb_url;
                  }
                }else if(res.code=='1100'){
                  this.$vux.toast.text('请重新登录');
                  this.$router.replace({path:'/login'});
                }else if(res.code=='2015'){
                  this.$router.push({path:'/chargeDetail/infor'});
                }
              }).catch(error => {
                console.log(error);
              });
            } else if (this.payType == 1) {
              this.$store.state.payType = this.payType;
              //新建支付宝订单
              console.log('新建支付宝订单');
            }
          }
        }
      },
      //判断当前选择设备是否可用
      isUse() {
        if (this.$store.state.chargeMoney > 0) {
          if (this.$store.state.chargingId > 0) {
            let listInfor = this.equipmentInfor.chargingVOList;
            for (var i = 0; i < listInfor.length; i++) {
              if (listInfor[i].id == this.$store.state.chargingId) {
                if (listInfor[i].deviceStatus == -1) {
                  this.$store.state.chargeBreakPop = true;
                  return false
                } else if (listInfor[i].deviceStatus == 1) {
                  this.$vux.toast.text('充电桩正在充电！');
                  return false
                } else {
                  return true
                }
              }
            }
          } else {
            this.$vux.toast.text('请选择充电桩！');
            return false
          }
        } else {
          this.$vux.toast.text('请选择充值金额！');
          return false
        }

      },
      //微信支付内置对象
      onBridgeReady (data) {
        let self = this;
        let pkg = 'prepay_id='+data.prepay_id;
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            'appId': data.appId,//公众号名称，由商户传入
            'timeStamp': 0, //时间戳，自1970年以来的秒数。这里必须要转换为字符串。ios跟android表现不同。后台返回的是数值，但是微信方面必须要json参数都是字符串形式，android会自动转换成字符串（当时我在这里也找了很久的博文才知道的）
            'nonceStr': data.nonce_str,//随机串
            'package': pkg, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            'signType': data.trade_type,//微信签名方式：
            'paySign': data.sign//微信签名
          },
          function (res) {
            if (res.err_msg === 'get_brand_wcpay_request:ok') {//支付成功
              //self.$vux.toast.text('支付成功!');
              self.$router.replace({name: 'paySuc'});
            } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
              self.$vux.toast.text('支付取消!');
            } else {
              self.$vux.toast.text('支付失败!');
            }
          }
        )
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/style/common.less";

  .payWay {
    .title {
      color: #8D95A6;
      font-size: 16px;
      line-height: 40px;
      padding-left: 12px;
    }

    .selectBox {
      font-size: 15px;
      background: #fff;
      margin-bottom: 33px;

      .wechat {
        display: flex;
        justify-content: space-between;
        line-height: 51px;
        font-size: 15px;
        padding: 0 24px 0 12px;
        align-items: center;

        .left {
          display: flex;
          align-items: center;

          i {
            display: inline-block;
            width: 20px;
            height: 18.4px;
            background: url("~imgUrl/home/wechat.png") no-repeat;
            background-size: cover;
            margin-right: 4px;
          }
        }

        .right {
          width: 18px;
          height: 18px;
          background: url("~imgUrl/home/noSelected.png");
          background-size: cover;

          &.selected {
            background: url("~imgUrl/home/selected.png");
            background-size: cover;
          }
        }
      }

      .zhifubao {
        .wechat();

        .left {
          i {
            background: url("~imgUrl/home/zhifubao.png") no-repeat;
            background-size: cover;
          }
        }
      }
    }
  }
</style>
