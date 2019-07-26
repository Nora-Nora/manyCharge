<template>
  <div class="back">
    <div class="backContent">
      <span class="backicon" @click="goback"></span>
      <slot></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: "topBack",
    methods:{
      goback(){
        if(this.$store.state.haveOrder){
          //有未完成订单，关闭页面
          var userAgent = navigator.userAgent;
          if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") !=-1) {
            window.open('','_self').close();
          }else {
            window.opener = null;
            window.open("about:blank", "_self");
            window.close();
          }
        }else{
          //无未完成订单，返回首页
          this.$router.push({path:'/'});
        }

      }
    }
  }
</script>

<style scoped lang="less">
  .backContent {
    position: relative;
    text-align: center;
    font-size: 18px;
    padding: 14.9px 24.6px;
    .backicon {
      position: absolute;
      left: 24.6px;
      top: 14.9px;
      display: inline-block;
      width: 15px;
      height: 15px;
      background: url("~imgUrl/chargeDetail/back.png");
      background-size: cover;
    }
  }
</style>
