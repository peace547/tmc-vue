// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import moment from 'moment'
import axios from 'axios'
import qs from 'qs'
import Polyfill from './polyfill'

import {
  XHeader,
  Tabbar,
  TabbarItem,
  ViewBox,
  Scroller,
  ButtonTab,
  ButtonTabItem,
  Group,
  Cell,
  Calendar,
  XButton,
  XSwitch,
  Popup,
  PopupPicker,
  Flexbox,
  FlexboxItem,
  Tab,
  TabItem,
  Divider,
  Card,
  Grid,
  GridItem,
  LoadMore,
  XTable,
  CellBox,
  XInput,
  Checker,
  CheckerItem,
  ToastPlugin,
  LoadingPlugin,
  Checklist,
  ConfirmPlugin,
  FormPreview,
  CheckIcon,
  XDialog,
  AlertPlugin,
  Selector,
  Confirm,
  Datetime,
  Search,
  Swipeout,
  SwipeoutItem,
  SwipeoutButton,
  AjaxPlugin,
  Loading,
  Flow,
  FlowState,
  FlowLine
} from 'vux'

Vue.use({
  install: vue => {
    let deps = {
      XHeader,
      Tabbar,
      TabbarItem,
      ViewBox,
      Scroller,
      ButtonTab,
      ButtonTabItem,
      Group,
      Cell,
      Calendar,
      XButton,
      XSwitch,
      Popup,
      PopupPicker,
      Flexbox,
      FlexboxItem,
      Tab,
      TabItem,
      Divider,
      Card,
      Grid,
      GridItem,
      LoadMore,
      XTable,
      CellBox,
      XInput,
      Checker,
      CheckerItem,
      ToastPlugin,
      LoadingPlugin,
      Checklist,
      ConfirmPlugin,
      FormPreview,
      CheckIcon,
      XDialog,
      AlertPlugin,
      Selector,
      Confirm,
      Search,
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      Datetime,
      AjaxPlugin,
      Loading,
      Flow,
      FlowState,
      FlowLine
    }

    for (let i in deps) {
      if (/Plugin$/.test(i)) {
        vue.use(deps[i])
      } else {
        vue.component(i, deps[i])
      }
    }
  }
})

Vue.use(Polyfill)

moment.locale('zh-CN', {
  weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
})

const FastClick = require('fastclick')
FastClick.attach(document.body)

Vue.http.defaults.baseURL = 'https://weixin.iflying.com/flights/'

Vue.http.interceptors.response.use(
  res => {
    if (res.data.result === 1) {
      return res.data.data
    } else {
      const message = res.data.cause

      Vue.$vux.toast.text(message, 'top')

      return Promise.reject(message)
    }
  },
  err => {
    const message = err.message

    Vue.$vux.toast.text(message, 'top')

    return Promise.reject(message)
  }
)

// 接口配置
function requestInterceptor (config) {
  if (config.method === 'post' && config.headers.post['Content-Type'] === 'application/x-www-form-urlencoded') {
    config.data = qs.stringify(config.data)
  }
  return config
}

axios.interceptors.request.use(
  config => {
    return requestInterceptor(config)
  },
  err => {
    return Promise.reject(err)
  }
)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
