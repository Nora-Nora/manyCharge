<template>
  <div class="paySuccess">
    <div class="sucBox">
      <div class="tips"><i></i>支付成功！</div>
      <div class="detail">您已成功支付{{ this.orderData.money }}元</div>
      <div class="payWay">
        <div class="left">支付方式</div>
        <div class="right">{{ this.orderData.payType===0?'微信':'支付宝' }}支付</div>
      </div>
    </div>
    <div class="startCharge">请插上电源开始充电</div>
    <btn>
      <router-link to="/chargeDetail/infor">查看充电详情</router-link>
    </btn>
  </div>
</template>

<script>
  import btn from '@/components/btn'

  export default {
    name: "paySuccess",
    components: {
      btn
    },
    data(){
      return{
        orderData:{}
      }
    },
    created() {
      this.checkOrder();
      let orderData = JSON.parse(window.sessionStorage.getItem('orderData'));
      this.orderData = orderData;
    },
    methods: {
      //订单时候异常
      checkOrder() {
        let userData = window.sessionStorage.getItem('userData');
        if (userData) {
          let id = userData.userId;
          this.sendHttp({
            url: this.baseUrl + '/order/getUnfinishedOrder', method: 'get', data: {
              id: id
            }
          }).then(res=>{
            if(res.data=='200'){
              let type = data.orderInfo.type;
              if(type===1){
                //当前设备故障，提示退款
                this.$vux.toast('当前设备故障,请取消订单');
              }
            }
          });
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/style/common.less";

  .paySuccess {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: #F8F9FA;
    padding-top: 30.5px;
    text-align: center;
    font-size: 16px;

    .sucBox {
      background: #fff;
      width: 351px;
      height: 200px;
      margin: 0 auto;
      color: #8D95A6;
      font-size: 16px;

      .tips {
        font-weight: bold;
        font-size: 18px;
        padding: 26px 0 15px 0;
        color: #000;

        i {
          vertical-align: middle;
          display: inline-block;
          width: 28px;
          height: 28px;
          background: url("~imgUrl/home/selected.png");
          background-size: cover;
          margin-right: 9px;
        }
      }

      .payWay {
        display: flex;
        justify-content: space-between;
        padding: 0 39px;
        padding-top: 47px;
      }
    }

    .startCharge {
      margin-top: 24px;
      color: @themeColor;
      margin-bottom: 291px;
    }

    .toDetails {
      position: absolute;
      bottom: 31px;
      width: 100%;

      a {
        display: block;
        width: 327px;
        margin: 0 auto;
        background: @themeColor;
        line-height: 48px;
        color: #fff;
        border-radius: 4px;
      }
    }

  }

</style>
