<template lang="pug">
popup(
  v-model="value"
  height="100%"
  style="background:#fff")
  popup-header(
    left-text="取消"
    title="选择日期"
    right-text="确定"
    @on-click-left="cancel"
    @on-click-right="confirm")
  group(title="去程")
    inline-calendar(
      v-model="startDate"
      disable-past)
  group(title="返程")
    inline-calendar(
      v-model="endDate"
      disable-past)
</template>

<script>
import moment from 'moment'
import { PopupHeader, InlineCalendar } from 'vux'

export default {
  name: 'DoubleCalendar',
  components: {
    InlineCalendar,
    PopupHeader
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    firstDate: {
      required: true,
      type: moment
    },
    secondDate: {
      required: true,
      type: moment
    }
  },
  data () {
    return {
      startDate: '',
      endDate: ''
    }
  },
  computed: {
    originStart () {
      return this.firstDate.format('YYYY-MM-DD')
    },
    originEnd () {
      return this.secondDate.format('YYYY-MM-DD')
    }
  },
  created () {
    this.startDate = this.originStart
    this.endDate = this.originEnd
  },
  methods: {
    cancel () {
      this.$emit('change', false)
      this.startDate = this.originStart
      this.endDate = this.originEnd
    },
    confirm () {
      this.$emit('change', false)
      this.$emit('update', this.startDate, this.endDate)
    }
  }
}
</script>
