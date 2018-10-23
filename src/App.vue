<template lang="pug">
  <div style="height:100%">
    <keep-alive include="PlaneSearch">
      <router-view />
    </keep-alive>
    loading(:show="pageLoading")
  </div>
</template>

<script>
export default {
  name: 'app',
  computed: {
    pageLoading () {
      return this.$store.state.loading
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
</style>

<style lang="sass">
  @import './assets/css/common.sass'

  body, .weui-tab
    background: #efefef

  body
    color: #333
</style>
