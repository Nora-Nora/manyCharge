<template>
  <div class="payWait">
    <top-back>
      充电详情
      <div class="cancelOrder" @click="cancelOrder">取消订单</div>
    </top-back>
    <div class="detailInfor">
      <div class="detailHead">
        <p class="pageTitle">待支付，剩余支付时间{{ waitTime }}</p>
        <div class="waitImg"><img src="" alt=""></div>
        <p class="waitText">充电（{{ orderData.chargingAddr-1 }}号）等待支付</p>
        <div class="refresh" @click="refresh"></div>
      </div>
      <div class="inforBox">
        <ul>
          <li><span class="left">预计充电时长</span><span class="right">{{ getChargeTime() }}</span></li>
          <li><span class="left">设备编号</span><span class="right">{{ orderData.deviceNum }}</span></li>
          <li><span class="left">订单编号</span><span class="right">{{ orderData.orderNum }}</span></li>
          <li><span class="left">预付金额</span><span class="right">{{ orderData.money }}元</span></li>
          <li><span class="left">定位地址</span><span class="right">{{ orderData.orderLocation }}充电桩（{{ Number(orderData.chargingAddr)-1 }}号）</span>
          </li>
        </ul>
      </div>
      <btn>
        <div @click="showPayPop">立即支付</div>
      </btn>
      <div class="tips">5分钟内（不含5分钟）未充电成功，可退还全款</div>
    </div>
    <div class="payWay" v-show="payWayPop">
      <div class="payWayBox">
        <div class="title">
          支付中心
          <span class="cancel" @click="hidePayPop">取消</span>
        </div>
        <ul>
          <li class="zhifubao">
            <div class="left"><i></i>支付宝支付</div>
            <div class="right"><i></i></div>
          </li>
          <li class="wechat" @click="wxPay">
            <div class="left"><i></i>微信支付</div>
            <div class="right"><i></i></div>
          </li>
        </ul>
      </div>

    </div>
  </div>

</template>

<script>
    import topBack from '@/components/topBack'
    import btn from '@/components/btn'

    export default {
        name: "detailInfor",
        // 注入reload, AppVue中注册
        inject: ['reload'],
        data() {
            return {
                orderData: {},
                waitTime: '',
                waitTimeOut: '',
                //查单时间
                checkTime: 10,
                checkTimeOut: '',
                payWayPop: false
            }
        },
        components: {
            topBack,
            btn
        },
        created() {
            //获取当前订单数据
            let orderData = JSON.parse(window.sessionStorage.getItem('orderData'));
            if (orderData) {
                this.orderData = orderData;
            } else {
                this.$router.push({path: '/'});
            }

            //未完成订单倒计时等待
            this.waitTimeOut = setInterval(this.getWaitTime, 1000);

            //判断用户是否支付成功
            let params = this.$route.params.from;
            if (params == 'wechat') {
                this.checkTimeOut = setInterval(this.isPayFinish, 1000);
            }
        },
        destroyed() {
            clearInterval(this.waitTimeOut);
            clearInterval(this.checkTimeOut);
        },
        methods: {
            refresh() {
                //刷新页面
                this.reload();
            },
            //取消订单
            cancelOrder(){

              let orderNum = this.orderData.orderNum;
              let money = this.orderData.money;
                this.sendHttp({
                    url: this.baseUrl + '/order/refundOrderByWechat',
                    method: 'post',
                    data: {orderNum: orderNum,money:money}
                }).then(res=>{
                    if(res.data.code=='200'){
                        this.$vux.toast.text('订单取消成功');
                        this.$router.push({path:'/'});
                    }
                })
            },
            //支付选择显示
            showPayPop() {
                this.payWayPop = true;
            },
            hidePayPop() {
                this.payWayPop = false;
            },
            //立即支付
            wxPay() {
                let backUrl = encodeURIComponent('/payWait/wechat');
                window.location.href = this.orderData.webUrl + '&redirect_url=' + this.hostName + backUrl;
            },
            //用户是否已完成支付
            isPayFinish() {
                if (this.checkTime > 0) {
                    this.checkTime--;
                    //console.log(this.checkTime);
                } else {
                    this.checkTime = 0;
                    this.$vux.toast.text('支付超时，请重新支付');
                    clearInterval(this.checkTimeOut);
                }
                //判断用户该订单是否已支付完成
                let userData = JSON.parse(window.localStorage.getItem('userData'));
                if (userData.userId) {
                    this.sendHttp({
                        url: this.baseUrl + '/order/getUnfinishedOrder',
                        method: 'get',
                        data: {id: userData.userId}
                    }).then(res => {
                        //console.log(res);
                        if (res.data.haveOrder) {
                            if (res.data.orderInfo.type == 0) {
                                //console.log('未付款');
                            } else {
                                this.$router.push({path: '/paySuc'});
                            }
                        } else {
                            this.$router.push({path: '/'});
                        }
                    });
                }
            },
            getWaitTime() {
                //订单开始时间
                let createTime = this.orderData.createTime;
                let StartTime = new Date(createTime.replace(/-/g, '/'));
                let beforeTime = Date.parse(StartTime);
                //获取当前时间
                let timestamp = Date.parse(new Date());
                //时间差(秒)
                let time = 5 * 60 - parseInt((timestamp - beforeTime) / 1000);
                if (time > 0) {
                    //获取分钟
                    let minute = Math.floor(time / 60);
                    let second = time % 60;
                    this.waitTime = `${minute}分${second}秒`;
                } else {
                    clearInterval(this.waitTimeOut);
                    clearInterval(this.checkTimeOut);
                    window.sessionStorage.clear();

                    this.$router.push({path: '/'});
                }
            },
            getChargeTime() {
                let orderTime = Number(this.orderData.orderTime);
                let hour = Math.floor(orderTime / 60);
                let minute = orderTime % 60;
                return `${hour}小时${minute}分`;
            }
        }
    }
