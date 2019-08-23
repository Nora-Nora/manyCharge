<template>
  <div class="home">
    <div class="homeContent">
      <homeHead :equipmentInfor="equipmentInfor"/>
      <!--充电桩设备选择-->
      <recharge-select :equipmentInfor="equipmentInfor"/>
      <!--充值金额-->
      <charge-num/>
      <!--支付方式-->
      <pay-way :equipmentInfor="equipmentInfor" :userData="userData"/>
      <!--充电须知-->
      <charge-suggest/>
    </div>
    <!--弹出提示框-->
    <pop-box v-slot:tipContent v-show="this.$store.state.chargeBreakPop">
      <div class="tipContent">
        <div class="imgBox"><img src="~imgUrl/home/chargeBreck.png" alt=""></div>
        <div class="chargeBreckText">当前充电桩已损坏，请使用其它充电桩</div>
        <div class="button" @click="hidePop">好的</div>
      </div>
    </pop-box>
<!--    <div class="isSuc" v-show="true">-->
<!--      <div class="isSucBox">-->
<!--        <p class="qus">请确认微信支付是否已完成</p>-->
<!--        <p class="yes" @click="paySuc">已完成支付</p>-->
<!--        <p class="no" @click="!this.$store.state.payPop">支付遇到问题，重新支付</p>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

<script>
    import homeHead from './components/homeHead'
    import rechargeSelect from './components/rechargeSelect'
    import chargeNum from './components/chargeNum'
    import payWay from './components/payWay'
    import chargeSuggest from './components/chargeSuggest'
    import popBox from '../../components/popBox'

    export default {
        name: "home",
        components: {
            homeHead,
            rechargeSelect,
            chargeNum,
            payWay,
            chargeSuggest,
            popBox
        },
        data() {
            return {
                userData: {},
                equipmentInfor: {},
                payPop: this.$store.state.payPop
            }
        },
        created() {
            //获取用户信息存储
            let userData = JSON.parse(window.localStorage.getItem('userData'));
            if (userData && userData.deviceSN !== undefined) {
                this.userData = userData;
                let deviceSN = userData.deviceSN;
                this.$store.state.deviceSN = deviceSN;
                this.getEquipmentInfor(deviceSN);
            } else {
                this.$vux.toast.text('请重新登录');
                this.$router.push({path: '/login'});
            }
        },
        updated() {

        },
        methods: {
            hidePop() {
                this.$store.state.chargeBreakPop = false;
            },
            //判断支付是否成功
            // paySuc() {
            //     this.$store.state.payPop = false;
            //     let userData = JSON.parse(window.localStorage.getItem('userData'));
            //     if (userData && (userData.userId !== null || userData.userId !== undefined)) {
            //         let id = userData.userId;
            //         this.sendHttp({
            //             url: this.baseUrl + '/order/getUnfinishedOrder', method: 'get', data: {
            //                 id: id
            //             }
            //         }).then(res => {
            //             if (res.code == '200') {
            //                 if (res.data.haveOrder) {
            //                     let orderData = res.data.orderInfo;
            //                     window.sessionStorage.setItem('orderData', JSON.stringify(orderData));
            //                     this.orderData = orderData;
            //                     let type = orderData.type;
            //                     if (type == 6) {
            //                         this.$vux.toast.text('设备异常，请及时取消订单');
            //                         this.$router.push({path: '/chargeDetail/infor'});
            //                     } else if (type == 4) {
            //                         this.$router.push({path: '/paySuc'});
            //                     }
            //                 } else {
            //                     this.$router.push({path: '/'});
            //                 }
            //             }
            //         });
            //     }
            //
            // },
            getEquipmentInfor(deviceSN) {
                const that = this;
                if (deviceSN) {
                    this.sendHttp({
                        url: that.baseUrl + '/device/getDeviceInfo',
                        methods: 'get',
                        data: {'deviceSN': deviceSN}
                    }).then(res => {
                        if (res.code == '200') {
                            that.equipmentInfor = res.data;
                            that.equipmentInfor.chargingVOList = res.data.chargingVOList;
                            //console.log(this.equipmentInfor.chargingVOList);
                        }
                    });
                }
            }
        }
    }
</script>

<style scoped lang="less">
  @import "~@/assets/style/common.less";

  .home {
    padding-bottom: 53px;

    .homeContent {
      width: 351px;
      margin: 0 auto;
    }

    /*.isSuc {*/
    /*  position: fixed;*/
    /*  top: 0;*/
    /*  left: 0;*/
    /*  z-index: 1000;*/
    /*  width: 100%;*/
    /*  height: 100%;*/
    /*  background: rgba(0, 0, 0, 0.5);*/
    /*  display: flex;*/
    /*  justify-content: center;*/
    /*  align-items: center;*/

    /*  .isSucBox {*/
    /*    width: 245px;*/
    /*    background: #fff;*/
    /*    border-radius: 4px;*/
    /*    text-align: center;*/
    /*    font-size: 16px;*/

    /*    p {*/
    /*      padding: 12px 0;*/
    /*      border-top: 1px solid #DADADA;*/
    /*    }*/

    /*    p.qus {*/
    /*      border: none;*/
    /*      padding: 20px 0;*/
    /*    }*/

    /*    p.yes {*/
    /*      color: #EB4158;*/
    /*    }*/

    /*    p.no {*/
    /*      color: #8c8c8c;*/
    /*    }*/
    /*  }*/
    /*}*/
  }

  .tipContent {
    text-align: center;

    .imgBox {
      width: 163px;
      height: 101px;
      margin: 27px auto;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .chargeBreckText {
      font-size: 16px;
    }

    .button {
      width: 278px;
      line-height: 46px;
      color: #fff;
      font-size: 18px;
      background: @themeColor;
      margin: 22px auto;
      border-radius: 4px;
      margin-bottom: 30px;
    }
  }
</style>
