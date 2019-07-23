<template>
  <div class="home">
    <div class="homeContent">
      <homeHead :equipmentInfor="equipmentInfor"/>
      <!--充电桩设备选择-->
      <recharge-select :equipmentInfor="equipmentInfor"/>
      <!--充值金额-->
      <charge-num />
      <!--支付方式-->
      <pay-way :equipmentInfor="equipmentInfor"/>
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
      this.deviceSN = this.$store.state.deviceSN;
    },
    mounted() {
      this.getEquipmentInfor(this.deviceSN);
    },
    data() {
      return {
        deviceSN: '',
        equipmentInfor: {},
        // equipments: [
        //   {
        //     id: 1,
        //     type: 'normal'
        //   },
        //   {
        //     id: 2,
        //     type: 'charging'
        //   },
        //   {
        //     id: 3,
        //     type: 'break'
        //   },
        //   {
        //     id: 4,
        //     type: 'normal'
        //   },
        //   {
        //     id: 5,
        //     type: 'normal'
        //   },
        //   {
        //     id: 6,
        //     type: 'normal'
        //   },
        //   {
        //     id: 7,
        //     type: 'normal'
        //   },
        //   {
        //     id: 8,
        //     type: 'normal'
        //   }
        // ]
      }
    },
    methods: {
      hidePop() {
        this.$store.state.chargeBreakPop = false;
      },
      getEquipmentInfor(deviceSN) {
        this.sendHttp({
          url: this.baseUrl + '/device/getDeviceInfo',
          methods: 'get',
          data: {'deviceSN': this.deviceSN},
          auth: true,
          stringify: true
        }).then(res=>{
          console.log(res);
          if(res.code=='200'){
            this.equipmentInfor = res.data;
          }
        }).catch(error=>{
          console.log(error);
        });
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
