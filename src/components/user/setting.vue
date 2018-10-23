<template lang="pug">
view-box(body-padding-top="46px")
  x-header(
    slot="header"
    title="设置"
    style="position:fixed;top:0;width:100%;z-index:100"
    :leftOptions="leftOptions")
  group
    x-switch(title="通知" v-model="notice")
    cell(title="关于" is-link)
    cell(title="建议" is-link)
  group(style="padding:0 10px")
    x-button(type="warn" @click.native="logout")
      span 注销
</template>

<script>
export default {
  name: 'setting',
  data () {
    return {
      leftOptions: {
        backText: ''
      },
      notice: false
    }
  },
  methods: {
    logout () {
      window.localStorage.removeItem('token')
      this.$router.replace('/')
    }
  }
}
</script>
