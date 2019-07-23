<template>
  <div class="homeHead">
    <div class="title">智能充电桩</div>
    <div class="introduce">
      <div class="address">
        <div class="icon"><img src="~imgUrl/home/address.png" alt=""></div>
        <div class="text">{{ equipmentInfor.deviceLocation }}充电桩</div>
      </div>
      <div class="equipmentNum">
        设备编号：{{ equipmentInfor.deviceNum }}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "homeHead",
    data(){
      return{

      }
    },
    props:['equipmentInfor'],
    mounted() {
      this.$store.state.deviceNum = this.equipmentInfor.deviceNum;
    }
  }
</script>

<style scoped lang="less">
  .homeHead {
    .title {
      padding: 17px 15px;
      font-size: 24px;
    }

    .introduce {
      height: 115px;
      background: url("~imgUrl/home/homeBg.png");
      background-size: cover;
      border-radius: 6px;
      color: #fff;
      overflow: hidden;
      margin-bottom: 10px;

      .address {
        padding: 0 34px;
        padding-top: 26px;
        font-size: 16px;
        display: flex;
        flex-direction: row;
        align-items: center;

        .icon {
          width: 30px;

          img {
            width: 100%;
            height: 36px;
          }
        }

        .text {
          width: 177px;
          height: 44px;
          line-height: 22px;
          padding-left: 18px;
        }
      }

      .equipmentNum {
        font-size: 12px;
        text-align: right;
        padding: 22px 17px 0 0;
      }
    }
  }
</style>
