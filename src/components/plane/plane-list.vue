<template lang="pug">
view-box(
  :body-padding-top="$store.state.showHeader ? '46px' : '0'"
  body-padding-bottom="0px")
  x-header(
    v-if="$store.state.showHeader"
    :left-options="leftOptions"
    :title="header"
    style="position:fixed;top:0;left:0;width:100%;z-index:100")
  div(class="plane-list-content")
    div(class="plane-list-header")
      template(v-if="ifBack")
        flexbox(
          v-if="ifBack"
          align="center"
          :gutter="0"
          class="text-center padding-block"
          style="width: 60%;margin: 0 auto"
          @click.native="showDate = !showDate")
          flexbox-item(:span="2/5")
            p.middle-font {{fromDate.format('MM-DD dddd')}}
          flexbox-item(:span="1/5")
            b.ion-chevron-down
          flexbox-item(:span="2/5")
            p.middle-font {{backDate.format('MM-DD dddd')}}
        double-calendar(
          :first-date="fromDate"
          :second-date="backDate"
          v-model="showDate"
          @update="changeDate")
      template(v-else)
        flexbox(
          :gutter="0"
          class="text-center small-font padding-horizontal")
          flexbox-item(id="date-list")
            div(class="date-list")
              div(
                class="date-list-item"
                :class="{'bg-highlight': item.date === fromDate}"
                v-for="item in dateList"
                @click="changeDate(item.date)")
                p {{item.weekday}}
                p {{item.day}}
          flexbox-item(
            style="flex:0 0 36px"
            @click.native="showDate = !showDate")
            p(
              class="icon-rili iconfont"
              style="line-height:1")
            p 日历
        popup(v-model="showDate")
          inline-calendar(
            :value="fromDate.format('YYYY-MM-DD')"
            @on-change="v => {showDate=false;changeDate(v)}")
      div(
        class="text-center text-muted middle-font"
        style="line-height:24px;box-shadow: 0 2px 3px -1px #dcdcdc;background:#fff;position:relative;z-index:1") 航班起降均为当地时间
    div(class="plane-list-body")
      pull-to(
        :top-load-method="pulldown"
        @scroll="onScroll"
        :distance-index="4"
        :top-config="{loadedStayTime:0}")
        template(
          slot="top-block"
          slot-scope="props")
          div(
            class="text-center pullto-wrapper"
            :class="{ 'trigger': props.state === 'trigger' }")
            span(
              v-show="props.state !== 'loading'"
              class="ion-arrow-down-a text-muted h1")
        div(
          class="text-center middle-font text-muted padding-vertical"
          v-if="noData") 暂无数据
        plane-list-body(
          :list="curList"
          :isBack="!!ifBack"
          :height="itemHeight"
          :remain="limit"
          ref="listBody"
          @click="policy")
  div(
    :class="{'hide-filter': !filterShow}"
    class="filter-bar")
    div(@click="showCondition=true")
      p
        span(class="iconfont icon-shaixuan")
      p 筛选
    div(@click="timeChangeOrder(timeOrder)")
      p
        span(class="icon-shijian iconfont")
      p(v-show="timeOrder===0") 起飞时间
      p(v-show="timeOrder===1") 早->晚
      p(v-show="timeOrder===2") 晚->早
    div(@click="priceChangeOrder(priceOrder)")
      p
        span(class="iconfont icon-jiage1")
      p(v-show="priceOrder===0") 价格
      p(v-show="priceOrder===1") 高->低
      p(v-show="priceOrder===2") 低->高
  popup(v-model="showCondition")
    div(
      class="padding-horizontal"
      style="background:#fff;line-height:3")
      flexbox
        flexbox-item(
          class="text-left"
          @click.native="showCondition=false") 取消
        flexbox-item(
          class="text-center text-muted"
          @click.native="resetCondition") 重置
        flexbox-item(
          class="text-right text-warning"
          @click.native="sureCondition") 确定
    div(style="background:#fff")
      x-switch(title="只看直飞" v-model="direct")
    flexbox(:gutter="0" class="small-font" align="flex-start")
      flexbox-item(:span="3/10")
        div(
          class="padding-block"
          :style="{background:selected==='duration'?'#fff':''}"
          :class="{'vux-reddot':dotDuration}"
          @click="choose('duration')") 起飞时段
        div(
          class="padding-block"
          :style="{background:selected==='cabins'?'#fff':''}"
          :class="{'vux-reddot':dot.cabins}"
          @click="choose('cabins')") 舱位
        div(
          class="padding-block"
          :style="{background:selected==='depAirports'?'#fff':''}"
          :class="{'vux-reddot':dot.depAirports}"
          @click="choose('depAirports')") 出发机场
        div(
          class="padding-block"
          :style="{background:selected==='arrAirports'?'#fff':''}"
          :class="{'vux-reddot':dot.arrAirports}"
          @click="choose('arrAirports')") 到达机场
        div(
          class="padding-block"
          :style="{background:selected==='companies'?'#fff':''}"
          :class="{'vux-reddot':dot.companies}"
          @click="choose('companies')") 航空公司
        div(
          class="padding-block"
          :style="{background:selected==='cities'?'#fff':''}"
          :class="{'vux-reddot':dot.cities}"
          @click="choose('cities')") 中转城市
      flexbox-item(
        :span="7/10"
        class="middle-font padding-horizontal"
        style="background-color:#fff;height:234px;overflow-y:scroll")
        div(
          v-show="selected==='duration'"
          style="transform: translate3d(0,0,0)")
          p(class="padding-vertical text-left")
            span 去程：
            span {{duration.value.from[0]+':00'}}-{{duration.value.from[1]+':00'}}
          vue-slider(
            style="padding: 40px 20px 20px"
            ref="sliderFrom"
            v-model="duration.value.from"
            v-bind="duration.config")
          template(v-if="ifBack")
            p.padding-vertical.text-left
              span 返程：
              span {{duration.value.back[0]+':00'}}-{{duration.value.back[1]+':00'}}
            vue-slider(
              style="padding: 40px 20px 20px"
              ref="sliderBack"
              v-model="duration.value.back"
              v-bind="duration.config")
        div(v-show="selected!=='duration'")
          flexbox(
            v-for="(option,index) in options"
            :key="option.name"
            :gutter="0"
            style="line-height:3")
            flexbox-item(:span="8/10")
              p {{option.name}}
            flexbox-item(class="text-center")
              check-icon(
                type="plain"
                :value.sync="option.selected"
                @click.native="changeCondition(index)")
