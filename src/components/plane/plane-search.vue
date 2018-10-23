<template lang="pug">
view-box(
  :body-padding-top="$store.state.showHeader ? '46px' : '0'"
  body-padding-bottom="0")
  x-header(
    v-if="$store.state.showHeader"
    slot="header"
    :left-options="leftOptions"
    title="机票搜索"
    style="position:fixed;top:0;left:0;width:100%;z-index:100")
  nav.header
    img(src="../../assets/img/index.png")
  tab
    tab-item(
      selected
      @on-item-click="ifBack=0") 单程
    tab-item(@on-item-click="ifBack=1") 往返
  group
    cell-box
      flexbox
        flexbox-item
          div(@click="selectStart") {{startCity.cityCnName}}
        flexbox-item(
          class="text-center"
          @click.native="exchange")
          img(src="../../assets/img/plane.png" style="width:30px;height:30px;vertical-align:middle")
        flexbox-item
          div(
            class="text-right"
            @click="selectEnd") {{endCity.cityCnName}}
    calendar(
      style="line-height:30px"
      title="出行时间"
      v-model="startTime"
      disable-past)
    calendar(
      style="line-height:30px"
      title="返程时间"
      v-model="endTime"
      v-show="ifBack"
      disable-past)
  group(class="padding-horizontal")
    x-button(
      type="primary"
      @click.native="toSearch") 搜索
  popup(
    v-model="showCity"
    height="100%"
    position="bottom")
    view-box(
      body-padding-top="46px"
      body-padding-bottom="0px")
      x-header(
        :left-options="{backText: '',preventGoBack:true}"
        title="目的地搜索"
        style="position:fixed;top:0;left:0;width:100%;z-index:100"
        @on-click-back="backSearch")
        div(slot="right")
          span(
            class="iconfont icon-sousuo"
            @click="showSearch=true,searchNoData=false")
      div(v-show="!showSearch")
        tab
          tab-item(
            selected
            @on-item-click="switchCountry") 国内
          tab-item(@on-item-click="switchCountry") 国际及港澳台
        flexbox(
          class="text-center letter-box"
          :gutter="0")
          flexbox-item(
            v-for="letter in allLetter"
            :class="{'text-danger':letter===oneSelected}"
            :key="letter"
            @click.native="letterSelected(letter)") {{letter}}
        scroller(lock-x ref="scrollers" height="-90")
          div
            divider 热门目的地
            flexbox(
              wrap="wrap"
              style="box-sizing:border-box;padding-right:20px"
              :gutter="0")
              flexbox-item(
                v-for="place in hotPlace"
                :span="1/5"
                :key="place.city")
                button(
                  class="place"
                  @click="selectCity(place)") {{place.cityCnName}}
            div
              list-group(
                v-show="countryType === 0"
                :gutter="0"
                :title="oneSelected"
                :data="domesticMddList"
                cell-title="cityCnName"
                cell-key=`${cityCnName}${city}`
                @click="selectCity")
              list-group(
                v-show="countryType === 1"
                :gutter="0"
                :title="oneSelected"
                :data="internationMddList"
                cell-title="cityCnName"
                cell-key=`${cityCnName}${city}`
                @click="selectCity")
              load-more(
                v-show="noData"
                :show-loading="false"
                background-color="#efefef"
                tip="暂无数据")
      div(v-show="showSearch")
        div(style="height:44px;")
          search(
            placeholder="请输入要搜索的城市"
            @on-submit="searchCity"
            @on-cancel="showSearch=false"
            v-model="city"
            position="absolute"
            auto-scroll-to-top
            top="46px")
        group(:gutter="0")
          cell(
            v-for="place in resultList"
            :key="place.city"
            :title="place.cityCnName"
            @click.native="selectCity(place)")
        load-more(
          v-show="searchNoData"
          :show-loading="false"
          background-color="#efefef"
          tip="暂无数据")
</template>

<script>
import moment from 'moment'
import { Divider } from 'vux'

const ListGroup = {
  name: 'list-group',
  props: {
    data: {
      required: true,
      type: Array
    },
    cellTitle: {
      required: true,
      type: String
    },
    cellKey: {
      required: true,
      type: String
    }
  },
  render (h) {
    return h(
      'group',
      {
        props: this.$attrs
      },
      this._l(this.data, item => {
        return h(
          'cell',
          {
            props: {
              title: item[this.cellTitle]
            },
            nativeOn: {
              click: () => {
                this.$emit('click', item)
              }
            },
            key: item[this.cellKey]
          }
        )
      })
    )
  }
}

