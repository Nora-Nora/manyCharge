<template>
  <div class="chargeBox">
    <div class="tipsIcon">
      <ul>
        <li><i class="selected"></i>选中</li>
        <li><i class="charge"></i>可充电</li>
        <li><i class="charging"></i>充电中</li>
        <li><i class="break"></i>故障</li>
      </ul>
      <i class="refresh" @click="refresh"></i>
    </div>
    <div class="selectEquipment">
      <ul>
        <li v-for="item in equipmentInfor.chargingVOList"
            :class="[{selected:selectedChargeId==item.chargingAddr-1},{charging:item.deviceStatus===1},{break:item.deviceStatus===-1}]"
            @click="addSelected(item.chargingAddr-1,item.id)">{{item.deviceStatus===0 ? item.chargingAddr-1:''}}
        </li>
      </ul>
      <div class="selectedNum">{{ selectedChargeId===0 ?'请点击上方选择充电桩':'已选：'+selectedChargeId+'号充电桩'}}</div>
    </div>
  </div>
</template>
<script>
    export default {
        name: "rechargeSelect",
        data() {
            return {
                selectedChargeId: 0
            }
        },
        props: ['equipmentInfor'],
        methods: {
            addSelected(num, id) {
                //console.log(id);
                this.$store.state.chargingId = id;
                this.$store.state.chargingNum = num;
                this.selectedChargeId = num;
            },
            //刷新页面
            refresh() {
                //this.reload();
                let userData = JSON.parse(window.localStorage.getItem('userData'));
                if (userData && userData.deviceSN) {
                    let deviceSN = userData.deviceSN;
                    this.$parent.getEquipmentInfor(deviceSN);
                    this.selectedChargeId = 0;
                    this.$store.state.chargingId = 0;
                    this.$store.state.chargingNum = 0;
                }


            }
        }

    }
</script>

<style scoped lang="less">
  @import "~@/assets/style/common.less";

  .chargeBox {
    background: #fff;
    padding: 16px 0;

    .tipsIcon {
      padding-left: 23px;
      font-size: 12px;
      position: relative;

      .refresh {
        display: block;
        width: 18px;
        height: 18px;
        background: url("~imgUrl/home/refresh.png") no-repeat center center;
        background-size: 85%;
        position: absolute;
        top: 0;
        right: 10px;
      }

      ul {
        width: 100%;
        display: flex;
        justify-content: left;
        flex-wrap: wrap;

        li {
          margin: 0 6px;
          display: flex;
          align-items: center;

          i {
            display: inline-block;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            margin-right: 4px;
          }

          .selected {
            background: url("~imgUrl/home/chargeIcon.png") #FFA81F center center no-repeat;
            background-size: 50%;
          }

          .charge {
            background: #EAF3F9;
          }

          .charging {
            background: url("~imgUrl/home/chargeIcon.png") @themeColor center center no-repeat;
            background-size: 50%;
          }

          .break {
            background: #A2A2A2;
          }
        }
      }
    }

    .selectEquipment {
      overflow: hidden;

      ul {
        display: flex;
        flex-wrap: wrap;
        margin-top: 24px;
        width: 358px;
        padding-left: 22px;

        li {
          width: 40px;
          height: 40px;
          line-height: 40px;
          border-radius: 50%;
          background: #EAF3F9;
          color: @themeColor;
          text-align: center;
          font-size: 15px;
          margin: 0 27px 16px 0;

          &.selected {
            background: url("~imgUrl/home/chargeIcon.png") #FFA81F center center no-repeat;
            background-size: 35%;
            color: rgba(0, 0, 0, 0);

          }

          &.break {
            background: url("~imgUrl/home/breakIcon.png") #A2A2A2 center center no-repeat;
            background-size: 35%;
          }

          &.charging {
            background: url("~imgUrl/home/chargeIcon.png") @themeColor center center no-repeat;
            background-size: 35%;
          }
        }
      }

      .selectedNum {
        text-align: right;
        color: #8D95A6;
        font-size: 13px;
        padding: 7px 18px 0 0;
      }
    }
  }

</style>
