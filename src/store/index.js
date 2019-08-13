import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //当前充电桩id
    chargingId: 0,
    //取消充电的弹出状态
    cancelChargePop: false,
    //充电桩故障弹出状态
    chargeBreakPop: false,
    //充值金额
    chargeMoney: 0,
    //支付方式
    payType:0,//0微信，1支付宝
    //已充电时长
    chargeTime: '1小时5分钟', //d
    //预计时间
    useTime: Number,
    //设备编号
    //deviceNum: '',
    //第一次扫描充电桩SN码
    deviceSN: '98CC4D200056',
    //订单编号
    orderNum:'',
    //是否含有未完成订单
    // haveOrder:false,
    // chargeEnd:false

  },
  mutations: {

  },
  actions: {

  },
  getters: {
    getMoney(state){
      return state.chargeMoney;
    }
  }
})
