<template>
  <div class="chargeNum">
    <div class="money">
      <div class="left">充值：</div>
      <div class="right">
        <input type="number" v-model="selectNum" placeholder="请输入预付金额(0.8元/小时)" @focusout="chargeTime(selectNum)">元
      </div>
    </div>
    <div class="moneyList">
      <ul>
        <li v-for="(item) in chargetype" :class="{on:selectNum==item}" @click="chargeTime(item)">{{ item }}元</li>
      </ul>
    </div>
    <div class="time">
      <div class="text">预计充电时长</div>
      <div class="timeValue" v-if="timeResult!==''">{{ timeResult }}</div>
      <div class="timeValue" v-else>—— ——</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "chargeNum",
    data(){
      return{
        selectNum:Number,
        chargetype:[1,2,3],
        timeResult:''
      }
    },
    methods:{
      chargeTime(moneyNum){
        if(moneyNum>0){
          //预计充电时长（单位：分）
          let useTime = (60*moneyNum)/0.8;
          //console.log(useTime);
          this.$store.state.useTime = useTime;
          //计算充电时长
          this.selectNum = moneyNum;
          this.$store.state.chargeMoney = moneyNum;
          let time = moneyNum/0.8;
          //向上取整获取小时数
          let hour = Math.floor(time);
          //获取分钟数
          let minute = Math.round((time-hour)*60);
          this.timeResult = `${hour}小时${minute}分钟`;
          // this.$store.state.chargeTime = this.timeResult;
        }else{
          this.timeResult = '';
          this.$store.state.chargeMoney = 0;
        }

      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/style/common.less";

  .chargeNum {
    background: #fff;

    .money {
      width: 327px;
      line-height: 52px;
      margin: 0 auto;
      background: #F8F9FA;
      display: flex;
      justify-content: space-between;
      font-size: 15px;

      .left {
        padding-left: 12px;
      }
      .right {
        padding-right: 12px;
        color: #8D95A6;
        input {
          padding-right: 12px;
          line-height: 52px;
          font-size: 16px;
          font-weight: bold;
          text-align: right;
          background: #F8F9FA;
          &::-webkit-input-placeholder{
            font-size: 16px;
            color: #8D95A6;
            font-weight: normal;
          }
        }
      }
    }
    .moneyList {
      ul {
        display: flex;
        justify-content: space-between;
        width: 327px;
        margin: 0 auto;

        li {
          margin: 6px 0;
          background: #F8F9FA;
          width: 90px;
          line-height: 32px;
          font-size: 14px;
          text-align: center;
          &.on {
            color: #fff;
            background: @themeColor;
          }
        }
      }

    }

    .time {
      text-align: center;
      padding: 20px 0;

      .text {
        color: #262626;
        font-size: 15px;
      }

      .timeValue {
        color: @themeColor;
        font-size: 16px;
        padding-top: 11px;
      }
    }
  }
</style>
