<template>
  <div class="login">
    <div class="loginBox">
      <login-head/>
      <phone-check/>
    </div>
  </div>
</template>

<script>
    import loginHead from './components/loginHeader'
    import phoneCheck from './components/phoneCheck'

    export default {
        name: "login",
        components: {
            loginHead,
            phoneCheck
        },
        data() {
            return {
                userData: {}
            }
        },
        created() {
            let userData = JSON.parse(window.localStorage.getItem('userData'));
            if(userData){
                if(userData.userId){
                    this.userData = userData;
                    window.localStorage.setItem('phone',userData.phone);
                    this.$router.push({path: '/'});

                }
            }
        }
    }
</script>

<style scoped lang="less">
  .login {
    background: #fff;

    .loginBox {
      width: 327px;
      margin: 0 auto;
    }
  }
</style>
