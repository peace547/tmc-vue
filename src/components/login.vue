<template lang="pug">
view-box
  group(style="margin: 0 10px;")
    x-input(
      title="用户名"
      :show-clear="true"
      v-model="username")
    x-input(
      title="密码"
      type="password"
      :show-clear="true"
      v-model="password")
  group(style="padding-left: 10px;padding-right: 10px")
    x-button(
      type="primary"
      @click.native="submit") 登录
</template>

<script>
import _find from 'lodash/find'
export default {
  name: 'login',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  created () {
    if (window.localStorage.getItem('token')) {
      this.$router.replace('/home')
    }
  },
  methods: {
    submit () {
      if (this.username === '') {
        this.$vux.toast.text('请填写账户')
        return
      }

      if (this.password === '') {
        this.$vux.toast.text('请填写密码')
        return
      }

      this.$store.commit('loading', true)

      return this.$http
        .get('http://localhost:8080/static/data.json')
        .then(data => {
          let user = {
            username: this.username,
            password: this.password
          }
          if (_find(data.user, user)) {
            window.localStorage.setItem('token', JSON.stringify(user))
            setTimeout(() => {
              this.$router.replace('/home')
              this.$store.commit('loading', false)
            }, 1000)
          } else {
            this.$store.commit('loading', false)
            this.$vux.toast.text('账号或密码有误')
          }
        })
        .catch(() => {
          this.$store.commit('loading', false)
        })
    }
  }
}
</script>
