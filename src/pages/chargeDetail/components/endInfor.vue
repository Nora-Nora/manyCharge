<template>
  <div class="endInfor">
    <div class="baseInfor">
      <ul>
        <li>
          <div class="left">开始时间</div>
          <div class="right">{{ orderMsg.startTime }}</div>
        </li>
        <li>
          <div class="left">结束时间</div>
          <div class="right">{{ orderInfor.endTime }}</div>
        </li>
        <li>
          <div class="left">充电时长</div>
          <div class="right">{{ orderMsg.chargeTime }}</div>
        </li>
        <li>
          <div class="left">充电费用</div>
          <div class="right">{{ orderInfor.useMoney }}元</div>
        </li>
        <li class="backMoney">
          <div class="left">退款金额</div>
          <div class="right">{{ orderInfor.backMoney }}元</div>
        </li>
      </ul>
    </div>
    <div class="orderInfor">
      <div class="title">订单信息</div>
      <ul>
        <li>
          <div class="left">订单编号</div>
          <div class="right orderNum">{{ orderInfor.orderNum }}</div>
        </li>
        <li>
          <div class="left">设备编号</div>
          <div class="right">{{ orderInfor.deviceNum }}</div>
        </li>
        <li>
          <div class="left">预计充电时长</div>
          <div class="right">{{ orderMsg.useTime }}</div>
        </li>
        <li>
          <div class="left">预付金额</div>
          <div class="right">{{ orderInfor.money }}元</div>
        </li>
        <li>
          <div class="left">支付方式</div>
          <div class="right">{{ orderInfor.payType==1?'支付宝':'微信' }}支付</div>
        </li>
        <li>
          <div class="left">定位地址</div>
          <div class="right address">{{ orderInfor.orderLocation }}充电桩（{{ orderInfor.chargingId }}号）</div>
        </li>
      </ul>
    </div>
    <btn><router-link to="/">好的</router-link></btn>
  </div>
</template>

<script>
  import btn from '@/components/btn'
  export default {
    name: "endInfor",
    components:{
      btn
    },
    data(){
      return{
        chargeTime : ''
      }
    },
    props:['orderInfor','orderMsg'],
    created() {
      //console.log(this.orderInfor);
      this.$store.state.chargePercent = 100;
      this.getTime();
    },
    methods:{
      getTime(){
        let moneyNum = this.orderInfor.money;
        //计算充电时长
        let time = moneyNum/0.8;
        //向上取整获取小时数
        let hour = Math.floor(time);
        //获取分钟数
        let minute = Math.round((time-hour)*60);
        this.useTime = `${hour}小时${minute}分钟`;
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/style/common.less";
.endInfor{
  margin: 20px 0 60px 0;
  .baseInfor{
    ul{
      width: 351px;
      margin: 0 auto;
      background: #fff;
      border-radius: 4px;
      li{
        margin: 0 12px;
        display: flex;
        justify-content: space-between;
        padding: 0 12px;
        line-height: 50px;
        //border-bottom: 0.5px solid #eee;
        .right{
          line-height: 50px;
          height: 50px;
          &.address{
            line-height: 26px;
          }
        }

        &.backMoney{
          .right{
            color: @themeColor;
          }
        }
        .left{
          width: 50%;
          font-size: 15px;
        }
        .right{
          width: 50%;
          text-align: right;
          font-size: 16px;
          color: #8D95A6;
          &.orderNum{
            line-height: 30px;
          }
        }
      }
    }
  }
  .orderInfor{
    .title{
      font-size: 16px;
      color: #8D95A6;
      padding: 10px 24px;
    }
    .baseInfor();
    ul{
      padding-bottom: 13px;
    }
    margin-bottom: 37px;

  }

}
</style>
