<template>
  <div class="chargeDetails">
    <top-back>充电详情</top-back>
    <detail-head :orderInfor="orderInfor" :orderMsg="orderMsg"/>
    <!--充电详情信息-->
    <router-view :orderInfor="orderInfor" :orderMsg="orderMsg"/>
    <pop-box v-slot:tipContent v-show="this.$store.state.cancelChargePop">
      <div class="tipContent">
        <div class="text">确认取消充电？</div>
        <ul>
          <li class="cancel" @click="hidePop">返回</li>
          <li class="sure" @click="chargeEnd">确认</li>
        </ul>
      </div>
    </pop-box>
  </div>
</template>

<script>
    import topBack from '@/components/topBack'
    import detailHead from './components/detailHead'
    import detailInfor from './components/detailInfor'
    import popBox from '@/components/popBox'

    export default {
        name: "chargeDetail",
        components: {
            detailHead,
            detailInfor,
            topBack,
            popBox
        },
        data() {
            return {
                //定时器
                timer: null,
                isPop: this.$store.state.cancelChargePop,
                orderInfor: {},
                orderMsg: {
                    //开始时间 时分秒
                    startTime: '',
                    //预计充电时长 string X小时X分钟
                    useTime: '',
                    //充电时长 string X小时X分钟
                    chargeTime: '',
                    //已充电分钟数
                    chargeMin: 0,
                    //充电百分数
                    percent: 0
                }
            }
        },
        created() {
            this.upDateData();
            //获取预计时长
            this.getUseTime();
            //获取开始时间
            this.getStartTime();

        },
        mounted() {
            this.upDateData();
            //销毁定时器
            if (this.orderInfor.isEnd || this.ChargeFinish() === false) {
                clearTimeout(this.timer);

            } else {
                this.timer = setInterval(this.getChargeTime, 1000);
                //获取已充电时长
                this.getChargeTime();
            }
        },
        destroyed() {
            //销毁定时器
            if (this.orderInfor.isEnd || this.ChargeFinish() == false) {
                clearTimeout(this.timer);
            }
        }
        ,
        methods: {
            //更新数据
            upDateData() {
                //获取订单信息
                let orderData = JSON.parse(window.sessionStorage.getItem('orderData'));
                if (orderData) {
                    orderData.chargingAddr = orderData.chargingAddr;
                    this.orderInfor = orderData;
                } else {
                    this.$router.push({path: '/'});
                }

                //若充电结束，直接到结束页
                if (orderData && orderData.isEnd) {
                    this.orderMsg.percent = 100;
                    this.$router.push({path: '/chargeDetail/end'});
                }
            },
            //获取时间差（min）
            getTime(s1, s2) {
                s1 = new Date(s1.replace(/-/g, '/'));
                s2 = new Date(s2.replace(/-/g, '/'));
                let ms = Math.abs(s1.getTime() - s2.getTime());
                return ms / 1000 / 60;
            },
            //关闭弹出框
            hidePop() {
                this.$store.state.cancelChargePop = false;
            },
            getStartTime() {
                //获取开始时间
                let createTime = this.orderInfor.createTime;
                let timeArr = (createTime || '').split(" ");
                this.orderMsg.startTime = timeArr.pop();
            },
            //获取已充电时长
            getChargeTime() {
                if (this.orderInfor.isEnd) {

                } else {
                    this.getStartTime();
                    //创建时间戳
                    let createTime = this.orderInfor.createTime;
                    if (createTime) {
                        let StartTime = new Date(createTime.replace(/-/g, '/'));
                        //console.log(StartTime);
                        let beforeTime = Date.parse(StartTime);
                        //获取当前时间
                        let timestamp = Date.parse(new Date());
                        //时间差（min）
                        let time = Math.round(parseInt((timestamp - beforeTime) / (1000 * 60)));
                        let hour = Math.floor(time / 60);
                        //获取分钟数
                        let minute = time % 60;
                        //获取充值具体时间（X小时X分钟）
                        if (hour === 0 && minute === 0) {
                            this.orderMsg.chargeTime = '0小时1分';
                        } else {
                            this.orderMsg.chargeTime = `${hour}小时${minute}分`;
                        }
                        this.orderInfor.chargeTime = String(this.orderMsg.chargeTime);
                        //console.log(chargeTime);
                        let orderData = JSON.parse(window.sessionStorage.getItem('orderData'));
                        if (orderData && orderData.chargeTime) {
                            orderData.chargeTime = this.orderInfor.chargeTime;
                        }
                        window.sessionStorage.setItem('orderData', JSON.stringify(orderData));
                        //获取已充电的总分钟数
                        this.orderMsg.chargeMin = hour * 60 + minute;
                        if (this.orderMsg.chargeMin < 1) {
                            this.orderMsg.chargeMin = 1;
                        }
                    }
                    //获取订单进度百分数
                    this.getPercent();
                    //判断订单是否已到结束时间
                    this.ChargeFinish();
                }
            },
            //获取订单是否已完成充电
            ChargeFinish() {
                //获取订单信息
                let orderData = JSON.parse(window.sessionStorage.getItem('orderData'));
                //创建时间转时间戳
                let createTime = Date.parse(orderData.createTime);
                //结束时间戳
                let endTimes = Number(createTime) + orderData.orderTime * 60 * 1000;
                //获取当前时间戳
                var timestamp = Date.parse(new Date());
                //当前时间大于或者等于结束时间时，订单结束
                if(timestamp>=endTimes){
                    let dates = new Date();
                    let hour = dates.getHours();
                    let minutes = dates.getMinutes();
                    let second = dates.getSeconds();
                    //获取当前订单信息
                    let orderData = JSON.parse(window.sessionStorage.getItem('orderData'));
                    if (!orderData.endTime) {
                        let endTime = `${hour < 10 ? '0' + String(hour) : hour}:${minutes < 10 ? '0' + String(minutes) : minutes}:${second < 10 ? '0' + String(second) : second}`;
                        orderData.endTime = endTime;
                    }
                    //充电时间
                    let chargeHour = Math.floor(Number(orderData.orderTime) / 60);
                    let chargeMin = Number(orderData.orderTime) % 60;
                    orderData.chargeTime = `${chargeHour}小时${chargeMin}分`;
                    //userMoney 充电费用，单位：分
                    orderData.useMoney = Number(this.orderInfor.money) * 100;
                    orderData.backMoney = 0;
                    this.orderInfor = orderData;
                    window.sessionStorage.setItem('orderData', JSON.stringify(orderData));
                    this.endInfor();
                    return false
                }

                //let userData = JSON.parse(window.localStorage.getItem('userData'));
                // if (userData && userData.userId) {
                //     this.sendHttp({
                //         url: this.baseUrl + '/order/getUnfinishedOrder', method: 'get', data: {
                //             id: userData.userId
                //         }
                //     }).then(res => {
                //         if (res.data.haveOrder) {
                //             return true
                //         } else {
                //             //获取结束时间
                //             let dates = new Date();
                //             let hour = dates.getHours();
                //             let minutes = dates.getMinutes();
                //             let second = dates.getSeconds();
                //             let orderData = JSON.parse(window.sessionStorage.getItem('orderData'));
                //             if (!orderData.endTime) {
                //                 let endTime = `${hour<10?'0'+String(hour):hour}:${minutes<10?'0'+String(minutes):minutes}:${second<10?'0'+String(second):second}`;
                //                 orderData.endTime = endTime;
                //             }
                //             //充电时间
                //             let chargeHour = Math.floor(Number(orderData.orderTime) / 60);
                //             let chargeMin = Number(orderData.orderTime) % 60;
                //             orderData.chargeTime = `${chargeHour}小时${chargeMin}分`;
                //             //userMoney 充电费用，单位：分
                //             orderData.useMoney = Number(this.orderInfor.money) * 100;
                //             orderData.backMoney = 0;
                //             this.orderInfor = orderData;
                //             window.sessionStorage.setItem('orderData', JSON.stringify(orderData));
                //             this.endInfor();
                //             return false
                //         }
                //     });
                // }
            },
            //订单结束
            endInfor() {
                this.orderMsg.percent = 100;
                let orderData = JSON.parse(window.sessionStorage.getItem('orderData'));
                orderData.isEnd = true;
                window.sessionStorage.setItem('orderData', JSON.stringify(orderData));
                this.$vux.toast.text('充电结束');
                this.$router.replace({path: '/chargeDetail/end'});
            },
            //获取预计充电时长
            getUseTime() {
                let moneyNum = this.orderInfor.money;
                //计算充电时长
                let time = moneyNum / 0.8;
                //向上取整获取小时数
                let hour = Math.floor(time);
                //获取分钟数
                let minute = Math.round((time - hour) * 60);
                this.orderMsg.useTime = `${hour}小时${minute}分`;
            },
            //结束充电
            chargeEnd() {
                //获取结束时间
                let date = new Date();
                let hour = date.getHours();
                let minutes = date.getMinutes();
                let second = date.getSeconds();
                let endTime = `${hour < 10 ? '0' + String(hour) : hour}:${minutes < 10 ? '0' + String(minutes) : minutes}:${second < 10 ? '0' + String(second) : second}`;
                this.orderInfor.endTime = endTime;
                this.orderInfor.isEnd = true;
                window.sessionStorage.setItem('orderData', JSON.stringify(this.orderInfor));
                //支付方式
                if (this.orderInfor.payType) {
                    //结束支付宝支付的订单
                    console.log('结束支付宝订单');
                } else {
                    //关闭微信支付的订单
                    this.$store.state.cancelChargePop = false;
                    //获取订单编号
                    let orderData = JSON.parse(window.sessionStorage.getItem('orderData'));
                    let orderNum = orderData.orderNum;
                    let money = Number(orderData.money) * 100;
                    //发起请求
                    this.sendHttp({
                        url: this.baseUrl + '/order/refundOrderByWechat', method: 'post', data: {
                            orderNum: orderNum,
                            money: money
                        }
                    }).then(res => {
                        //console.log(res);
                        if (res.code == '200') {
                            //订单结束成功
                            this.orderInfor.isEnd = true;
                            //订单话费金额  总金额减去退款金额
                            this.orderInfor.useMoney = res.data.cash_fee - res.data.refund_fee;
                            this.orderInfor.backMoney = res.data.refund_fee;
                            window.sessionStorage.setItem('orderData', JSON.stringify(this.orderInfor));
                            this.endInfor();
                            this.$router.push('/chargeDetail/end');
                        }
                    });
                }

            },
            //充电百分数
            getPercent() {
                if (this.orderInfor.orderTime) {
                    let percent = (this.orderMsg.chargeMin / this.orderInfor.orderTime) * 100;
                    this.orderMsg.percent = percent;
                }
            }
        }
    }
</script>

<style scoped lang="less">
  @import "~@/assets/style/common.less";

  .chargeDetails {
    background: #F8F9FA;
    padding-bottom: 108px;

    .tipContent {
      font-size: 16px;
      text-align: center;

      .text {
        padding-top: 50px;
        padding-bottom: 48px;
      }

      ul {
        margin: 0 24px;
        height: 48px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;

        li {
          width: 128px;
          line-height: 48px;
          border-radius: 4px;

          &.cancel {
            border: 1px solid @themeColor;
            color: @themeColor;
          }

          &.sure {
            background: @themeColor;
            color: #fff;
          }

          /*a{*/
          /*  display: inline-block;*/
          /*  width: 100%;*/
          /*  height: 100%;*/
          /*  color: #fff;*/
          /*}*/
        }
      }
    }
  }
</style>
