<template>
  <div class="detailHead">
    <div class="left">
      <div class="circle-chart">
        <div class="donut-chart">
          <div id="section1" class="clip">
            <div class="item"></div>
          </div>
          <div id="section2" class="clip">
            <div class="item"></div>
          </div>
          <div id="section3" ref="section3" class="clip">
            <div class="item" ref="section3Item"></div>
          </div>
          <div class="center">
            <p class="text">{{ orderMsg.isEnd?'充电时长':'已充电'}}</p>
            <p class="time">{{ orderMsg.chargeTime }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="text">{{ orderMsg.isEnd?'充电结束1':'正在充电…'}}({{ orderInfor.chargingId }}号)</div>
      <div :class="['cancel',{'finish':orderMsg.isEnd}]" @click="showPop">取消充电</div>
    </div>
    <div class="refresh" @click="refresh"></div>
  </div>
</template>
<script>
  export default {
    name: "detailHead",
    // 注入reload, AppVue中注册
    inject: ['reload'],
    data(){
      return{
        chargeId:0
      }
    },
    created(){
      //console.log(this.orderMsg);
    },
    mounted() {
      this.chargeId = this.$store.state.chargingId;
      this.updateDonut(this.orderMsg.percent); // 初始化百分比
    },
    updated(){
      if(this.orderMsg.isEnd==true){
        this.updateDonut(100);
      }else{
        this.updateDonut(this.orderMsg.percent);
      }
    },
    props:['orderInfor','orderMsg'],
    methods: {
      updateDonut(percent) {
        // 圆形进度
        let offset = 0
        let $el = this.$refs.section3
        let $elItem = this.$refs.section3Item
        let $txt = this.$refs.percent
        if (percent < 50) {
          offset = (360 / 100) * percent
          $el.style.webkitTransform = $el.style.msTransform = $el.style.MozTransform = 'rotate(' + offset + 'deg)'
          $elItem.style.webkitTransform = $elItem.style.msTransform = $elItem.style.MozTransform = 'rotate(' + (180 - offset) + 'deg)'
          $elItem.style.backgroundColor = 'rgba(69,155,255,1)'
        } else {
          offset = ((360 / 100) * percent) - 180
          $el.style.webkitTransform = $elItem.style.msTransform = $el.style.MozTransform = 'rotate(180deg)'
          $elItem.style.webkitTransform = $elItem.style.msTransform = $elItem.style.MozTransform = 'rotate(' + offset + 'deg)'
          $elItem.style.backgroundColor = '#fff'
        }
        //$txt.text = percent
      },
      showPop() {
        if(this.orderMsg.percent<100 && this.orderMsg.percent>0){
          this.$store.state.cancelChargePop = true;
        }else{
          this.$store.state.cancelChargePop = false;
        }
      },
      refresh() {
        //刷新页面
        this.reload();
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/style/common.less";

  .detailHead {
    position: relative;

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
    display: flex;
    justify-content: left;
    font-size: 15px;
    color: #fff;

    .left {
      width: 60%;
      display: flex;
      justify-content: center;
      align-items: center;

      .circle-chart {
        .donut-chart {
          position: relative;
          width: 139.98px;
          height: 139.98px;
          border-radius: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .donut-chart .center {
          background: #3484f5;
          border-radius: 50%;
          width: 88%;
          height: 88%;
          /*left: 6.5%;*/
          /*top: 6.5%;*/
          position: absolute;
          p {
            text-align: center;
            color: #fff;
            &.text {
              font-size: 15px;
              padding-top: 36px;
              line-height: 21px;
            }
            &.time {
              font-size: 20px;
              line-height: 23px;
              padding-top: 2px;
            }
          }
        }
        .clip {
          border-radius: 50%;
          clip: rect(0px 140px 140px 70px);
          height: 100%;
          position: absolute;
          width: 100%;
        }

        .item {
          border-radius: 50%;
          clip: rect(0px 70px 140px 0px);
          height: 100%;
          position: absolute;
          width: 100%;
        }

        #section1 {
          transform: rotate(0deg);
        }

        #section1 .item {
          background-color: #fff;
          transform: rotate(180deg);
        }

        #section2 {
          transform: rotate(180deg);
        }

        #section2 .item {
          background-color: rgba(255, 255, 255, 0.2);
          transform: rotate(180deg);
        }
      }
    }

    .right {
      width: 40%;

      .text {
        width: 76px;
        color: #fff;
        padding-top: 72px;
      }
      .cancel {
        width: 90px;
        text-align: center;
        line-height: 28px;
        border-radius: 24px;
        border: 1px solid #fff;
        margin-top: 30px;
      }
      .finish{
        opacity: 0.3;
      }
    }
  }
</style>
