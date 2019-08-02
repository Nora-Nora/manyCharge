<template>
  <div class="phoneCheck">
    <form action="">
      <div class="phoneNum">
        <span class="checkText">手机号码</span><br>
        <input type="number" v-model="phoneNum" v-focus>
      </div>
      <div class="checkCode">
        <span class="checkText">短信验证</span><br>
        <input type="text" v-model.trim="yzCode">
        <span class="getCode" @click="getCode" v-show="isClick">获取验证码</span>
        <span class="getCode" v-show="!isClick">{{ timeMsg }}s</span>
      </div>
      <input type="submit" :class="{active:submitStatus}" id="submit" value="登录" @click="loginOn">
    </form>
  </div>
</template>

<script>
  export default {
    name: "phoneCheck",
    data() {
      return {
        isClick: true,
        phoneNum: '',
        timeMsg: 59,
        yzCode: '',
        //第一次扫描充电桩二维码sn信息
        deviceSN: this.$store.state.deviceSN,
        submitStatus: false
      }
    },
    created() {
      //新建用户信息
      if (!window.sessionStorage.getItem('userData')) {
        let userData = {};
        window.sessionStorage.setItem('userData', JSON.stringify(userData));
      }
      //新建订单信息
      if (!window.sessionStorage.getItem('orderData')) {
        let orderData = {};
        window.sessionStorage.setItem('orderData', JSON.stringify(orderData));
      }
      //获取内存手机号
      let phoneNum = window.localStorage.getItem('phoneNum');
      this.phoneNum = phoneNum;
    },
    updated() {
      if (this.yzCode !== '') {
        this.submitStatus = true;
      } else {
        this.submitStatus = false;
      }
    },
    methods: {
      getCode() {
        const that = this;
        if (this.checkPhone()) {
          if (that.isClick) {
            that.sendCode();
          }
        }
      },
      //用户登录
      loginOn() {
        if (this.checkPhone()) {
          if (this.yzCode !== '') {
            const that = this;
            //请求登录
            this.sendHttp({
              url: this.baseUrl + '/index/login', method: 'post', data: {
                deviceSN: this.deviceSN, phone: this.phoneNum, code: this.yzCode
              }
            }).then(res => {
              console.log(res);
              if (res.code == '200') {
                that.phoneNum = res.data.userData.phone;
                console.log(res.data.userData.phoneNum);
                window.localStorage.setItem('Authorization',res.data.userData.authToken);
                window.localStorage.setItem('phoneNum',res.data.userData.phone);
                window.localStorage.setItem('deviceSN',res.data.userData.deviceSN);
                //console.log(window.localStorage.getItem('phoneNum'));
                //存储用户信息
                let userData = res.data.userData;
                //console.log(userData);
                window.sessionStorage.setItem('userData', JSON.stringify(userData));
                if (res.data.orderData == 'false') {
                  //没有未完成订单直接跳转首页
                  this.$router.push({path: '/'});
                } else {
                  //有未完成，存储订单信息
                  let orderData = res.data.orderData;
                  window.sessionStorage.setItem('orderData', JSON.stringify(orderData));
                  this.$router.push({path: '/chargeDetail/infor'});
                }
              }
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
          if (that.timeMsg === 0) {
            clearInterval(time);
            that.timeMsg = 59;
            that.isClick = true;
          } else {
            that.timeMsg--;
          }
        }, 1000);
      },
      //验证手机号
      checkPhone() {
        if (!/^1(3|4|5|7|8|9)[0-9]{9}$/.test(this.phoneNum)) {
          this.$vux.toast.text('手机号输入有误');
          return false
        } else {
          return true
        }
      },
      //发送验证码
      sendCode() {
        this.sendHttp({
          url: this.baseUrl + '/index/sendSMS',
          method: 'get',
          data: {phone: this.phoneNum}
        }).then(res => {
          if (res.code == 200) {
            this.$vux.toast.text('发送成功！');
            this.isClick = false;
            this.timeDown();
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
        bottom: 0;
        right: 0;
        line-height: 40px;
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

        &.active {
          background: @themeColor;
          color: #fff;
        }
      }
    }

  }
</style>
