<template>
  <div class="phoneCheck">
    <form action="">
      <div class="phoneNum">
        <span class="checkText">手机号码</span><br>
        <input type="number" v-model="phoneNum" v-focus>
      </div>
      <div class="checkCode">
        <span class="checkText">短信验证</span><br>
        <input type="text" v-model="yzCode">
        <span class="getCode" @click="getCode" v-show="isClick">获取验证码</span>
        <span class="getCode" v-show="!isClick">{{ timeMsg }}s</span>
      </div>
      <input type="submit" id="submit" value="登录" @click="loginOn">
    </form>
  </div>
</template>

<script>
  export default {
    name: "phoneCheck",
    data() {
      return {
        isClick: true,
        //phoneNum: 13145826575,
        phoneNum: '',
        timeMsg: 59,
        yzCode: '',
        //第一次扫描充电桩二维码sn信息
        deviceSN: this.$store.state.deviceSN,
        userId: Number
      }
    },
    mounted() {
      if (window.localStorage.getItem('phoneNum')) {
        this.phoneNum = window.localStorage.getItem('phoneNum');
        console.log(this.phoneNum);
      }
    },
    methods: {
      getCode() {
        const that = this;
        if (this.checkPhone()) {
          if (that.isClick) {
            that.sendCode(() => {
              that.isClick = false;
              that.timeDown();
            });
          }
        }
      },
      loginOn() {
        if (this.checkPhone()) {
          if (this.yzCode !== '') {
            console.log(this.yzCode);
            this.sendHttp({
              url: this.baseUrl + '/index/login', method: 'post', data: {
                deviceSN: this.deviceSN, phone: this.phoneNum, code: this.yzCode
              }, auto: true, stringify: true
            }).then(res => {
              console.log(res);
              if (res.code == '200') {
                this.$store.state.deviceSN = res.deviceSN;
                this.phoneNum = res.phone;
                this.userId = res.userId;
                window.sessionStorage.setItem('Authorization', res.data.authToken);
                window.localStorage.setItem('phoneNum',res.phone);
                this.$router.push({path: '/'});
              }
            }).catch(error => {
              console.log(error);
            });
          } else {
            this.$vux.toast.text('请填写验证码');
          }
        }
      },
      //倒计时
      timeDown() {
        const that = this;
        let time = setInterval(function () {
          that.timeMsg--;
          if (that.timeMsg === 0) {
            clearInterval(time);
            that.timeMsg = 59;
            that.isClick = true;
          }
        }, 1000);
      },
      //验证手机号
      checkPhone() {
        if (!/^1(3|4|5|7|8|9)[0-9]{9}$/.test(this.phoneNum)) {
          this.$vux.toast.text('手机号输入有误!');
          return false
        } else {
          return true
        }
      },
      sendCode(callback) {
        this.sendHttp({
          url: this.baseUrl + '/index/sendSMS',
          method: 'get',
          data: {phone: this.phoneNum},
          auto: true,
          stringify: true
        }).then(res => {
          if (res.code == 200) {
            this.$vux.toast.text('发送成功！');
            if (callback) {
              callback()
            }
          }
        }).catch(error => {
          console.log(error);
        });
      }
    }

  }
</script>

<style scoped lang="less">
  @import "~@/assets/style/common.less";

  .phoneCheck {
    color: #8D95A6;
    font-size: 14px;

    .phoneNum {
      margin-bottom: 20px;
    }

    .checkCode {
      position: relative;
      .phoneNum();

      .getCode {
        color: @themeColor;
        position: absolute;
        bottom: 16px;
        right: 10px;
      }
    }

    form {
      input {
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 20px;
        border-bottom: 1px solid #EAEAEA;
      }

      #submit {
        background: #F0F0F0;
        color: #8D95A6;
        font-size: 16px;
        border-radius: 4px;
        font-weight: bold;
      }
    }

  }
</style>