export default {
  name: 'PlaneSearch',
  components: {
    ListGroup,
    Divider
  },
  data () {
    return {
      leftOptions: {
        backText: ''
      },
      hasChild: false,
      showSearch: false,
      resultList: [],
      startCity: {city: 'BJS', cityCnName: '北京', cityJianPin: 'BJ', cityQuanPinN: 'beijing', country: 'CN'},
      endCity: {city: 'SHA', cityCnName: '上海', cityJianPin: 'SH', cityQuanPinN: 'shanghai', country: 'CN'},
      showCity: false,
      ifSelectStart: false,
      countryType: 0,
      ifBack: 0,
      city: '',
      startTime: moment().add(7, 'days').format('YYYY-MM-DD'),
      endTime: moment().add(8, 'days').format('YYYY-MM-DD'),
      hotPlace: [],
      domesticMddList: [],
      internationMddList: [],
      allLetter: [],
      oneSelected: 'A',
      searchNoData: false
    }
  },
  computed: {
    noData () {
      if ((this.countryType === 0 && this.domesticMddList.length === 0) ||
          (this.countryType === 1 && this.internationMddList.length === 0)) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    startTime (newValue) {
      if (this.endTime < newValue) this.endTime = moment(newValue).add(1, 'days').format('YYYY-MM-DD')
    }
  },
  created () {
    this.$store.commit('loading', true)

    this.$http
      .get('https://weixin.iflying.com/flights/search/getHotCity')
      .then(data => {
        this.hotPlace = data
      })

    for (let i = 0; i < 26; i++) {
      this.allLetter.push(String.fromCharCode(65 + i))
    }

    this.$http
      .get('https://weixin.iflying.com/flights/search/citySearch', {
        params: {
          initials: 'A',
          count: 9999
        }
      })
      .then(data => {
        this.$store.commit('loading', false)

        data.forEach(item => {
          if (item.country === 'CN') {
            this.domesticMddList.push(item)
          } else {
            this.internationMddList.push(item)
          }
        })

        this.$nextTick(() => {
          this.$refs.scrollers.reset()
        })
      })
  },
  methods: {
    searchCity (value) {
      this.$store.commit('loading', true)
      this.$http
        .post('search/citySearch', {}, {
          params: {
            query: value,
            count: 9999
          }
        })
        .then(data => {
          this.$store.commit('loading', false)
          this.resultList = data
          if (data.length === 0) {
            this.searchNoData = true
          }
        })
    },
    selectStart () {
      this.showSearch = false
      this.showCity = true
      this.ifSelectStart = true
      this.$nextTick(() => {
        this.$refs.scrollers.reset()
      })
    },
    selectEnd () {
      this.showSearch = false
      this.showCity = true
      this.$nextTick(() => {
        this.$refs.scrollers.reset()
      })
    },
    letterSelected (letter) {
      this.$store.commit('loading', true)
      this.$http
        .get('https://weixin.iflying.com/flights/search/citySearch', {
          params: {
            initials: letter,
            count: 9999
          }
        })
        .then(data => {
          this.$store.commit('loading', false)
          this.oneSelected = letter

          this.internationMddList = []
          this.domesticMddList = []

          data.forEach(item => {
            if (item.country !== 'CN') {
              this.internationMddList.push(item)
            } else {
              this.domesticMddList.push(item)
            }
          })

          this.$nextTick(() => {
            this.$refs.scrollers.reset()
          })
        })
    },
    selectCity (place) {
      this.showCity = false
      if (this.ifSelectStart) {
        this.startCity = place
        this.ifSelectStart = false
      } else {
        this.endCity = place
      }
      this.resultList = []
      this.city = ''
    },
    toSearch () {
      if (this.startCity.cityCnName === this.endCity.cityCnName) {
        this.$vux.alert.show({
          content: '请正确填写城市信息'
        })
      } else {
        this.$router.push({
          path: 'list',
          query: {
            ifBack: this.ifBack,
            fromCity: this.startCity.city,
            fromCityName: this.startCity.cityCnName,
            toCity: this.endCity.city,
            toCityName: this.endCity.cityCnName,
            fromDate: this.startTime,
            retDate: this.ifBack ? this.endTime : ''
          }
        })
      }
    },
    switchCountry (index) {
      this.countryType = index
      this.$nextTick(() => {
        this.$refs.scrollers.reset({
          top: 0
        })
      })
    },
    exchange () {
      [this.startCity, this.endCity] = [this.endCity, this.startCity]
    },
    backSearch () {
      if (this.showSearch) {
        this.showSearch = false
      } else {
        this.showCity = false
      }
    }
  }
}
</script>

<style lang="sass">
nav.header
  position: relative
  img
    vertical-align: top
.place
  width: 65px
  line-height: 26px
  margin-bottom: 4px
  display: block
  margin-left: auto
  margin-right: auto
  border-radius: 5px
  outline: 0
  color: #000000
  background-color: #F8F8F8
  border: 1px solid #dcdcdc

.letter-box.vux-flexbox
  position: absolute
  top: 89px
  right: 0
  bottom: 0
  width: 20px
  z-index: 1
  flex-direction: column
  align-items: stretch
  font-size: 12px
  overflow-y: scroll
</style>