</template>

<script>
import _filter from 'lodash/filter'
import _intersection from 'lodash/intersection'
import _uniqBy from 'lodash/uniqBy'
import VueSlider from 'vue-slider-component'
import moment from 'moment'
import { InlineCalendar, XSwitch } from 'vux'
import DoubleCalendar from '@/components/common/double-calendar'
import PullTo from 'vue-pull-to'
import PlaneListBody from './plane-list-body'

export default {
  name: 'PlaneList',
  components: {
    VueSlider,
    InlineCalendar,
    DoubleCalendar,
    XSwitch,
    PullTo,
    PlaneListBody
  },
  data () {
    return {
      leftOptions: {
        backText: ''
      },
      fromDate: moment(this.$route.query.fromDate),
      backDate: moment(this.$route.query.retDate),
      ifBack: +this.$route.query.ifBack,
      showCondition: false,
      showDate: false,
      priceOrder: 0,
      timeOrder: 0,
      filterShow: true,
      curList: [],
      totalList: [],
      limit: 8,
      airCompanies: [],
      options: [],
      depAirports: [],
      arrAirports: [],
      companies: [],
      types: [
        {
          name: '不限',
          selected: true
        }, {
          name: '小型机',
          selected: false
        }, {
          name: '中型机',
          selected: false
        }, {
          name: '大型机',
          selected: false
        }
      ],
      cabins: [
        {
          name: '不限',
          level: 0,
          selected: true
        }, {
          name: '经济舱',
          level: 1,
          selected: false
        }, {
          name: '商务舱',
          level: 2,
          selected: false
        }, {
          name: '头等舱',
          level: 3,
          selected: false
        }
      ],
      duration: {
        value: {
          from: [0, 24],
          back: [0, 24]
        },
        config: {
          width: '100%',
          height: 4,
          dotSize: 20,
          min: 0,
          max: 24,
          interval: 1,
          disabled: false,
          show: true,
          tooltip: 'always',
          piecewise: false,
          lazy: true,
          tooltipStyle: {
            backgroundColor: '#fff',
            borderColor: '#fff',
            color: '#666'
          }
        }
      },
      cities: [],
      selected: 'cabins',
      direct: false,
      dot: {
        depAirports: 0,
        arrAirports: 0,
        types: 0,
        companies: 0,
        cabins: 0,
        cities: 0
      },
      preTop: 0,
      noData: false
    }
  },
  created () {
    return this.getFlights()
  },
  mounted () {
    const listBody = this.$el.querySelector('.plane-list-body')

    listBody.style.height = `${listBody.parentNode.offsetHeight - listBody.previousSibling.offsetHeight}px`
  },
  watch: {
    selected (newValue) {
      if (newValue === 'duration') {
        this.$nextTick(() => {
          this.$refs.sliderFrom.refresh()
          if (this.ifBack) this.$refs.sliderBack.refresh()
        })
      }
    }
  },
  computed: {
    header () {
      return this.$route.query.fromCityName + (+this.$route.query.ifBack ? ' ⇌ ' : ' → ') + this.$route.query.toCityName
    },
    itemHeight () {
      return this.ifBack ? 169 : 95
    },
    dotDuration () {
      if (
        this.duration.value.from[0] > 0 ||
        this.duration.value.from[1] < 24 ||
        this.duration.value.back[0] > 0 ||
        this.duration.value.back[1] < 24
      ) {
        return 1
      } else {
        return 0
      }
    },
    dateList () {
      if (this.ifBack) return null

      let date = moment(this.fromDate).subtract(7, 'days')

      const result = []

      for (let i = 0; i <= 14; i++) {
        result.push({
          date: date,
          weekday: date.format('dddd'),
          day: date.format('MM-DD')
        })

        if (i === 6) {
          date = this.fromDate
        } else {
          date = moment(date).add(1, 'days')
        }
      }

      this.$nextTick(() => {
        let list = this.$el.querySelector('#date-list')
        list.scrollLeft = (840 - list.offsetWidth) / 2
      })

      return result
    }
  },
  methods: {
    choose (value) {
      if (value === 'depAirports') {
        this.options = this.depAirports
      }
      if (value === 'arrAirports') {
        this.options = this.arrAirports
      }
      if (value === 'companies') {
        this.options = this.companies
      }
      if (value === 'cabins') {
        this.options = this.cabins
      }
      if (value === 'cities') {
        this.options = this.cities
      }
      this.selected = value
    },
    changeCondition (index) {
      if (index === 0) {
        this.options.forEach(item => {
          item.selected = false
        })
      } else {
        this.options[0].selected = false
        this.dot[this.selected] = 1
      }

      const len = this.options.length
      for (let i = 0; i < len; i++) {
        if (this.options[i].selected) return
      }

      this.options[0].selected = true
      this.dot[this.selected] = 0
    },
    sureCondition () {
      const test = item => item.selected && item.name !== '不限'
      const transitCities = _filter(this.cities, test).map(city => city.name)
      const cabins = _filter(this.cabins, test).map(cabin => cabin.level)
      const companies = _filter(this.companies, test).map(company => company.name)
      const depAirports = _filter(this.depAirports, test).map(depAirport => depAirport.name)
      const arrAirports = _filter(this.arrAirports, test).map(arrAirport => arrAirport.name)

      const fromDepartureStart = `0${this.duration.value.from[0]}:00`.slice(-5)
      const fromDepartureEnd = `0${this.duration.value.from[1]}:00`.slice(-5)
      const backDepartureStart = `0${this.duration.value.back[0]}:00`.slice(-5)
      const backDepartureEnd = `0${this.duration.value.back[1]}:00`.slice(-5)

      this.curList = _filter(this.totalList, (value, index) => {
        const fromDepartureTime = moment(value.fromSegments[0].depTime, 'YYYYMMDDHHmm').format('HH:mm')
        const backDepartureTime = value.retSegments[0] ? moment(value.retSegments[0].depTime, 'YYYYMMDDHHmm').format('HH:mm') : ''

        return (
          this.direct ? (
            (((value.fromSegments.length === 1 &&
            value.fromSegments[0].stopCities === '') &&
            value.retSegments.length === 0) ||
            value.retSegments.length === 1) &&
            value.retSegments[0].stopCities === ''
          ) : 1
        ) && (
          fromDepartureTime >= fromDepartureStart &&
          fromDepartureTime <= fromDepartureEnd && (
            backDepartureTime ? (
              backDepartureTime >= backDepartureStart &&
              backDepartureTime <= backDepartureEnd
            ) : 1
          )
        ) && (
          transitCities.length ? _intersection([
            ...value.fromSegments.map(item => item.transitCity),
            ...value.retSegments.map(item => item.transitCity)
          ], transitCities).length : 1
        ) && (
          cabins.length ? _intersection([
            ...value.fromSegments.map(item => item.canbinClass),
            ...value.retSegments.map(item => item.canbinClass)
          ], cabins).length : 1
        ) && (
          depAirports.length ? _intersection([
            ...value.fromSegments.map(item => item.depAirportCN),
            ...value.retSegments.map(item => item.depAirportCN)
          ], depAirports).length : 1
        ) && (
          arrAirports.length ? _intersection([
            ...value.fromSegments.map(item => item.arrAirportCN),
            ...value.retSegments.map(item => item.arrAirportCN)
          ], arrAirports).length : 1
        ) && (
          companies.length ? _intersection([
            ...value.fromSegments.map(item => item.airCompany),
            ...value.retSegments.map(item => item.airCompany)
          ], companies).length : 1
        )
      })
      if (!this.curList.length) {
        this.noData = true
      } else {
        this.noData = false
      }
      this.showCondition = false
    },
    resetCondition () {
      for (let i in this.dot) {
        this.dot[i] = 0
      }

      this.duration.value.from = [0, 24]
      this.duration.value.back = [0, 24]

      this.cabins.forEach((item, index) => {
        item.selected = false
      })
      this.cabins[0].selected = true

      this.depAirports.forEach((item, index) => {
        item.selected = false
      })
      this.depAirports[0].selected = true

      this.arrAirports.forEach((item, index) => {
        item.selected = false
      })
      this.arrAirports[0].selected = true

      this.cities.forEach((item, index) => {
        item.selected = false
      })
      this.cities[0].selected = true

      this.companies.forEach((item, index) => {
        item.selected = false
      })
      this.companies[0].selected = true
    },
    getFlights (date) {
      this.$store.commit('loading', true)
      return this.$http
        .get('https://weixin.iflying.com/flights/search/index', {
          params: {
            tripType: this.ifBack ? 2 : 1,
            fromCity: this.$route.query.fromCity,
            toCity: this.$route.query.toCity,
            fromDate: this.fromDate.format('YYYYMMDD'),
            retDate: this.ifBack ? this.backDate.format('YYYYMMDD') : '',
            adultNum: 1,
            childNum: 0
          }
        })
        .then(data => {
          data.flights.forEach((item, index) => {
            item.id = index
          })
          this.airCompanies = data.airCompany

          this.totalList = data.flights
          this.filterShow = true
          this.totalList.forEach(list => {
            const seats = []
            list.fromSegments.forEach((item, index) => {
              if (item !== 'A') {
                seats.push(item.seats)
              }
              data.airline_info.forEach(airline => {
                if (airline.code === item.depAirport) {
                  list.fromSegments[index].depAirportCN = airline.codeCn
                  list.fromSegments[index].depCity = airline.cityCnName
                  list.fromSegments[index].depCityCode = airline.city
                  list.fromSegments[index].depCountryCode = airline.country
                }
                if (airline.code === item.arrAirport) {
                  list.fromSegments[index].arrAirportCN = airline.codeCn
                  if (index !== list.fromSegments.length - 1) {
                    list.fromSegments[index].transitCity = airline.cityCnName
                  }
                  list.fromSegments[index].arrCity = airline.cityCnName
                  list.fromSegments[index].arrCityCode = airline.city
                  list.fromSegments[index].arrCountryCode = airline.country
                }
              })
              for (let i = 0; i < data.airCompany.length; i++) {
                if (item.carrier === data.airCompany[i].airlinecode) {
                  list.fromSegments[index].airCompany = data.airCompany[i].airlineNameCN
                  list.fromSegments[index].airlineIcon = data.airCompany[i].icon
                  return
                }
              }
            })
            list.retSegments.forEach((item, index) => {
              if (item !== 'A') {
                seats.push(item.seats)
              }
              data.airline_info.forEach(airline => {
                if (airline.code === item.depAirport) {
                  list.retSegments[index].depAirportCN = airline.codeCn
                  list.retSegments[index].depCity = airline.cityCnName
                  list.retSegments[index].depCityCode = airline.city
                  list.retSegments[index].depCountryCode = airline.country
                }
                if (airline.code === item.arrAirport) {
                  list.retSegments[index].arrAirportCN = airline.codeCn
                  if (index !== list.retSegments.length - 1) {
                    list.retSegments[index].transitCity = airline.cityCnName
                  }
                  list.retSegments[index].arrCity = airline.cityCnName
                  list.retSegments[index].arrCityCode = airline.city
                  list.retSegments[index].arrCountryCode = airline.country
                }
              })
              for (let i = 0; i < data.airCompany.length; i++) {
                if (item.carrier === data.airCompany[i].airlinecode) {
                  list.retSegments[index].airCompany = data.airCompany[i].airlineNameCN
                  list.retSegments[index].airlineIcon = data.airCompany[i].icon
                  return
                }
              }
            })
            list.minSeat = (Math.min.apply(null, seats))
          })
          this.depAirports = [{name: '不限', selected: true}]
          this.arrAirports = [{name: '不限', selected: true}]
          this.cabins = [
            {
              name: '不限',
              level: 0,
              selected: true
            }, {
              name: '经济舱',
              level: 1,
              selected: false
            }, {
              name: '商务舱',
              level: 2,
              selected: false
            }, {
              name: '头等舱',
              level: 3,
              selected: false
            }
          ]
          this.cities = [{name: '不限', selected: true}]
          this.companies = [{name: '不限', selected: true}]
          this.totalList.forEach(list => {
            this.depAirports.push({name: list.fromSegments[0].depAirportCN, selected: false})
            list.fromSegments.forEach((seg, index) => {
              if (index !== list.fromSegments.length - 1) {
                this.cities.push({name: seg.transitCity, selected: false})
              }
            })
            this.arrAirports.push({name: list.fromSegments[list.fromSegments.length - 1].arrAirportCN, selected: false})
          })
          this.airCompanies.forEach(item => {
            this.companies.push({name: item.airlineNameCN, selected: false})
          })
          this.depAirports = _uniqBy(this.depAirports, 'name')
          this.arrAirports = _uniqBy(this.arrAirports, 'name')
          this.cities = _uniqBy(this.cities, 'name')
          this.companies = _uniqBy(this.companies, 'name')

          this.curList = this.totalList
          if (!this.curList.length) {
            this.noData = true
          }
          this.choose('cabins')
          this.$store.commit('loading', false)
        })
        .catch(e => {
          this.$store.commit('loading', false)
        })
    },
    changeDate (from, back) {
      let flag = false

      if (!this.fromDate.isSame(from)) {
        flag = true
        if (typeof from === 'string') this.fromDate = moment(from)
        else this.fromDate = from
      }

      if (this.ifBack && back !== undefined && !this.backDate.isSame(back)) {
        flag = true
        if (typeof from === 'string') this.backDate = moment(back)
        else this.backDate = back
      }

      if (flag) {
        this.$router.replace({
          path: this.$route.path,
          query: {
            ...this.$route.query,
            fromDate: this.fromDate.format('YYYY-MM-DD'),
            retDate: this.ifBack ? this.backDate.format('YYYY-MM-DD') : ''
          }
        })

        return this.getFlights()
      }
    },
    onScroll (e) {
      const top = e.target.scrollTop
      // 向上滑动50以上出现，向下滑动50以上消失，符合用户操作习惯
      if (top < this.preTop - 50) {
        this.filterShow = true
        this.preTop = top
      } else if (top > this.preTop + 50) {
        this.filterShow = false
        this.preTop = top
      }

      this.$refs.listBody.setData(top)
    },
    pulldown (loaded) {
      loaded('done')

      return this.getFlights()
    },
    policy (item) {
      this.$pushStash(item)

      this.$router.push({
        path: '/plane/detail',
        query: this.$route.query
      })
    },
    priceChangeOrder (num) {
      if (num === 1) {
        this.priceOrder = 2
      }
      if (num === 2) {
        this.priceOrder = 1
      }
      if (num === 0) {
        this.priceOrder = 1
      }
      return this.curList.sort((obj1, obj2) => {
        this.timeOrder = 0
        let a = obj1['adultPrice'] + obj1['adultTax']
        let b = obj2['adultPrice'] + obj2['adultTax']
        if (this.priceOrder === 1) {
          return b - a
        } else {
          return a - b
        }
      })
    },
    timeChangeOrder (num) {
      if (num === 1) {
        this.timeOrder = 2
      }
      if (num === 2) {
        this.timeOrder = 1
      }
      if (num === 0) {
        this.timeOrder = 1
      }
      return this.curList.sort((obj1, obj2) => {
        this.priceOrder = 0
        let val1 = obj1.fromSegments[0].depTime
        let val2 = obj2.fromSegments[0].depTime
        if (this.timeOrder === 1) {
          return val1 - val2
        } else {
          return val2 - val1
        }
      })
    }
  }
}
</script>

<style lang="sass">
  .filter-bar
    position: absolute
    bottom: 0
    left: 0
    display: flex
    width: 100%
    padding: 8px 0
    background: rgba(255,255,255,0.9)
    font-size: 12px
    line-height: 16px
    color: #666
    text-align: center
    box-shadow: 0 0px 2px #dcdcdc
    transition: transform .3s ease
    transform: translate3d(0, 0, 0)

    > div
      flex: 1 1 33%

    [class^="ion"]
      font-size: 18px

    &.hide-filter
      transform: translate3d(0, 54px, 0)

  .plane-list-content
    height: 100%

  .plane-list-header
    background: #fff

  .plane-list-body
    overflow-y: auto

  #date-list
    overflow-x: scroll

  .date-list
    width: 840px
    padding: 8px 0
    overflow: hidden

  .date-list-item
    float: left
    width: 40px
    padding: 0 8px
    border-radius: 4px

  .pullto-wrapper
    height: 50px
    line-height: 50px
    font-size: 0px
    transition: transform 0.3s

    &.trigger
      transform: rotateZ(-180deg)

  .vux-reddot:after
    top: 15px !important
    right: 15px !important
</style>
