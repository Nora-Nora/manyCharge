<template>
    <div class="btn">
      <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "btn"
    }
</script>

<style scoped lang="less">
  @import "~@/assets/style/common.less";
  .btn{
    text-align: center;
    width: 327px;
    line-height: 48px;
    color: #fff;
    font-size: 16px;
    margin: 0 auto;
    background: @themeColor;
    border-radius: 4px;
    a{
      display: block;
      width: 100%;
      height: 100%;
      color: #fff;
    }
  }
</style>
