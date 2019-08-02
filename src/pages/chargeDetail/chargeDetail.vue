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
  import {sendHttp} from "../../assets/js/request";

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
          //充电是否结束
          isEnd: false,
          //充电百分数
          percent: 0
        }
      }
    },
    created() {
      //获取订单信息
      this.orderInfor = JSON.parse(window.sessionStorage.getItem('orderData'));
      //获取预计时长
      this.getUseTime();
      this.getChargeTime();
    },
    mounted() {
      if (this.orderMsg.isEnd == true) {
        this.timer = null;
      } else {
        this.timer = setInterval(this.getChargeTime, 1000 * 30);
      }
    },
    updated() {
      this.getPercent();
      //订单退款
      this.orderBackMoney();
      //销毁定时器
      if (this.orderMsg.isEnd == true) {
        clearTimeout(this.timer);
      }
    },
    methods: {
      //关闭弹出框
      hidePop() {
        this.$store.state.cancelChargePop = false;
      },
      //获取已充电时长
      getChargeTime() {
        //获取创建时间
        let createTime = this.orderInfor.createTime;
        let timeArr = (createTime || '').split(" ");
        this.orderMsg.startTime = timeArr.pop();
        //创建时间戳
        if (createTime) {
          let StartTime = new Date(createTime);
          let beforeTime = Date.parse(StartTime);
          //获取当前时间
          let timestamp = Date.parse(new Date());
          //时间差（min）
          let time = Math.round(parseInt((timestamp - beforeTime) / (1000 * 60)));
          //console.log(time);
          let hour = Math.floor(time / 60);
          //获取分钟数
          let minute = time % 60;

          //获取充值具体时间（X小时X分钟）
          if(hour==0 && minute==0){
            var chargeTime = `${hour}小时1分`;
          }else{
            var chargeTime = `${hour}小时${minute}分`;
          }
          this.orderMsg.chargeTime = chargeTime;

          //获取已充电的总分钟数
          this.orderMsg.chargeMin = hour*60 + minute;
          if(this.orderMsg.chargeMin<1){
            this.orderMsg.chargeMin = 1;
          }

          //预计时间和已充电时间相同时，自动结束订单
          if (this.orderMsg.chargeMin>=this.orderInfor.orderTime) {
            this.chargeEnd();
          }else{
            this.getPercent();
          }

        }

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
        //充满充电百分比
        if (this.orderInfor.payType) {
          //支付宝支付的订单
          console.log('结束支付宝订单');
        } else {
          //关闭微信支付的订单
          //获取订单编号
          let orderData = JSON.parse(window.sessionStorage.getItem('orderData'));
          let orderNum = orderData.orderNum;
          //获取内存中用户token
          let userData = JSON.parse(window.sessionStorage.getItem('userData'));
          let token = userData.authToken;
          sendHttp({
            url: this.baseUrl + '/order/closeOrderByWechat', method: 'post', data: {
              orderNum: orderNum,
              token: token
            }
          }).then(res => {
            console.log(res.code);
            if (res.code == '200') {
              this.$store.state.cancelChargePop = false;
              this.orderMsg.percent = 100;
              this.orderMsg.isEnd = true;
              this.$vux.toast.text('充电结束');
              this.$router.replace({path: '/chargeDetail/end'});
              let orderData = JSON.parse(window.sessionStorage.getItem('orderData'));
              orderData = {};
              window.sessionStorage.setItem('orderData',JSON.stringify(orderData));
              let userData = JSON.parse(window.sessionStorage.getItem('userData'));
              window.sessionStorage.setItem('userData',JSON.stringify(userData));
            }
          }).catch(error => {
            console.log(error);
          });
        }
        this.orderMsg.isEnd = true;
      },
      //充电百分数
      getPercent() {
        if (this.orderInfor.orderTime) {
          let percent = (this.orderMsg.chargeMin / this.orderInfor.orderTime) * 100;
          this.orderMsg.percent = percent;
        } else {
          this.orderMsg.percent = 100;
        }
      },
      //订单退款
      orderBackMoney() {
        if (this.orderMsg.isEnd == true) {
          let orderNum = window.sessionStorage.getItem('orderNum');
          let money = this.orderInfor.money;
          let token = window.sessionStorage.getItem('Authorization');
          sendHttp({
            url: this.baseUrl + '/order/refundOrderByWechat', method: 'post', data: {
              orderNum: orderNum,
              money: money,
              token: token
            }
          }).then(res => {
            console.log(res);
          }).catch(error => {
            console.log(error);
          });
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
