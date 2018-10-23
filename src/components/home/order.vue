<template lang="pug">
  view-box(body-padding-top="90px" body-padding-bottom="0")
    div(style="position:absolute;top:0;width:100%;z-index:10")
      x-header(
        :left-options="{backText: ''}") 订单列表
      tab
        tab-item(selected
          @on-item-click="onItemClick")
          div(class="vux-1px-r card-demo-content01") 全部
        tab-item(@on-item-click="onItemClick")
          div(class="vux-1px-r card-demo-content01") 待付款
        tab-item(@on-item-click="onItemClick")
          div(class="vux-1px-r card-demo-content01") 处理中
        tab-item(@on-item-click="onItemClick")
          div(class="card-demo-content01") 已成功
    scroller(
      lock-x
      height="-90"
      use-pulldown
      use-pullup
      @on-pullup-loading="loadMore"
      @on-pulldown-loading="refresh"
      v-model="status"
      ref="orderUnit")
      div
        group(:gutter="10" v-for="item in orderList" :key="item.orderID")
          cell-box(is-link)
            div(class="order_imgdiv")
              i(class="iconfont icon-feiji")
            div(class="order_condiv ")
              div(class="ft14 mb5") {{item.DepartureCity}} → {{item.ArrivalCity}}
              div(class="ft12 mb5 color6") {{item.FlightNumber}}
              div(class="ft12 mb5 color6") 出发时间: {{item.DepartureDate}}
            div(style="width:15%;text-align:right" class="ft12")
              div(class="colorF0 mb5") ￥{{item.Price}}
              div(class="ft12 mb5 green_txt") {{item.state}}
</template>

<script>
export default {
  data () {
    return {
      n: 6,
      orderType: 0,
      status: {
        pullupStatus: 'default',
        pulldownStatus: 'default'
      },
      orderList: []
    }
  },
  mounted () {
    this.$store.commit('loading', true)
    this.refresh()
  },
  methods: {
    loadMore () {
      this.$store.commit('loading', true)
      setTimeout(() => {
        let index = this.orderType
        let orderState = index === 0 ? '订票成功' : (index === 1 ? '待处理' : (index === 2 ? '处理中' : '已成功'))
        let i = this.n
        this.n += 6
        for (; i < this.n; i++) {
          let _newOrder = {
            DepartureCity: '宁波',
            ArrivalCity: '威海',
            FlightNumber: '长龙航班 GJ8867',
            DepartureDate: '2017-04-21',
            Price: 666,
            state: orderState,
            orderID: i
          }
          this.orderList.push(_newOrder)
        }
        this.$nextTick(() => {
          this.$refs.orderUnit.donePullup()
          this.$store.commit('loading', false)
        })
      }, 1000)
    },
    refresh () {
      let index = this.orderType
      setTimeout(() => {
        this.orderList = []
        let orderState = index === 0 ? '订票成功' : (index === 1 ? '待处理' : (index === 2 ? '处理中' : '已成功'))
        this.n = 6
        for (let i = 0;
          i < this.n;
          i++) {
          let _newOrder = {
            DepartureCity: '宁波',
            ArrivalCity: '威海',
            FlightNumber: '长龙航班 GJ8867',
            DepartureDate: '2017-04-21',
            Price: 1605,
            state: orderState,
            orderID: i
          }
          this.orderList.push(_newOrder)
        }
        this.$nextTick(() => {
          this.$refs.orderUnit.donePulldown()
          this.$store.commit('loading', false)
        })
      }, 1000)
    },
    onItemClick (index) {
      this.$store.commit('loading', true)
      this.orderType = index
      setTimeout(() => {
        this.orderList = []
        let orderState = index === 0 ? '订票成功' : (index === 1 ? '待处理' : (index === 2 ? '处理中' : '已成功'))
        this.n = 6
        for (let i = 0;
          i < this.n;
          i++) {
          let _newOrder = {
            DepartureCity: '宁波',
            ArrivalCity: '威海',
            FlightNumber: '长龙航班 GJ8867',
            DepartureDate: '2017-04-21',
            Price: 1605,
            state: orderState,
            orderID: i
          }
          this.orderList.push(_newOrder)
        }
        this.$nextTick(() => {
          this.$refs.orderUnit.reset({
            top: 0
          })
          this.$store.commit('loading', false)
        })
      }, 1000)
    }
  }
}

</script>

<style lang="sass">
  .card-demo-content01
    height: 20px
    margin: 10px 0
    line-height: 24px

  .order_imgdiv
    width: 8%

  .order_condiv
    width: 73%

  .color6
    color: #666

  .colorF0
    color: #FF0000

  .green_txt
    color: #22ac38

  .ft14
    font-size: 14px

  .ft12
    font-size: 12px

  .mb5
    margin-bottom: 5px

  .mb0
    margin-top: 0px

  .mbt10
    margin-top: 10px

  .pad0
    padding: 0px

  .pat10
    padding-top: 10px

  .odh
    margin-top: 10px
    padding-top: 10px
    border-top: 1px solid #D9D9D9

</style>
