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
        created() {
            //获取用户信息存储
            let userData = JSON.parse(window.localStorage.getItem('userData'));
            if (userData && userData.userId !== null) {
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
        data() {
            return {
                userData: {},
                equipmentInfor: {},
            }
        },

        methods: {
            hidePop() {
                this.$store.state.chargeBreakPop = false;
            },
            getEquipmentInfor(deviceSN) {
                const that = this;
                if (deviceSN) {
                    this.sendHttp({
                        url: that.baseUrl + '/device/getDeviceInfo',
                        methods: 'get',
                        data: {'deviceSN': deviceSN}
                    }).then(res => {
                        //console.log(res);
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
