<template>
  <div class="phoneCheck">
    <form action="#">
      <div class="phoneNum">
        <span class="checkText">手机号码</span><br>
        <input type="number" v-model="userData.phone" v-focus>
      </div>
      <div class="checkCode">
        <span class="checkText">短信验证</span><br>
        <input type="text" v-model.trim="yzCode">
        <span class="getCode" @click="getCode" v-show="isClick">获取验证码</span>
        <span class="getCode" v-show="!isClick">{{ timeMsg }}s</span>
      </div>
      <input type="button" :class="{active:submitStatus}" id="submit" value="登录" @click="loginOn">
    </form>
    <tips v-slot:tipContent v-show="tipsPop">
      <div class="tipContent">
        <div class="text">{{toastMsg}}</div>
        <ul>
          <li class="sure"><router-link to="/payWait/new">查看订单</router-link></li>
        </ul>
      </div>
    </tips>
  </div>
</template>

<script>
  import tips from '@/components/popBox'
    export default {
        name: "phoneCheck",
        components:{
            tips
        },
        data() {
            return {
                isClick: true,
                //phoneNum: '',
                timeMsg: 59,
                yzCode: '',
                //第一次扫描充电桩二维码sn信息
                deviceSN: this.$store.state.deviceSN,
                submitStatus: false,
                tipsPop:false,
                toastMsg:''
            }
        },
        props: ['userData'],
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
                                deviceSN: this.deviceSN, phone: this.userData.phone, code: this.yzCode
                            }
                        }).then(res => {
                            if (res.code == '200') {
                                //console.log(res);
                                this.userData.phone = res.data.phone;
                                //存储用户登录信息到localStorage
                                let userData = res.data;
                                window.localStorage.setItem('userData', JSON.stringify(userData));
                                //获取用户未完成订单
                                this.sendHttp({
                                    url: this.baseUrl + '/order/getUnfinishedOrder', method: 'post',
                                    data: {
                                        id: userData.userId
                                    }
                                }).then(res => {
                                    if (res.code == '200') {
                                        //是否有未完成订单
                                        if (res.data.haveOrder) {
                                            //有未完成支付的订单
                                            let orderData = res.data.orderInfo;
                                            window.sessionStorage.setItem('orderData',JSON.stringify(orderData));
                                            if (orderData.type === 0) {
                                                this.tipsPop = true;
                                                this.toastMsg = '目前您还有未完成的订单';
                                            } else {
                                                if (orderData.type === 4) {
                                                    //充电桩正在使用
                                                    this.$vux.toast.text('存在未结束订单');
                                                } else if (orderData.type === 6) {
                                                    //设备异常
                                                    this.$vux.toast.text('设备异常，请及时取消订单');
                                                }
                                                window.sessionStorage.setItem('orderData', JSON.stringify(orderData));
                                                this.$router.push({path: '/chargeDetail/infor'});
                                            }
                                        } else {
                                            //没有未完成订单
                                            this.$router.push({path: '/'});
                                        }
                                    }
                                });
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
                if (!/^1(3|4|5|7|8|9)[0-9]{9}$/.test(this.userData.phone)) {
                    this.$vux.toast.text('手机号输入有误');
                    return false
                } else {
                    return true
                }
            },
            //发送验证码
            sendCode() {
                //点击获取验证码之后，就使按钮转为已点击状态，静止用户多次点击。
                //先判断当前页面获取验证码用户是否已点击
                if (this.isClick == true) {
                    this.isClick = false;
                    this.timeDown();
                    this.$vux.toast.text('发送成功！');
                    this.sendHttp({
                        url: this.baseUrl + '/index/sendSMS',
                        method: 'get',
                        data: {phone: this.userData.phone}
                    }).then(res => {
                        console.log(res);
                        if (res.code == 200) {
                            //console.log('发送成功！');
                        }
                    });
                }
            }
        }

    }
</script>

<style scoped lang="less">
  @import "~@/assets/style/common.less";

  .tipContent {
    font-size: 16px;
    text-align: center;

    .text {
      padding-top: 80px;
      padding-bottom: 48px;
    }

    ul {
      margin: 0 24px;
      height: 48px;
      display: flex;
      justify-content: center;
      margin-bottom: 30px;

      li {
        width: 260px;
        line-height: 48px;
        border-radius: 4px;

        &.cancel {
          border: 1px solid @themeColor;
          color: @themeColor;
        }

        &.sure {
          background: @themeColor;
          a{
            display: block;
            width: 100%;
            height: 100%;
            color: #fff;
          }
        }
      }
    }
  }
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
        color: #000;
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
