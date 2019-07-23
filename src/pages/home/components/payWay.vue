<template>
  <div class="payWay">
    <div class="title">支付方式</div>
    <div class="selectBox">
      <div class="wechat">
        <div class="left"><i></i>微信支付</div>
        <div :class="['right',{ selected: payType===0 }]" @click="paySelect(0)"></div>
      </div>
      <div class="zhifubao">
        <div class="left"><i></i>支付宝支付</div>
        <div :class="['right',{ selected: payType===1 }]" @click="paySelect(1)"></div>
      </div>
    </div>
    <btn>
      <div @click="isPay">确认支付</div>
    </btn>
  </div>
</template>

<script>
  import btn from '@/components/btn'

  export default {
    name: "payWay",
    data() {
      return {
        payType: 0,
        userIp: ''
      }
    },
    components: {
      btn
    },
    props: ['equipmentInfor'],
    methods: {
      paySelect(num) {
        this.payType = num;
        this.$store.state.payType = num;
      },
      isPay() {
        if (this.isUse()) {
          let phoneNum = window.localStorage.getItem('phoneNum');
          let token = window.sessionStorage.getItem('Authorization');
          if (this.payType == 0) {
            //新建微信订单
            this.sendHttp({
              url: this.baseUrl + '/order/newOrderByWechat', method: 'post', data: {
                userIp: this.userIp,
                deviceSN: this.$store.state.deviceSN,
                chargingId: this.$store.state.chargingId,
                money: this.$store.state.chargeMoney,
                useTime: this.$store.state.useTime,
                payType: this.payType,
                phone: phoneNum,
                token: token
              }
            }).then(res => {
              console.log(res);
            }).catch(error => {
              console.log(error);
            });
          } else if (this.payType == 1) {
            //新建支付宝订单
            console.log('新建支付宝订单');
          }

        }
      },
      //判断当前选择设备是否可用
      isUse() {
        if (this.$store.state.chargingId > 0) {
          let listInfor = this.equipmentInfor.chargingVOList;
          for (var i = 0; i < listInfor.length; i++) {
            if (listInfor[i].id == this.$store.state.chargingId) {
              if (listInfor[i].deviceStatus == -1) {
                this.$store.state.chargeBreakPop = true;
                return false
              } else if (listInfor[i].deviceStatus == 1) {
                this.$vux.toast.text('充电桩正在充电！');
                return false
              } else {
                return true
              }
            }
          }
        } else {
          this.$vux.toast.text('请选择充电桩！');
          return false
        }
      }

    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/style/common.less";

  .payWay {
    .title {
      color: #8D95A6;
      font-size: 16px;
      line-height: 40px;
      padding-left: 12px;
    }

    .selectBox {
      font-size: 15px;
      background: #fff;
      margin-bottom: 33px;

      .wechat {
        display: flex;
        justify-content: space-between;
        line-height: 51px;
        font-size: 15px;
        padding: 0 24px 0 12px;
        align-items: center;

        .left {
          display: flex;
          align-items: center;

          i {
            display: inline-block;
            width: 20px;
            height: 18.4px;
            background: url("~imgUrl/home/wechat.png") no-repeat;
            background-size: cover;
            margin-right: 4px;
          }
        }

        .right {
          width: 18px;
          height: 18px;
          background: url("~imgUrl/home/noSelected.png");
          background-size: cover;

          &.selected {
            background: url("~imgUrl/home/selected.png");
            background-size: cover;
          }
        }
      }

      .zhifubao {
        .wechat();

        .left {
          i {
            background: url("~imgUrl/home/zhifubao.png") no-repeat;
            background-size: cover;
          }
        }
      }
    }
  }
</style>
