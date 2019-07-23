<template>
  <div class="loginHead">
    <img src="~imgUrl/login/logo.png" alt=""><br>
    <div class="name">多对多智能安全充电桩</div>
  </div>
</template>

<script>
  export default {
    name: "loginHeader"
  }
</script>

<style scoped lang="less">
  .loginHead {
    display: flex;
    text-align: center;
    flex-direction: column;
    align-items: center;
    padding: 30px 0;
    img{
      width: 116px;
      height: 21px;
      margin-top: 10px;
    }
    .name{
      font-size: 26px;
      color: #002547;
    }

  }
</style>
