<template>
  <div class="login">
    <div class="loginBox">
      <login-head/>
      <phone-check />
    </div>
  </div>
</template>

<script>
  import loginHead from './components/loginHeader'
  import phoneCheck from './components/phoneCheck'

  export default {
    name: "login",
    components:{
      loginHead,
      phoneCheck
    }

  }
</script>

<style scoped lang="less">
  .login {
    background: #fff;
    .loginBox{
      width: 327px;
      margin: 0 auto;
    }
  }
</style>
