<template lang="pug">
  div
    div(class="padding-block")
      span 退改签说明
      div(v-if="rule")
        x-table(
          full-bordered
          class="small-font"
          style="line-height:30px;")
          tr(v-if="!rule.hasRefund")
            td(width="30%") 退票手续费
            td(colspan="2") 不支持退票
          template(v-if="ifDomestic")
            tr(
              v-if="rule.hasRefund"
              v-for="(item, index) in rule.refund"
              :key="item.explain")
              td(
                :rowspan="rule.refund.length"
                width="30%"
                v-if="index === 0") 退票手续费
              td {{item.explain}}
              td
                span {{item.amount===-1?'不提供退票费用':item.amount}}
                span(v-if="item.status==='E'") ，按航空公司规定
            tr(v-if="!rule.hasChange")
              td 改签手续费
              td(colspan="2") 不支持改签
            tr(
              v-if="rule.hasChange"
              v-for="(item, index) in rule.change"
              :key="index")
              td(
                :rowspan="rule.change.length"
                width="30%"
                v-if="index === 0") 改签手续费
              td {{item.explain}}
              td
                span {{item.amount===-1?'不提供改签费用':item.amount}}
                span(v-if="item.status==='E'") ，按航空公司规定
          template(v-else)
            tr(
              v-if="rule.hasRefund"
              v-for="(item, index) in refundRules"
              :key="item.explain")
              td(
                :rowspan="refundRules.length"
                width="30%"
                v-if="index === 0") 退票手续费
              td {{item[0]}}
              td {{item[1]}}
            tr(v-if="!rule.hasEndorse")
              td 改签手续费
              td(colspan="2") 不支持改签
            tr(
              v-if="rule.hasEndorse"
              v-for="(item, index) in endorseRules"
              :key="index")
              td(
                :rowspan="endorseRules.length"
                width="30%"
                v-if="index === 0") 改签手续费
              td {{item[0]}}
              td {{item[1]}}
            tr(v-if="!ifDomestic&&!rule.endorsement")
              td 签转手续费
              td(colspan="2") 不支持签转
    div(class="padding-block")
      span 行李额说明
      p(
        class="small-font text-muted"
        v-if="rule") {{rule.hasBaggage?'可以':'不提供'}}免费托运行李额.
        span(v-if="rule.hasBaggage" v-for="bag in baggageRules") {{bag.count ? bag.count + '件' + bag.weight + 'kg' : '按航空公司规定'}}

</template>

<script>
import { XTable } from 'vux'

export default {
  name: 'FlightPolicy',
  components: {
    XTable
  },
  props: {
    rule: {
      type: Object,
      require: true
    },
    ifDomestic: {
      type: Boolean,
      require: true
    }
  },
  data () {
    return {
      baggageRules: [],
      refundRules: [],
      endorseRules: []
    }
  },
  created () {
    if (this.rule) {
      this.baggageRules = this.formatBaggage(this.rule.baggage)
      if (!this.ifDomestic) {
        this.refundRules = this.formatRule(this.rule.refund)
        this.endorseRules = this.formatRule(this.rule.endorse)
      }
    }
  },
  methods: {
    formatRule (rule) {
      const result = []
      const ruleArr = rule.split('-')
      let str = ''
      for (let i = 0; i < ruleArr.length - 1; i += 2) {
        str = `起飞前${ruleArr[i + 1]}`

        if (ruleArr[i - 1] === undefined) {
          result.push([str + '小时外', ruleArr[i]])
        } else {
          result.push([`${str}小时至${ruleArr[i - 1]}小时`, ruleArr[i]])
        }
      }
      str = ruleArr.pop()
      if (str === '*') {
        result.push(['起飞后', '不允许'])
      } else if (str === '') {
        result.push(['起飞后', '按航空公司规定'])
      }
      return result
    },
    formatBaggage (rule) {
      const result = []
      const ruleArr = rule.split(';')
      ruleArr.forEach(item => {
        if (item === '-') {
          result.push({count: 0, weight: 0})
        } else {
          result.push({count: item.split('-')[0], weight: item.split('-')[1]})
        }
      })
      return result
    }
  },
  filters: {
    ruleFilter (val) {
      if (val === 'T') {
        return '不可退'
      }
      if (val === 'H') {
        return '有条件退'
      }
      if (val === 'F') {
        return '免费退'
      }
      if (val === 'E') {
        return '按航空公司规定'
      }
    }
  }
}
</script>
