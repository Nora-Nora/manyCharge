<template>
  <div class="chargeEnd">
    <top-back>充电详情</top-back>
    <detail-head />
    <end-infor />
  </div>
</template>

<script>
  import topBack from '@/components/topBack'
  import detailHead from './components/detailHead'
  import endInfor from './components/endInfor'
  export default {
    name: "chargeEnd",
    components:{
      topBack,
      detailHead,
      endInfor
    }
  }
</script>

<style scoped lang="less">

</style>
