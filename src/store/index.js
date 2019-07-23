import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //当前充电桩id
    chargeId: 0,
    //取消充电的弹出状态
    cancelChargePop: false,
    //充电桩故障弹出状态
    chargeBreakPop: false,
    //充值金额
    chargeMoney: 0,
    //已充电时长
    chargeTime: '1小时5分钟',
    //预计时间
    estimateTime: '',
    //已充电百分数
    chargePercent: 43,
    //设备编号
    deviceNum: 'CDZ001',
    //充电桩SN码
    deviceSN: '98CC4D200056'
  },
  mutations: {
    getEstimate(state) {
      if (state.chargeMoney > 0) {
        let money = state.chargeMoney;
        let time = money / 0.8;
        //向上取整获取小时数
        let hour = Math.floor(time);
        //获取分钟数
        let minute = Math.round((time - hour) * 60);
        state.estimateTime = `${hour}小时${minute}分钟`;
      } else {
        state.estimateTime = '';
      }

    }
  },
  actions: {},
  getters: {}
})
