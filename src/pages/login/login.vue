<template>
  <div class="login">
    <div class="loginBox">
      <login-head/>
      <phone-check :userData="userData"/>
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
            let phone = JSON.parse(window.localStorage.getItem('phone'));
            if(userData){
                this.userData.phone = userData.phone;
                if(userData.userId){
                    this.userData = userData;
                    this.$router.push({path: '/'});
                }
            }else if(phone){
                this.userData.phone = phone;
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
