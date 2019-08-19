<template>
  <div class="detailHead">
    <g>

    </g>
    <div class="left">
      <van-circle
        v-model="currentRate"
        color="#fff"
        fill="rgba(0,0,0,0)"
        :size="size"
        layer-color="rgba(255,255,255,0.3)"
        :speed="100"
        :rate="orderMsg.percent"
        :stroke-width="50"
        class="circleBox"
      >
<!--        <div class="animateCircle">-->
<!--          <div class="img1 move1"></div>-->
<!--          <div class="img2 move2"></div>-->
<!--          <div class="img3 move3"></div>-->
<!--        </div>-->
        <div class="center">
          <p class="text">{{ orderInfor.isEnd?'充电时长':'已充电'}}</p>
          <p class="time">{{ orderInfor.chargeTime?orderInfor.chargeTime:orderMsg.chargeTime }}</p>
        </div>
      </van-circle>

    </div>
    <div class="right">
      <div class="text">{{ orderInfor.isEnd?'充电结束':'正在充电…'}}({{ Number(orderInfor.chargingAddr)-1 }}号)</div>
      <div :class="['cancel',{'finish':orderInfor.isEnd}]" @click="showPop">取消充电</div>
    </div>
    <div class="refresh" @click="refresh"></div>
  </div>
</template>
<script>

    export default {
        name: "detailHead",
        // 注入reload, AppVue中注册
        inject: ['reload'],
        data() {
            return {
                currentRate: 0,
                size: '128px',
                screenWidth: '375px'
            }
        },
        mounted() {

        },
        updated() {
            if (this.orderMsg.isEnd == true) {
                this.orderMsg.percent = 100;
            }
            //获取屏幕宽度
            let screenWidth = document.body.clientWidth;
            this.size = screenWidth / 3 + 'px';

        },
        props: ['orderInfor', 'orderMsg'],
        methods: {
            showPop() {
                if (this.orderInfor.isEnd) {
                    this.$store.state.cancelChargePop = false;
                } else {
                    //isEnd为false，订单没有结束，弹出是否结束的提示框
                    this.$store.state.cancelChargePop = true;
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
      width: 70%;
      display: flex;
      justify-content: center;
      align-items: center;

      .circleBox {
        .animateCircle {
          z-index: 1000;
          width: 128px;
          height: 128px;
          position: absolute;
          top: 0;
          left: 0;

          .img1 {
            position: absolute;
            width: 100%;
            height: 100%;
            background: url(~imgUrl/chargeDetail/img1.png) no-repeat center center;
            background-size: 80%;
          }

          .img2 {
            position: absolute;
            width: 100%;
            height: 100%;
            background: url(~imgUrl/chargeDetail/img2.png) no-repeat center center;
            background-size: 85%;
          }

          .img3 {
            position: absolute;
            width: 100%;
            height: 100%;
            background: url(~imgUrl/chargeDetail/img3.png) no-repeat center center;
            background-size: 90%;
          }

          .move1 {
            animation: myMove1 5s ease-in infinite alternate;
            -webkit-animation: myMove1 5s ease-in infinite alternate;
          }

          .move2 {
            animation: myMove2 3s ease infinite alternate;
            -webkit-animation: myMove1 3s ease infinite alternate;
          }

          .move3 {
            animation: myMove3 2s ease-in infinite alternate;
            -webkit-animation: myMove1 2s ease-in infinite alternate;
          }

          @keyframes myMove1 {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          @-webkit-keyframes myMove1 {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          @keyframes myMove2 {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          @-webkit-keyframes myMove2 {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          @keyframes myMove3 {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          @-webkit-keyframes myMove3 {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

        }

      }

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

      .finish {
        opacity: 0.3;
      }
    }
  }
</style>