</script>

<style scoped lang="less">
  @import "~@/assets/style/common.less";

  .btn {
    margin: 10px 0;
  }

  .cancelOrder {
    font-size: 15px;
    position: absolute;
    right: 10px;
    top: 10px;
    padding: 8px;

  }

  .payWait {
    .payWay {
      position: absolute;
      background: rgba(0, 0, 0, 0.4);
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      .payWayBox {
        width: 100%;
        background: #fff;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1000;

        .title {
          text-align: center;
          font-size: 17px;
          line-height: 60px;
          position: relative;

          .cancel {
            color: #8D95A6;
            font-size: 15px;
            position: absolute;
            left: 0px;
            top: 0px;
            padding: 0 15px;
          }
        }

      }

      ul li {
        height: 70px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 15px;
        line-height: 70px;

        .left {
          display: flex;
          align-items: center;

          i {
            display: inline-block;
            width: 30px;
            height: 30px;
            margin: 0 15px;
          }
        }

        .right {
          display: flex;
          align-items: center;

          i {
            display: inline-block;
            width: 20px;
            height: 20px;
            background: url("~imgUrl/chargeDetail/arrowRight.png");
            background-size: cover;
            margin-right: 15px;
          }

        }

        &.zhifubao {
          border-bottom: 1px solid #f1f1f1;

          .left {
            i {
              background: url("~imgUrl/home/zhifubao.png");
              background-size: cover;
            }
          }
        }

        &.wechat {
          .left {
            i {
              background: url("~imgUrl/home/wechat.png");
              background-size: cover;
            }
          }
        }
      }
    }

    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #F8F9FA;

    .detailHead {
      position: relative;

      .pageTitle {
        font-size: 14px;
        padding: 10px;
      }

      .waitText {
        position: absolute;
        bottom: 20px;
        left: 0;
        text-align: center;
        font-size: 16px;
        width: 100%;
      }

      .refresh {
        width: 20px;
        height: 18px;
        background: url("~imgUrl/home/refresh2.png");
        background-size: cover;
        position: absolute;
        top: 24px;
        right: 24px;
      }

      width: 375px;
      height: 214px;
      background: url("~imgUrl/chargeDetail/detailBg.png");
      background-size: cover;
      color: #fff;
    }

    .detailInfor {
      .tips {
        color: #8D95A6;
        font-size: 13px;
        margin: 6px 12px;
      }

      .inforBox {
        width: 351px;
        margin: 0 auto;
        background: #fff;
        padding: 12px;
        border-radius: 4px;

        ul {
          padding-top: 4px;

          li {
            display: flex;
            justify-content: space-between;
            height: 50px;
            line-height: 22px;

            .left {
              width: 50%;
              font-size: 15px;
            }

            .right {
              width: 50%;
              font-size: 16px;
              color: #8D95A6;
              text-align: right;
            }
          }
        }
      }
    }
  }

</style>
