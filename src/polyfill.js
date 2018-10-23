import router from './router'
import store from './store'

const ua = window.navigator.userAgent

let device = process.env.npm_config_device || (ua.indexOf('Safari') >= 0 ? 'web' : ua.indexOf('Android') >= 0 ? 'android' : 'ios')

window._handlers = {}

function getItem (key) {
  if (device === 'ios') {
    return new Promise(function (resolve, reject) {
      const handler = `__handler${new Date().getTime()}`

      window._handlers[handler] = function (data) {
        if (data) {
          resolve(JSON.parse(data))
        } else {
          resolve('')
        }

        delete window._handlers[handler]
      }

      window.webkit.messageHandlers.NativeMethod.postMessage(JSON.stringify({
        'action': 'getData',
        'key': key,
        'callback': `window._handlers['${handler}']`
      }))
    })
  } else {
    return new Promise(function (resolve, reject) {
      resolve(JSON.parse(window.localStorage.getItem(key)))
    })
  }
}

function setItem (key, value) {
  if (device === 'ios') {
    window.webkit.messageHandlers.NativeMethod.postMessage(JSON.stringify({
      'action': 'saveData',
      'key': key,
      'value': JSON.stringify(value)
    }))
  } else {
    window.localStorage.setItem(key, JSON.stringify(value))
  }
}

// 兼容app webView框架 上同
if (device === 'ios') {
  store.commit('hideHeader')

  router.beforeEach((to, from, next) => {
    if (from.path === '/') {
      if (to.path === '/plane/search') {
        next()
      } else {
        getItem('flight_stash')
          .then(data => {
            if (data) {
              window.localStorage.setItem('flight_stash', JSON.stringify(data))
            }
            next()
          })
      }
    } else if (from.path === to.path) {
      next()
    } else {
      let title = 'Null'

      if (typeof to.meta.title === 'string') {
        title = to.meta.title
      } else if (typeof to.meta.title === 'function') {
        title = to.meta.title(to.query)
      }

      window.webkit.messageHandlers.NativeMethod.postMessage(JSON.stringify({
        title: title,
        url: window.location.origin + router.options.base + to.fullPath.replace('/', ''),
        isShare: 0,
        shareImg: ''
      }))

      next(false)
    }
  })
}

export default {
  install (Vue) {
    Vue.prototype.$pushStash = function (data) {
      setItem('flight_stash', data)
    }

    Vue.prototype.$popStash = function () {
      return JSON.parse(window.localStorage.getItem('flight_stash'))
    }
  }
}
