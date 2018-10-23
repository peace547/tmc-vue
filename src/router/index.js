import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Home from '@/components/home/index'
import Order from '@/components/home/order'
import Product from '@/components/home/product'
import User from '@/components/home/user'
import Setting from '@/components/user/setting'
import PlaneSearch from '@/components/plane/plane-search'
import PlaneList from '@/components/plane/plane-list'
import PlaneDetail from '@/components/plane/plane-detail'
import PlaneOrder from '@/components/plane/plane-order'
import PersonList from '@/components/user/person-list'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: 'order',
          component: Order
        },
        {
          path: 'user',
          component: User
        },
        {
          path: '',
          component: Product
        },
        {
          path: 'setting',
          component: Setting
        }
      ]
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/plane/search',
      component: PlaneSearch
    },
    {
      path: '/plane/list',
      component: PlaneList
    },
    {
      path: '/plane/detail',
      component: PlaneDetail
    },
    {
      path: '/plane/order',
      component: PlaneOrder
    },
    {
      path: '/user/personList',
      component: PersonList
    },
    {
      path: '*',
      redirect: '/login'
    }
  ],
  mode: 'history'
})
