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
        userId: Number,
        submitStatus:false
      }
    },
    mounted() {
      if (window.localStorage.getItem('phoneNum')) {
        this.phoneNum = window.localStorage.getItem('phoneNum');
        console.log(this.phoneNum);
      }
    },
    updated(){
      if(this.yzCode!==''){
        this.submitStatus = true;
      }else{
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
            //请求登录
            this.sendHttp({
              url: this.baseUrl + '/index/login', method: 'post', data: {
                deviceSN: this.deviceSN, phone: this.phoneNum, code: this.yzCode
              }
            }).then(res => {
              //console.log(res);
              if (res.code == '200') {
                //获取用户id,保存到本地
                let userId = res.data.userId;
                this.userId = userId;
                window.sessionStorage.setItem('userId',userId);
                //同步store中的sn码
                this.$store.state.deviceSN = res.data.deviceSN;
                this.phoneNum = res.phone;
                //讲用户token和手机号保存到本地
                window.sessionStorage.setItem('Authorization', res.data.authToken);
                window.localStorage.setItem('phoneNum', res.data.phone);
                //获取用户未完成订单
                this.sendHttp({
                  url: this.baseUrl + '/order/getUnfinishedOrder', method: 'get', data: {
                    id: res.data.userId
                  }
                }).then(res => {
                  //console.log(res);
                  if (res.code == '200') {
                    if (res.data.haveOrder) {
                      //有未完成的订单，到该订单的详情页
                      this.$store.state.haveOrder = true;
                      window.sessionStorage.setItem('orderNum',res.data.orderInfo.orderNum);
                      this.$router.push({path: '/chargeDetail/infor'});
                    } else {
                      //没有未完成的订单，直接到首页
                      this.$store.state.haveOrder = false;
                      this.$router.push({path: '/'});
                    }
                  }
                }).catch(error => {
                  console.log(error);
                });
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
          if (that.timeMsg === 0) {
            clearInterval(time);
            that.timeMsg = 59;
            that.isClick = true;
          }else{
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
        &.active{
          background: @themeColor;
          color: #fff;
        }
      }
    }

  }
</style>
