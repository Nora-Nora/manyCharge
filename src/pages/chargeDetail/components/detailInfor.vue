<template>
    <div class="detailInfor">
      <div class="inforBox">
        <ul>
          <li><span class="left">开始时间</span><span class="right">23:20:20</span></li>
          <li><span class="left">预计充电时长</span><span class="right">1小时45分钟</span></li>
          <li><span class="left">设备编号</span><span class="right">1234567890</span></li>
          <li><span class="left">订单编号</span><span class="right">1234567890-098</span></li>
          <li><span class="left">支付方式</span><span class="right">微信支付</span></li>
          <li><span class="left">预付金额</span><span class="right">3.0元</span></li>
          <li><span class="left">定位地址</span><span class="right">南山区西丽镇民企科技园南门充电桩（1号）</span></li>
        </ul>
      </div>
      <div class="tips">5分钟内（不含5分钟）未充电成功，可退还全款</div>
    </div>
</template>

<script>
    export default {
        name: "detailInfor"
    }
</script>

<style scoped lang="less">
  .detailInfor{
    .tips{
      color: #8D95A6;
      font-size: 13px;
      margin: 6px 12px;
    }
    margin-top: 20px;
    .inforBox{
      width: 351px;
      margin: 0 auto;
      background: #fff;
      padding: 12px;
      border-radius: 4px;
      ul{
        padding-top: 4px;
        li{
          display: flex;
          justify-content: space-between;
          height: 50px;
          line-height: 22px;
          .left{
            width: 50%;
            font-size: 15px;
          }
          .right{
            width: 50%;
            font-size: 16px;
            color: #8D95A6;
            text-align: right;
          }
        }
      }
    }
  }
</style>
