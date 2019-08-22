<template>
    <div class="chargeSuggest">
      <div class="sugBox">
        <div class="title">充电须知</div>
        <p>1）支付成功后<span>5分钟内（不含5分钟），取消订单，将退还全款，5分钟以上（包含5分钟</span> ，取消订单，扣除已预充电时长费用后，退还剩余费用。</p>
        <p>2）费用说明：充电费用=预充电时长*<span>0.8元/小时</span></p>
        <p>3）支付方式：微信支付与支付宝支付。</p>
      </div>
    </div>
</template>

<script>
    export default {
        name: "chargeSuggest"
    }
</script>

<style scoped lang="less">
  @import "~@/assets/style/common.less";
  .chargeSuggest{
    font-size: 12px;
    background: #fff;
    padding: 12px 6px;
    margin-top: 20px;
    .sugBox{
      padding-bottom: 5px;
      .title{
        color: #FF0000;
        padding-bottom: 5px;
      }
      p{
        line-height: 17px;
        padding-top: 17px;
        span{
          color: @themeColor;
        }
      }
    }
  }
</style>






