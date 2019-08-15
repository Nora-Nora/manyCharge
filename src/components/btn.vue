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
    width: 100%;
    a,div{
      text-align: center;
      font-size: 16px;
      color: #fff;
      width: 327px;
      line-height: 48px;
      background: @themeColor;
      border-radius: 4px;
      display: block;
      color: #fff;
      margin: 0 auto;
    }
  }
</style>
