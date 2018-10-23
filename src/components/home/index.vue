<template lang="pug">
view-box(body-padding-bottom="53px")
  keep-alive
    router-view
  tabbar(
    slot="bottom"
    style="position:fixed;bottom:0;"
    v-model="index")
    tabbar-item(link="/home")
      span(
        slot="icon"
        class="iconfont icon-icon_home")
      span(slot="label") 主页
    tabbar-item(link="/home/order")
      span(
        slot="icon"
        class="iconfont icon-dingdan")
      span(slot="label") 订单
    tabbar-item(link="/home/user")
      span(
        slot="icon"
        class="iconfont icon-geren")
      span(slot="label") 我的
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      title: 'home',
      index: 0
    }
  }
}
</script>
