<template lang="pug">
view-box(
  :body-padding-top="$store.state.showHeader ? '46px' : '0'"
  body-padding-bottom="46px")
  x-header(
    v-if="$store.state.showHeader"
    :left-options="leftOptions"
    :title="header"
    style="position:fixed;top:0;left:0;width:100%;z-index:100")
  group
    flight-detail(
      :segments="fromFlights"
      backText="去"
    )
    flight-detail(
      v-if="ifBack"
      :segments="retFlights"
      backText="返"
    )
    cell-box
      div(class="text-muted" style="width:100%")
        flexbox(
          :gutter="0"
          class="small-font"
          align="flex-start")
          flexbox-item(
            :span="2/10"
            class="text-success") 入境须知
          flexbox-item 商务、旅游等类型的短期签证需持有返程票，建议购买往返票或持有返程票，以免无法办理乘机和出境手续。
        flexbox(
          :gutter="0"
          class="small-font"
          align="flex-start")
          flexbox-item(
            :span="2/10"
            class="text-success") 行李托运
          flexbox-item 厦门：行李非直达，需在中转机场重新托运。
    cell(
      class="middle-font"
      title="退改详情/行李说明"
      is-link
      @click.native="showPolicy=true")
  flexbox(
    slot="bottom"
    :gutter="0"
    style="position:fixed;bottom:0;line-height:46px;z-index:999")
    flexbox-item(
      class="text-center"
      style="background: #fff")
      b ￥{{totalAdultPrice}}
    flexbox-item
      div(
        @click="nextStep"
        class="text-center bg-highlight") 预定
  popup(
    v-model="showPolicy"
    height="100%"
    :show-mask="false"
    @click.native="showPolicy=false")
    view-box(
      body-padding-top="0px"
      body-padding-bottom="46px")
      div(
        slot="default"
        class="bg-tips"
        style="background:#fff;")
        div(class="padding-block")
          span 价格说明
          div
            x-table(
              full-bordered
              class="small-font"
              style="line-height:30px;")
              tr
                td(width="30%") 乘客类型
                td 单价
                td 税费
                td 总计
              tr
                td 成人
                td {{flightData.adultPrice}}
                td {{flightData.adultTax}}
                td {{totalAdultPrice}}
              tr
                td 儿童
                td {{flightData.childPrice}}
                td {{flightData.childTax}}
                td {{totalChildPrice}}
        flight-policy(
          :rule="flightData.rule"
          :ifDomestic="ifDomestic"
        )
        div(class="padding-block" v-if="flightData.rule.other")
          span 预定说明
          p(class="text-muted small-font") {{flightData.rule.other}}
</template>

<script>
import moment from 'moment'
import FlightDetail from '@/components/common/flight-detail'
import FlightPolicy from '@/components/common/flight-policy'

export default {
  name: 'PlaneDetail',
  components: {
    FlightDetail,
    FlightPolicy
  },
  data () {
    return {
      leftOptions: {
        backText: ''
      },
      flightData: {},
      fromFlights: [],
      retFlights: [],
      showPolicy: false,
      ifDomestic: true
    }
  },
  created () {
    this.flightData = this.$popStash()
    if (this.flightData.fromSegments[0].depCountryCode === 'CN' && this.flightData.fromSegments[this.flightData.fromSegments.length - 1].arrCountryCode === 'CN') {
      this.ifDomestic = true
    } else {
      this.ifDomestic = false
    }
    this.fromFlights = this.flightData.fromSegments
    this.retFlights = this.flightData.retSegments
    this.fromFlights.forEach((item, index) => {
      item.departureTime = moment(item.depTime, 'YYYYMMDDHHmm')
      item.arriveTime = moment(item.arrTime, 'YYYYMMDDHHmm')
    })
    this.retFlights.forEach((item, index) => {
      item.departureTime = moment(item.depTime, 'YYYYMMDDHHmm')
      item.arriveTime = moment(item.arrTime, 'YYYYMMDDHHmm')
    })
  },
  computed: {
    header () {
      return this.$route.query.fromCityName + (+this.$route.query.ifBack ? ' ⇌ ' : ' → ') + this.$route.query.toCityName
    },
    totalAdultPrice () {
      return this.flightData.adultPrice + this.flightData.adultTax
    },
    totalChildPrice () {
      return this.flightData.childPrice + this.flightData.childTax
    },
    ifBack () {
      return this.retFlights.length
    }
  },
  methods: {
    nextStep () {
      this.$pushStash(this.flightData)
      this.$router.push({
        path: '/plane/order',
        query: this.$route.query
      })
    }
  }
}
</script>
