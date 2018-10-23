<template lang="pug">
div
  nav.header
    img(src="../../assets/img/banner.jpg")
    div.nav
      flexbox(:gutter="0" style="text-align:center")
        flexbox-item
          router-link(to="/plane/search" tag="div")
            div.nav-item
              img(src="../../assets/img/plane.jpg")
            span 机票
        flexbox-item
          div.nav-item
            img(src="../../assets/img/train.jpg")
          span 火车票
        flexbox-item
          div.nav-item
            img(src="../../assets/img/hotel.jpg")
          span 酒店
  div(style="margin-top:45px;padding:0 15px;")
    card(
      :header="{title:'待出行机票'}"
      :footer="{title:'详情'}")
      div(slot="content"
          style="padding:10px;text-align:center")
        p 宁波 → 上海
        p.text-muted 2017-11-11 09:00:00
    card(
      :header="{title:'待出行机票'}"
      :footer="{title:'详情'}")
      div(slot="content" style="padding:10px;text-align:center")
        p 宁波 → 上海
        p.text-muted 2017-11-11 09:00:00
</template>

<script>
</script>

<style lang="sass">
nav.header
  position: relative

  img
    vertical-align: top

  .nav-item
    height: 40px
    padding: 0

.nav
  position: absolute
  right: 30px
  bottom: 0
  left: 30px
  padding: 5px 10px
  box-sizing: border-box
  transform: translateY(50%)
  background: #fff
  color: #999
  font-size: 12px
</style>
