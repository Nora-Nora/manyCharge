<template>
  <div class="endInfor">
    <div class="baseInfor">
      <ul>
        <li>
          <div class="left">开始时间</div>
          <div class="right">23:20:20</div>
        </li>
        <li>
          <div class="left">结束时间</div>
          <div class="right">01:40:12</div>
        </li>
        <li>
          <div class="left">充电时长</div>
          <div class="right">1小时20分</div>
        </li>
        <li>
          <div class="left">充电费用</div>
          <div class="right">1.0元</div>
        </li>
        <li class="backMoney">
          <div class="left">退款金额</div>
          <div class="right">2.0元</div>
        </li>
      </ul>
    </div>
    <div class="orderInfor">
      <div class="title">订单信息</div>
      <ul>
        <li>
          <div class="left">订单编号</div>
          <div class="right">1234567890-098</div>
        </li>
        <li>
          <div class="left">设备编号</div>
          <div class="right">1234567890</div>
        </li>
        <li>
          <div class="left">预计充电时长</div>
          <div class="right">1小时45分钟</div>
        </li>
        <li>
          <div class="left">订单编号</div>
          <div class="right">1234567890-098</div>
        </li>
        <li>
          <div class="left">预付金额</div>
          <div class="right">3.0元</div>
        </li>
        <li>
          <div class="left">支付方式</div>
          <div class="right">微信支付</div>
        </li>
        <li class="address">
          <div class="left">定位地址</div>
          <div class="right">南山区西丽镇民企科技园南门充电桩（1号）</div>
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

      }
    },
    created() {
      this.$store.state.chargePercent = 100;
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
        display: flex;
        justify-content: space-between;
        padding: 0 12px;
        line-height: 50px;
        &.address{
          .right{
            line-height: 22px;
            height: 50px;
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
