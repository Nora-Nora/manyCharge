<template>
  <div class="chargeDetails">
    <top-back>充电详情</top-back>
    <detail-head :chargePercent="chargePercent" />
    <detail-infor />
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
    components:{
      detailHead,
      detailInfor,
      topBack,
      popBox
    },
    data(){
      return{
        chargePercent:30,
        isPop:this.$store.state.cancelChargePop
      }
    },
    methods:{
      //关闭弹出框
      hidePop(){
        this.$store.state.cancelChargePop = false;
      },
      //结束充电
      chargeEnd(){
        this.$store.state.chargePercent = 100;
        this.$router.push({path:'/chargeEnd'});
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/style/common.less";
  .chargeDetails{
    background: #F8F9FA;
    padding-bottom: 108px;
    .tipContent{
      font-size: 16px;
      text-align: center;
      .text{
        padding-top: 50px;
        padding-bottom: 48px;
      }
      ul{
        margin: 0 24px;
        height: 48px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
        li{
          width: 128px;
          line-height: 48px;
          border-radius: 4px;
          &.cancel{
            border: 1px solid @themeColor;
            color: @themeColor;
          }
          &.sure{
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
