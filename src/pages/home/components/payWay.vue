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
                isWeixin: false
            }
        },
        created() {
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
        props: ['equipmentInfor', 'userData'],
        methods: {
            //获取支付方式
            paySelect(num) {
                this.payType = num;
                this.$store.state.payType = num;
            },
            //点击支付
            isPay() {
                if (this.isUse()) {
                    //获取用户ip
                    let ip = returnCitySN["cip"];
                    this.userIp = ip;
                    let userData = JSON.parse(window.localStorage.getItem('userData'));
                    if (ip && userData && userData.userId) {
                        //微信支付
                        if (this.payType == 0) {
                            //新建订单前判断是否有支付异常的订单
                            this.sendHttp({
                                url: this.baseUrl + '/order/getUnfinishedOrder', method: 'get', data: {
                                    id: userData.userId
                                }
                            }).then(res => {
                                if (res.data.haveOrder && res.code=='200') {
                                    let orderInfo = res.data.orderInfo;
                                    orderInfo.money = Number(orderInfo.money);
                                    orderInfo.isEnd = false;
                                    window.sessionStorage.setItem('orderData',JSON.stringify(orderInfo));
                                    //有未支付的订单
                                    if (orderInfo.type === 0) {
                                        this.$vux.toast.text('存在未付款的订单');
                                        let webUrl = orderInfo.webUrl;
                                        let hostName = this.hostName;
                                        let url = hostName + '/#/paySuc';
                                        let newUrl = encodeURIComponent(url);
                                        setTimeout(function () {
                                            window.location.href = webUrl + '&redirect_url=' + newUrl;
                                        }, 1000);
                                    } else {
                                        if (orderInfo.type === 4) {
                                            //充电桩正在使用，还未结束订单
                                            this.$vux.toast.text('存在未结束订单');
                                        } else if (orderInfo.type === 6) {
                                            //设备异常
                                            this.$vux.toast.text('设备异常，请及时取消订单');
                                        }
                                        window.sessionStorage.setItem('orderData', JSON.stringify(orderInfo));
                                        this.$router.push({path: '/chargeDetail/infor'});
                                        //console.log(orderInfo.type);
                                    }
                                } else {
                                    //新建订单所需参数
                                    this.$store.state.payType = this.payType;
                                    //传入的money，单位为分
                                    let money = this.$store.state.chargeMoney * 100;
                                    let moneyFen = Number(money.toFixed(1));
                                    //预估时间 单位：分
                                    let time = Math.round(this.$store.state.useTime);
                                    //充电桩口
                                    let chargingId = this.$store.state.chargingId;

                                    //微信支付，没有未完成的订单，开始新建订单，先判断微信支付的打开方式
                                    let vm = this;
                                    let ua = navigator.userAgent.toLowerCase();
                                    this.isWeixin = ua.indexOf('micromessenger') != -1;
                                    if (this.isWeixin) {
                                        //微信内置浏览器打开,需获取微信公众号支付接口，获取所需data
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
                                    } else {
                                        //普通浏览器调取微信h5支付方式
                                        this.sendHttp({
                                            url: this.baseUrl + '/order/newOrderByWechat', method: 'post', data: {
                                                userIp: ip,
                                                deviceSN: this.userData.deviceSN,
                                                chargingId: chargingId,
                                                money: moneyFen,
                                                useTime: time,
                                                payType: this.payType,
                                                phone: this.userData.phone
                                            }
                                        }).then(res => {
                                            if (res.code == '200') {
                                                //console.log(res);
                                                //微信返回参数
                                                let data = res.data.wechatOrderInfo;
                                                this.orderNum = data.orderNum;
                                                //创建orderData存储
                                                let orderData = {};
                                                orderData.createTime = res.data.createTime; //创建时间
                                                orderData.deviceNum = this.equipmentInfor.deviceNum; //设备编号
                                                orderData.money = Number(moneyFen)/100;  //订单金额 单位：元
                                                orderData.orderLocation = this.equipmentInfor.deviceLocation;
                                                orderData.orderNum = this.orderNum;  //订单编号
                                                orderData.orderTime = time; //预计使用时长
                                                orderData.chargingId = chargingId; //充电桩口id
                                                orderData.payType = this.payType; //支付方式
                                                orderData.isEnd = false;
                                                orderData.chargingAddr = this.$store.state.chargingNum;
                                                window.sessionStorage.setItem('orderData', JSON.stringify(orderData));
                                                //微信支付成功的回调地址
                                                let redirect_url = this.hostName + "/#/paySuc";
                                                let url = encodeURIComponent(redirect_url);
                                                //普通浏览器打开
                                                window.location.href = data.mweb_url + "&redirect_url=" + url;
                                            }
                                        });
                                    }
                                }
                            });
                        } else if (this.payType == 1) {
                            //新建支付宝订单
                            this.$store.state.payType = this.payType;
                            console.log('新建支付宝订单');
                        }
                    } else {
                        this.$vux.toast.text('请重新登录');
                        this.$router.replace({path: '/login'});
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
                                    this.$vux.toast.text('充电口充电中...');
                                    return false
                                } else {
                                    return true
                                }
                            }
                        }
                    } else {
                        this.$vux.toast.text('请选择充电口！');
                        return false
                    }
                } else {
                    this.$vux.toast.text('请选择充值金额！');
                    return false
                }

            },
            //微信支付内置对象
            onBridgeReady(data) {
                let self = this;
                let pkg = 'prepay_id=' + data.prepay_id;
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest', {
                        'appId': data.appId, //公众号名称，由商户传入
                        'timeStamp': 0, //时间戳，自1970年以来的秒数。这里必须要转换为字符串。ios跟android表现不同。后台返回的是数值，但是微信方面必须要json参数都是字符串形式，android会自动转换成字符串（当时我在这里也找了很久的博文才知道的）
                        'nonceStr': data.nonce_str,//随机串
                        'package': pkg, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                        'signType': data.trade_type, //微信签名方式：
                        'paySign': data.sign //微信签名
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
            height: 20px;
            background: url("~imgUrl/home/wechat.png") no-repeat;
            background-size: 100%;
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
            background-size: 100%;
          }
        }
      }
    }
  }
</style>
