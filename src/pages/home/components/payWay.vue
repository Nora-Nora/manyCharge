<template>
  <div class="payWay">
    <div class="title">支付方式</div>
    <div class="selectBox">
      <div class="wechat">
        <div class="left"><i></i>微信支付</div>
        <div :class="['right',{ selected: selected=='weixin' }]" @click="paySelect('weixin')"></div>
      </div>
      <div class="zhifubao">
        <div class="left"><i></i>支付宝支付</div>
        <div :class="['right',{ selected: selected=='zhifubao' }]" @click="paySelect('zhifubao')"></div>
      </div>
    </div>
    <btn><div @click="isPay">确认支付</div></btn>
  </div>
</template>

<script>
  import btn from '@/components/btn'
  export default {
    name: "payWay",
    data(){
      return{
        selected:''
      }
    },
    components:{
      btn
    },
    props:['equipments'],
    methods:{
      paySelect(way){
        this.selected = way;
      },
      isPay(){
        if(this.$store.state.chargeId==''){
          alert('请选择充电桩！');
        }
        for(var i=0;i<this.equipments.length;i++){
          if(this.equipments[i].id == this.$store.state.chargeId){
            if(this.equipments[i].type=='break'){
              this.$store.state.chargeBreakPop = true;
            }else if(this.equipments[i].type=='charging'){
              alert('充电桩正在充电！');
            }
          }
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
      .wechat{
        display: flex;
        justify-content: space-between;
        line-height: 51px;
        font-size: 15px;
        padding: 0 24px 0 12px;
        align-items: center;
        .left{
          display: flex;
          align-items: center;
          i{
            display: inline-block;
            width: 20px;
            height: 18.4px;
            background: url("~imgUrl/home/wechat.png") no-repeat;
            background-size: cover;
            margin-right: 4px;
          }
        }
        .right{
          width: 18px;
          height: 18px;
          background: url("~imgUrl/home/noSelected.png");
          background-size: cover;
          &.selected{
            background: url("~imgUrl/home/selected.png");
            background-size: cover;
          }
        }
      }
      .zhifubao{
        .wechat();
        .left{
          i{
            background: url("~imgUrl/home/zhifubao.png") no-repeat;
            background-size: cover;
          }
        }
      }
    }
  }
</style>
