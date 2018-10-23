<template lang="pug">
  div(class="padding-block")
    cell-box(style="padding:0 0 10px 0")
      span(
        class="bg-success small-font text-center"
        style="border-radius:50%;display:inline-block;width:18px;height:18px;line-height:18px;margin:0 15px 0 0") {{backText}}
      b {{segments[0].departureTime.format('MM.DD dddd')}} {{segments[0].depCity}}-{{segments[segments.length-1].arrCity}}
    div(style="width:100%")
      div(
        v-for="(flight,index) in segments"
        :key="index"
        class="middle-font")
        flexbox(:gutter="15")
          flexbox-item(:span="0.0000001")
            flow(
              orientation="vertical"
              :style="{height:!flight.stopCities || flight.stopCities === '0'?'50px':'80px'}"
              style="padding:0")
              flow-state
              flow-line
              flow-state
              template(v-if="flight.stopCities && flight.stopCities !== '0'")
                flow-line
                flow-state
          flexbox-item(
            :span="2/14"
            style="line-height:2")
            p(class="text-overflow") {{flight.departureTime.format('HH:mm')}}
            p(
              class="middle-font text-warning"
              v-if="flight.stopCities && flight.stopCities !== '0'") 经停
            p {{flight.arriveTime.format('HH:mm')}}
          flexbox-item(
            :span="5/14"
            style="line-height:2")
            p(class="text-overflow") {{flight.depAirportCN}}
            p(
              class="text-muted"
              v-if="flight.stopCities && flight.stopCities !== '0'") {{flight.stopCities}}
            p(class="text-overflow") {{flight.arrAirportCN}}
          flexbox-item(class="text-right text-light small-font")
            p(
              class="icon-text-box"
              style="justify-content:flex-end")
              img(
                class="airline-icon"
                :src="flight.airlineIcon")
              span {{flight.airCompany}}
            p {{flight.flightNumber}}
            p {{flight.canbinClass | canbinFilter}}
        flexbox(
          :gutter="15"
          class="text-muted padding-vertical"
          v-if="index!==segments.length-1&&segments.length!==1")
          flexbox-item(
            :span="0.0000001"
            class="text-center text-warning") 转
          flexbox-item(:span="2/14") {{flight.transitCity}}
</template>

<script>
import { Flow, FlowState, FlowLine } from 'vux'

export default {
  name: 'FlightDetail',
  components: {
    Flow,
    FlowState,
    FlowLine
  },
  props: {
    segments: {
      type: Array,
      require: true
    },
    isBack: {
      type: Boolean,
      default: false
    },
    backText: {
      type: String,
      default: '去'
    }
  },
  filters: {
    canbinFilter (val) {
      if (val === 1) {
        return '经济舱'
      }
      if (val === 2) {
        return '商务舱'
      }
      if (val === 3) {
        return '头等舱'
      }
    }
  }
}
</script>
