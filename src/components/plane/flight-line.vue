<template lang="pug">
div(class="text-center flight-line")
  div(style="margin-right:10px" v-if="backText")
    div(
      class="small-font bg-success"
      style="border-radius: 50%;width:18px;height:18px;line-height:18px;color:#fff;") {{backText}}
  div(style="width:100%")
    div(
      class="flight-line-info"
      style="margin-bottom:4px")
      div(
        class="text-left"
        style="width:30%")
        p(class="h1") {{segments[0].depTime|timeFilter}}
        p(class="small-font text-overflow text-muted") {{segments[0].depAirportCN}}
      div(style="position:relative;flex:1 1 0")
        p(class="icon-arrow-line")
        span(
          style="position:absolute;bottom:-18px;transform:translateX(-50%)"
          class="small-font text-warning") {{transition}}
        span(
          style="position:absolute;top:-18px;transform:translateX(-50%)"
          class="small-font text-warning") {{segments | flyingTime}}
      div(
        class="text-right"
        style="width:30%")
        p(class="h1") {{segments[segments.length-1].arrTime|timeFilter}}
        p(class="small-font text-overflow text-muted") {{segments[segments.length-1].arrAirportCN}}
    div(class="text-light small-font icon-text-box")
      img(
        class="airline-icon"
        :src="segments[0].airlineIcon")
      span {{airCompanies}}
</template>

<script>
import _uniqBy from 'lodash/uniqBy'

export default {
  name: 'FlightLine',
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
      default: ''
    }
  },
  computed: {
    transition () {
      const length = this.segments.length

      if (length > 2) {
        return `转${this.segments.length - 1}次`
      } else if (length > 1) {
        return `转${this.segments[0].transitCity}`
      } else if (this.segments[0].stopCities !== '0') {
        return `经${this.segments[0].stopCities}`
      } else {
        return ''
      }
    },
    airCompanies () {
      const airCompanies = _uniqBy(this.segments.map(v => v.airCompany))

      if (airCompanies.length > 1) {
        return `${airCompanies[0]}...等`
      } else {
        return airCompanies[0]
      }
    }
  },
  filters: {
    timeFilter (time) {
      return time.substr(8).substr(0, 2) + ':' + time.substr(8).substr(2)
    },
    flyingTime (flight) {
      let totalTime = 0
      if (flight[0].duration) {
        flight.forEach(item => {
          totalTime += item.duration
        })
        return Math.floor(totalTime / 60) + 'h' + (totalTime % 60 === 0 ? '' : totalTime % 60 + 'm')
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.flight-line
  display: flex
  align-items: center

  + .flight-line
    margin-top: 4px

.flight-line-info
  display: flex
  align-items: center
  width: 100%

.icon-arrow-line
  position: absolute
  top: 50%
  left: 10%
  width: 80%
  transform: translateY(-50%)

.icon-arrow-line:before
  content: ''
  position: absolute
  left: 0
  top: 0
  width: 100%
  height: 1px
  background: #ccc

.icon-arrow-line:after
  content: ''
  position: absolute
  right: 0
  bottom: -1px
  width: 0
  height: 0
  border-style: solid
  border-width: 5px 5px 5px 0
  border-color: transparent transparent #ccc
</style>
