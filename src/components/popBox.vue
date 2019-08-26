<template>
  <div class="popBox">
    <div class="boxContent">
      <slot name="tipContent"></slot>
      <div class="close" @click="hidePop"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "popBox",
    methods:{
      hidePop(){
        this.$store.state.cancelChargePop = false;
        this.$store.state.chargeBreakPop = false;
        if(this.$route.name=='login'){
            this.$router.push({path:'/'});
        }
          if(this.$route.name=='home'){
              this.$store.state.homeTip = false;
          }
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/style/common.less";
  .popBox{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background:rgba(23,32,46,0.7) ;
    z-index: 1000;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: content-box;
    .boxContent{
      width: 327px;
      border-radius: 4px;
      background: #fff;
      opacity: 1;
      position: relative;
    }
    .close{
      width: 26px;
      height: 33px;
      background: url("~imgUrl/home/close.png");
      background-size: cover;
      position: absolute;
      right: 14px;
      top: 0;
    }
  }
</style>
