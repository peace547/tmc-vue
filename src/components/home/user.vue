<template lang="pug">
view-box(
  body-padding-top="46px"
  body-padding-bottom="0")
  x-header(
    slot="header"
    title="我的"
    :leftOptions="leftOptions"
    style="position:absolute;top:0;width:100%;z-index:10")
    router-link(
      slot="right"
      tag="span"
      to="/home/setting"
      class="iconfont icon-shezhi1")
  div(slot="default")
    group
      cell-box(is-link)
        flexbox
          flexbox-item(style="flex:0 0 48px")
            div.avatar
              img(:src="avatar")
          flexbox-item(style="flex:1 1 100%")
            div {{name}}
    group
      //- cell(is-link)
      //-   div(slot="title")
      //-     flexbox
      //-       flexbox-item(:span="2/12")
      //-         span(class="iconfont icon-icon-p_lianxirenguanli")
      //-       flexbox-item(:span="10/12") 联系人管理
      cell(
        link="/user/personList"
        is-link)
        div(slot="title")
          flexbox
            flexbox-item(:span="2/12")
              span(class="iconfont icon-renyuanguanli")
            flexbox-item(:span="10/12") 人员管理
      router-view
</template>

<script>
export default {
  name: 'user',
  data () {
    return {
      leftOptions: {
        showBack: false
      },
      name: '',
      avatar: ''
    }
  },
  created () {
    this.$store.commit('loading', true)
    this.name = 'lhp'
    this.avatar = 'https://tva2.sinaimg.cn/crop.0.1.640.640.180/a609fd2djw8fbxfofl71pj20hs0hvdgk.jpg'
    this.$store.commit('loading', false)
    // this.$http.get('/getUserInfo')
    //   .then(data => {
    //     this.$store.commit('loading', false)

    //     this.name = data.name
    //     this.avatar = data.avatar
    //   })
    //   .catch(() => {
    //     this.$store.commit('loading', false)
    //   })
  }
}
</script>

<style scoped lang="sass">
  .avatar
    width: 48px
    height: 48px
  img
    width: 100%
    height: 100%
    vertical-align: top
</style>
