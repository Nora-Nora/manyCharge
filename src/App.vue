<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  // 提供reload方法
  provide () {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      // isRouterAlive控制显示
      isRouterAlive: true
    }
  },
  methods: {
    // 页面刷新
    reload () {
      this.isRouterAlive = false;
      // 该方法会在dom更新后执行
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style>
  @import "assets/css/reset.css";
  #app {
    background: #F8F9FA;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
