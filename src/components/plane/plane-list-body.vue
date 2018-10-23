<template lang="pug">
div(
  style="box-sizing:border-box"
  :style="style")
  group(
    :gutter="5"
    v-for="(item, index) in showList"
    :key="item.id"
    :item-id="item.id"
    @click.native="trigger(item)")
    div(
      style="display:flex;align-items:center"
      class="padding-block flight-line-box")
      div(style="flex:0 1 70%")
        flight-line(
          :segments="item.fromSegments"
          :backText="isBack?'去':''")
        flight-line(
          v-if="isBack"
          :isBack="true"
          :segments="item.retSegments"
          backText="返")
      div(
        style="flex:1 0 auto"
        class="text-danger small-font text-right")
        span(
          style="border:1px solid #E74C3C;padding:1px;margin-right:5px;border-radius:2px"
          v-if="item.minSeat<10") {{item.minSeat}}张
        span ￥
        span(class="h1") {{item.adultPrice+item.adultTax}}
        p(class="text-muted") 含税价
</template>

<script>
import FlightLine from './flight-line'

export default {
  name: 'PlaneListBody',
  components: {
    FlightLine
  },
  props: {
    list: {
      type: Array,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    remain: {
      type: Number,
      required: true
    },
    isBack: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showList: [],
      lastPage: 0,
      paddingTop: 0
    }
  },
  watch: {
    list (v) {
      this.showList = this.list.slice(0, this.remain * 3)
      this.paddingTop = 0
      this.lastPage = 0
      this.lastTop = 0

      if (this.$el.parentNode) {
        this.$el.parentNode.scrollTop = 0
      }
    }
  },
  computed: {
    style () {
      return {
        paddingTop: this.paddingTop + 'px',
        height: this.list.length * this.height + 'px'
      }
    },
    pageHeight () {
      return this.height * this.remain
    },
    totalPage () {
      return Math.floor(this.list.length / this.remain)
    }
  },
  methods: {
    trigger (item) {
      this.$emit('click', item)
    },
    setData (top) {
      const page = Math.floor(top / this.pageHeight)

      if (page === this.lastPage) return

      this.lastPage = page

      if (page >= 1 && page <= this.totalPage - 1) {
        this.showList = this.list.slice((page - 1) * this.remain, (page + 2) * this.remain)
        this.paddingTop = (page - 1) * this.remain * this.height
      }
    }
  }
}
</script>
