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
        this.$router.push({path:'/'})
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
