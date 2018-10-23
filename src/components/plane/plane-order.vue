<template lang="pug">
view-box(
  :body-padding-top="$store.state.showHeader ? '46px' : '0'"
  body-padding-bottom="46px")
  x-dialog(
    v-model="showFlight"
    :dialog-style="{'max-width': '100%', 'width':'90%', 'padding-bottom':'0', 'overflow':'scroll'}"
    hide-on-blur)
    group(
      v-once
      :gutter="0"
      title="航班详情")
      flight-detail(
        :segments="flightsData.fromSegments"
        backText="去"
      )
      flight-detail(
        v-if="ifBack"
        :segments="flightsData.retSegments"
        backText="返"
      )
    div(@click="showFlight=false" style="line-height:2")
      span(class="ion-ios-close-outline")
  x-header(
    v-if="$store.state.showHeader"
    :left-options="leftOptions"
    @on-click-back="quit"
    :title="header"
    style="position:fixed;top:0;left:0;width:100%;z-index:100")
  div
    group(
      :gutter="0"
      @click.native="showFlight=true")
      cell(is-link)
        div(slot="title")
          div(style="display:flex;align-items:center;")
            span(
              class="bg-success small-font text-center"
              style="border-radius:50%;display:inline-block;width:18px;height18px;line-height:18px;margin-right:10px;") 去
            span {{flightsData.fromSegments[0].departureTime.format('MM.DD dddd HH:mm')}}
          div(
            class="text-muted small-font"
            style="line-height:2;padding-left:28px;") {{flightsData.fromSegments[0].depAirportCN}} - {{flightsData.fromSegments[flightsData.fromSegments.length-1].arrAirportCN}}
          template(v-if="ifBack")
            div(style="display:flex;align-items:center;")
              span(
                class="bg-success small-font text-center"
                style="border-radius:50%;display:inline-block;width:18px;height18px;line-height:18px;margin-right:10px;") 返
              span {{flightsData.retSegments[0].departureTime.format('MM.DD dddd HH:mm')}}
            div(
              class="text-muted small-font"
              style="line-height:2;padding-left:28px;") {{flightsData.retSegments[0].depAirportCN}} - {{flightsData.retSegments[flightsData.retSegments.length-1].arrAirportCN}}
    group
      cell(
        value="选择乘机人"
        title="乘机人"
        @click.native="showPersonList=true")
      cell-box(
        is-link
        v-show="selectedPerson.length>0"
        v-for="(person,index) in selectedPerson"
        :key="person.id"
        class="middle-font"
        @click.native="editPerson(person.passengerDocument[0].passengerDocumentNumber)")
        flexbox(:gutter="0")
          flexbox-item(:span="1/12")
            span(
              class="icon-shanchu iconfont"
              style="color:#cc4444;"
              @click.stop="showDelete(index)")
          flexbox-item
            p {{person.passengerName}}
            p {{person.passengerDocument[0].passengerDocumentNumber}}
    group
      cell(title="填写联系人")
      x-input(
        title="姓 名"
        class="middle-font"
        v-model="contactName"
        placeholder="请填写联系人姓名")
      x-input(
        title="手机号"
        class="middle-font"
        v-model="contactPhone"
        placeholder="请输入手机号")
    div(class="padding-block small-font") 订单包含机票，显示价格已经包含税费。点击去支付表示已阅读并同意
      span.text-success(@click="showPolicy=true") 机票预订须知
      span ，
      span.text-success(@click="showPolicy=true") 锂电池及危险品须知
  popup(
    v-model="showPolicy"
    class="small-font"
    height="100%"
    position="bottom"
    style="background: #fff;z-index:502"
    @click.native="showPolicy=false")
    div.padding-block(v-once)
      h3.text-center.padding-vertical 关于民航乘客携带锂电池及危险品乘机的限制性公告
      p.padding-vertical 一.关于民航旅客行李中携带锂电池规定的公告
      p 为了加强旅客行李中锂电池的航空运输安全，民航局、民航华东地区管理局先后下发《关于加强旅客行李中锂电池安全航空运输的通知》，要求民航各相关单位进一步做好旅客行李中锂电池的安全运输管理工作，对于旅客行李中携带锂电池的，按照国际民航组织《危险物品安全航空运输技术细则》以下规定执行：
      p 旅客或机组成员为个人自用内含锂或锂离子电池芯或电池的便携式电子装置 (锂电池移动电源、手表、计算器、照相机、手机、手提电脑、便携式摄像机等)应作为手提行李携带登机，并且锂金属电池的锂含量不得超过2克，锂离子电池的额定能量值不得超过100Wh（瓦特小时）。超过100Wh但不超过160Wh的，经航空公司批准后可以装在手提行李中的设备上。超过160Wh的锂电池严禁携带。
  flexbox(
    slot="bottom"
    :gutter="0"
    style='position:absolute;bottom:0;line-height:46px;z-index:501;height:46px;overflow:hidden')
    flexbox-item(
      class="text-center"
      style="background:#fff"
      :span="2/3"
      @click.native="showPriceDetail=!showPriceDetail")
      b ￥{{TotalPrice}}
      template(v-if="selectedPerson.length>0")
        span(class="small-font") (共{{selectedPerson.length}}人)
        span(
          :class="{'ion-chevron-up':!showPriceDetail,'ion-chevron-down':showPriceDetail}"
          class="public-icon padding-horizontal")
    flexbox-item(:span="1/3")
      div(
        class="bg-highlight text-center"
        @click="toPay") 去支付
  x-dialog(v-model="showOrder")
    group(
      :gutter="0"
      title="请确认以下机票信息")
      div(class="padding-block middle-font text-left" style="line-height:1.8")
        div(class="h3") {{flightsData.fromSegments[0].depCity}} - {{flightsData.fromSegments[flightsData.fromSegments.length-1].arrCity}}
        div(class="text-muted") {{flightsData.fromSegments[0].departureTime.format('YYYY年MM月DD日 dddd HH:mm')}}
        template(v-if="ifBack")
          div(class="h3") {{flightsData.retSegments[0].depCity}} - {{flightsData.retSegments[flightsData.retSegments.length-1].arrCity}}
          div(class="text-muted") {{flightsData.retSegments[0].departureTime.format('YYYY年MM月DD日 dddd HH:mm')}}
        div(class="small-font text-light") 乘机人
        flexbox(
          v-for="person in selectedPerson"
          :key="person.id")
          flexbox-item(:span="1/4") {{person.passengerName}}
          flexbox-item {{person.passengerDocument[0].passengerDocumentNumber}}
    div
      load-more(tip="正在生成订单" style="margin:0.5em auto")
  popup(
    v-model="showPriceDetail"
    class="middle-font"
    style="bottom:46px;background:#fff;")
    //-form-preview(
      header-label="订单总计(元)"
      :header-value="priceDetail")
    div(class="padding-block")
      flexbox(class="h2 padding-vertical")
        flexbox-item(:span="3/4") 订单总计(元)
        flexbox-item(class="text-right text-warning") {{TotalPrice}}
      flexbox(
        v-for="type in detailPrice"
        :key="type.label"
        style="line-height:30px;"
        class="text-muted"
        v-if="type.number")
        flexbox-item(:span="3/4") {{type.label}}
        flexbox-item(class="text-right")
          span {{type.value}}
          span(class="small-font") * {{type.number}}
  popup(
    v-model="showPersonList"
    style="z-index:502;min-height:30%"
    position="bottom")
    popup-header(
      title="选择乘机人员"
      left-text="取消"
      right-text="确定"
      @on-click-left="showPersonList=false"
      @on-click-right="changePerson")
    div(
      class="text-center padding-block text-warning middle-font"
      style="background:#fff"
      @click="addNewPerson")
      span(class="ion-ios-plus-outline public-icon")
      span 添加乘机人
    group(
      v-if="personList.length"
      :gutter="1")
      swipeout
        swipeout-item(
          v-for="(person,index) in personList"
          :key="person.id"
          class="middle-font")
          div(slot="right-menu")
            swipeout-button(
              type="warn"
              @click.native="deletePerson(person)") 删除
          div(slot="content")
            cell-box
              flexbox
                flexbox-item(:span="1/10")
                  check-icon(:value.sync="person.selected")
                flexbox-item(:span="8/10")
                  div {{person.passengerName}}
                  div {{person.passengerDocument[0].passengerDocumentNumber}}
                flexbox-item(:span="1/10")
                  span(
                    class="ion-compose text-muted edit-icon"
                    @click="editPerson(person.passengerDocument[0].passengerDocumentNumber)")
  popup(
    v-model="showEditPerson"
    height="100%"
    style="z-index:502")
    view-box(
      body-padding-top="40px"
      body-padding-bottom="0px")
      div(
        class="h3 text-center"
        style="background:#fff;line-height:40px;height:40px;width:100%;position:fixed;top:0;left:0;") {{addNew?'新增乘机人员':'修改乘机人员'}}
      div(
        class="middle-font text-muted padding-block"
        style="padding-bottom:5px") 旅客信息
      group(:gutter="0")
        x-input(
          title="姓名"
          label-width="35"
          v-model="personData.passengerName"
          placeholder="与证件姓名一致")
        x-input(
          title="英文姓"
          label-width="35"
          v-model="personData.passengerPinyinFamilyName"
          placeholder="姓，拼音或英文，如(FEI)"
          v-if="!ifDomestic")
        x-input(
          title="英文名"
          label-width="35"
          v-model="personData.passengerPinyinName"
          placeholder="名，拼音或英文，如(YANG)"
          v-if="!ifDomestic")
        selector(
          title="性别"
          :options="sexList"
          placeholder="请选择"
          v-model="personData.passengerGender")
        x-input(
          title="手机号"
          label-width="35"
          v-model="personData.passengerMobile"
          placeholder="请输入手机号")
        x-input(
          title="邮箱"
          label-width="35"
          v-model="personData.passengerEmail"
          v-if="!ifDomestic"
          placeholder="请输入邮箱")
        cell(
          title="国籍"
          is-link
          @click.native="showCountries=true"
          v-if="!ifDomestic"
          v-model="personData.passengerNationality")
        datetime(
          v-model="personData.passengerBirthday"
          title="出生日期"
          :min-year="1800"
          :end-date="curDate"
          placeholder="请选择日期")
      div(
        class="small-font text-danger padding-block"
        style="padding-top:5px") *为顺利出行，请确保出行姓名与证件上一致。
      div(
        class="middle-font text-muted padding-horizontal"
        style="padding-bottom:5px") 证件信息
      group(:gutter="0")
        selector(
          title="证件类型"
          :options="certificateList"
          placeholder="请选择证件类型"
          :readonly="!ifDomestic"
          v-model="personData.passengerDocumentType")
        x-input(
          title="证件号码"
          label-width="35"
          v-model="personData.passengerDocumentNumber"
          placeholder="请输入乘机人证件号码")
        datetime(
          v-model="personData.passengerCardExpired"
          title="证件有效期"
          :start-date="curDate"
          :end-date="maxDate"
          v-show="!ifDomestic"
          placeholder="请选择日期")
      div(class="padding-block")
        flexbox
          flexbox-item
            x-button(
              type="default"
              @click.native="showEditPerson=false") 取消
          flexbox-item(v-if="!addNew")
            x-button(
              type="primary"
              @click.native="savePerson(personData.passengerDocument[0].passengerDocumentNumber)") 保存
          flexbox-item(v-if="addNew")
            x-button(
              type="primary"
              @click.native="savePerson") 保存
  popup(
    v-model="showCountries"
    height="100%"
    position="bottom"
    style="z-index:503")
    view-box(
      body-padding-top="40px"
      body-padding-bottom="0px")
      div(
        class="h3 text-center"
        style="background:#fff;line-height:40px;height:40px;width:100%;position:fixed;top:0;left:0;")
        flexbox(:gutter="0" class="text-center")
          flexbox-item(:span="1/10")
            span(
              class="text-muted small-font"
              @click="showCountries=false") 取消
          flexbox-item(:span="8/10") 选择国籍
      div(style="position:relative;height:44px;")
        search(
          placeholder="请输入要搜索的城市"
          position="absolute"
          @on-cancel="showCountries=false"
          v-model="searchVal"
          auto-scroll-to-top)
      scroller(lock-x ref="scrollers" height="-84")
        div
          list-group(
            :gutter="0"
            :data="filteredCountry"
            cell-title="countrycn"
            cell-key="_id"
            @click="selectCountry")
</template>

<script>
import moment from 'moment'
import FlightDetail from '@/components/common/flight-detail'
import {PopupHeader, XDialog, Checklist, FormPreview} from 'vux'

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
  name: 'PlaneOrder',
  components: {
    ListGroup,
    PopupHeader,
    XDialog,
    Checklist,
    FormPreview,
    FlightDetail
  },
  data () {
    return {
      flightsData: [],
      showOrder: false,
      showCountries: false,
      searchVal: '',
      ifDomestic: true,
      showPriceDetail: false,
      showPersonList: false,
      showFlight: false,
      showEditPerson: false,
      addNew: false,
      certificateList: [],
      sexList: [{key: 'F', value: '女'}, {key: 'M', value: '男'}],
      countryList: [],
      allcountryList: [],
      personData: {},
      contactName: '',
      contactPhone: '',
      leftOptions: {
        backText: '',
        preventGoBack: true
      },
      personList: [],
      selectedPerson: [],
      detailPrice: [
        {
          label: '成人机票含税价',
          value: 0,
          number: 0
        },
        {
          label: '儿童机票含税价',
          value: 0,
          number: 0
        }],
      TotalPrice: 0,
      adultNum: 0,
      childNum: 0,
      curDate: moment().format('YYYY-MM-DD'),
      maxDate: moment().add(100, 'years').format('YYYY-MM-DD'),
      showPolicy: false
    }
  },
  computed: {
    header () {
      return this.$route.query.fromCityName + (+this.$route.query.ifBack ? ' ⇌ ' : ' → ') + this.$route.query.toCityName
    },
    ifBack () {
      return this.flightsData.retSegments.length
    },
    filteredCountry () {
      return this.countryList.filter(country => {
        return country.countrycn.indexOf(this.searchVal) !== -1
      })
    }
  },
  watch: {
    selectedPerson () {
      this.adultNum = this.selectedPerson.filter(item => {
        return item.ageType === 0
      }).length
      this.childNum = this.selectedPerson.filter(item => {
        return item.ageType === 1
      }).length
      this.TotalPrice = 0
      this.detailPrice[0].value = this.flightsData.adultPrice + this.flightsData.adultTax
      this.detailPrice[1].value = this.flightsData.childPrice + this.flightsData.childTax
      this.detailPrice[0].number = this.adultNum
      this.detailPrice[1].number = this.childNum
      this.TotalPrice = this.detailPrice[0].value * this.adultNum + this.detailPrice[1].value * this.childNum
    }
  },

  created () {
    this.getCustomerPassenngers()
    this.$http
      .get('order/getCardType')
      .then(data => {
        this.certificateList = data
        this.certificateList.forEach(item => {
          item.key = item.value
          item.value = item.name
        })
      })

    this.flightsData = this.$popStash()
    this.flightsData.fromSegments.forEach(item => {
      item.departureTime = moment(item.departureTime)
      item.arriveTime = moment(item.arriveTime)
    })
    this.flightsData.retSegments.forEach(item => {
      item.departureTime = moment(item.departureTime)
      item.arriveTime = moment(item.arriveTime)
    })

    this.detailPrice[0].value = this.flightsData.adultPrice + this.flightsData.adultTax
    this.detailPrice[1].value = this.flightsData.childPrice + this.flightsData.childTax

    if (this.flightsData.fromSegments[0].depCountryCode === 'CN' && this.flightsData.fromSegments[this.flightsData.fromSegments.length - 1].arrCountryCode === 'CN') {
      this.ifDomestic = true
    } else {
      this.ifDomestic = false
      this.$http
        .post('order/getAllCountry')
        .then(data => {
          this.countryList = data
          this.allcountryList = data
        })
    }
  },
  methods: {
    selectCountry (country) {
      this.personData.passengerNationality = country.countrycn
      this.personData.passengerCardIssuePlace = country.countrycn
      this.showCountries = false
    },
    getCustomerPassenngers () {
      this.$store.commit('loading', true)

      return this.$http
        .get('http://localhost:8080/static/data.json')
        .then(data => {
          this.$store.commit('loading', false)
          this.personList = data.personData.map(item => {
            item.selected = false
            item.passengerBirthday = moment(item.passengerBirthday.sec * 1000).format('YYYY-MM-DD')
            if (item.isDefault === 1) {
              item.isDefault = true
              item.selected = true
              if (moment(item.passengerBirthday).add(12, 'y').isBefore(moment().format('YYYY-MM-DD'))) {
                item.ageType = 0
              } else {
                item.ageType = 1
              }
              this.selectedPerson.push(item)
            }
            return item
          })

          if (!this.ifDomestic) {
            this.personList = this.personList.filter(item => {
              return item.passengerDocument[0].passengerDocumentType === 'PP'
            })
            this.selectedPerson = this.selectedPerson.filter(item => {
              return item.passengerDocument[0].passengerDocumentType === 'PP'
            })
          }
        })
        .catch(e => {
          this.$store.commit('loading', false)
        })
    },
    changePerson () {
      this.selectedPerson = []
      this.personList.forEach(item => {
        if (item.selected === true) {
          this.selectedPerson.push(item)
        }
      })
      this.selectedPerson.forEach(item => {
        if (moment(item.passengerBirthday).add(12, 'y').isBefore(moment().format('YYYY-MM-DD'))) {
          item.ageType = 0
        } else {
          item.ageType = 1
        }
      })
      this.showPersonList = false
    },
    showDelete (index) {
      this.personList.forEach(item => {
        if (item.passengerDocument[0].passengerDocumentNumber === this.selectedPerson[index].passengerDocument[0].passengerDocumentNumber) {
          item.selected = false
        }
      })
      this.selectedPerson.splice(index, 1)
    },
    deletePerson: function (person) {
      const _this = this
      this.$vux.confirm.show({
        content: '确定删除该乘机人？',
        onConfirm: function () {
          if (person._id) {
            _this.$http.post('order/delCustomerPassenger', {
              id: person._id.$id
            })
          }
          _this.personList.forEach((item, index) => {
            if (item.passengerDocument[0].passengerDocumentNumber === person.passengerDocument[0].passengerDocumentNumber) {
              _this.personList.splice(index, 1)
            }
          })
          _this.selectedPerson.forEach((item, index) => {
            if (item.passengerDocument[0].passengerDocumentNumber === person.passengerDocument[0].passengerDocumentNumber) {
              _this.selectedPerson.splice(index, 1)
            }
          })
        }
      })
    },
    toPay () {
      const myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/
      if (!this.selectedPerson.length) {
        this.$vux.alert.show({
          content: '请填写乘机人信息'
        })
        return
      }
      if (!this.contactPhone || !this.contactName) {
        this.$vux.alert.show({
          content: '请填写联系人信息'
        })
        return
      }
      if (!myreg.test(this.contactPhone)) {
        this.$vux.alert.show({
          content: '请正确填写联系人手机'
        })
        return
      }

      this.showOrder = true
      const passengerInfo = []
      this.selectedPerson.forEach(item => {
        const arr = {}
        arr.LastName = this.ifDomestic ? item.passengerName : item.passengerPinyinFamilyName
        arr.FirstName = this.ifDomestic ? '' : item.passengerPinyinName
        arr.birthday = moment(item.passengerBirthday, 'YYYYMMDD').unix()
        arr.gender = item.passengerGender
        arr.mobile = item.passengerMobile
        arr.cardNum = item.passengerDocument[0].passengerDocumentNumber
        arr.cardType = item.passengerDocument[0].passengerDocumentType
        arr.cardIssuePlace = this.ifDomestic ? '' : item.passengerNationality
        arr.cardExpired = this.ifDomestic ? '' : moment(item.passengerDocument[0].passengerCardExpired).format('YYYYMMDD')
        arr.nationality = this.ifDomestic ? '' : item.passengerNationality
        arr.isDefault = item.isDefault ? 1 : 0
        arr.personType = item.ageType
        arr._id = item._id ? item._id.$id : ''
        const languageTypeTest = /^[A-Za-z]*$/
        if (languageTypeTest.test(arr.LastName)) {
          arr.languageType = 'EN'
        } else {
          arr.languageType = 'ZH'
        }
        passengerInfo.push(arr)
      })
      const newFromSegments = []
      this.flightsData.fromSegments.forEach(item => {
        const from = {}
        from.aircraftCode = item.aircraftCode
        from.arrAirport = item.arrAirport
        from.arrTime = item.arrTime
        from.cabin = item.cabin
        from.carrier = item.carrier
        from.codeShare = item.codeShare
        from.depAirport = item.depAirport
        from.depTime = item.depTime
        from.flightNumber = item.flightNumber
        from.stopCities = item.stopCities
        from.duration = item.duration
        from.seats = item.seats
        from.canbinClass = item.canbinClass
        newFromSegments.push(from)
      })
      const newRetSegments = []
      this.flightsData.retSegments.forEach(item => {
        const ret = {}
        ret.aircraftCode = item.aircraftCode
        ret.arrAirport = item.arrAirport
        ret.arrTime = item.arrTime
        ret.cabin = item.cabin
        ret.carrier = item.carrier
        ret.codeShare = item.codeShare
        ret.depAirport = item.depAirport
        ret.depTime = item.depTime
        ret.flightNumber = item.flightNumber
        ret.stopCities = item.stopCities
        ret.seats = item.seats
        ret.duration = item.duration
        ret.canbinClass = item.canbinClass
        newRetSegments.push(ret)
      })
      setTimeout(() => {
        this.$router.replace({path: '/home/order'})
      }, 2000)
    },
    editPerson (id) {
      this.addNew = false
      this.showEditPerson = true
      this.personList.forEach(item => {
        if (item.passengerDocument[0].passengerDocumentNumber === id) {
          this.personData = Object.assign({}, item)
          this.personData.passengerDocumentType = item.passengerDocument[0].passengerDocumentType
          this.personData.passengerDocumentNumber = item.passengerDocument[0].passengerDocumentNumber
          this.personData.passengerCardExpired = item.passengerDocument[0].passengerCardExpired
          this.personData.passengerCardIssuePlace = item.passengerDocument[0].passengerCardIssuePlace
          this.countryList.forEach(country => {
            if (country._id === this.personData.passengerNationality) {
              this.personData.passengerNationality = country.countrycn
            }
          })
        }
      })
    },
    addNewPerson () {
      this.showEditPerson = true
      this.personData = {
        passengerName: '',
        passengerPinyinFamilyName: '',
        passengerPinyinName: '',
        passengerGender: '',
        passengerDocumentType: this.ifDomestic ? 'NI' : 'PP',
        passengerDocumentNumber: '',
        passengerCardExpired: '',
        passengerCardIssuePlace: '',
        passengerBirthday: '',
        passengerMobile: '',
        passengerNationality: '请选择国家',
        passengerEmail: '',
        isDefault: false
      }
      this.addNew = true
    },
    savePerson (id) {
      const phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/
      if (this.personData.passengerName === '') {
        this.$vux.alert.show({
          content: '请填写乘机人姓名'
        })
        return
      }
      if (!this.ifDomestic && this.personData.passengerPinyinFamilyName === '') {
        this.$vux.alert.show({
          content: '请填写乘机人姓氏拼音'
        })
        return
      }
      if (!this.ifDomestic && this.personData.passengerPinyinName === '') {
        this.$vux.alert.show({
          content: '请填写乘机人名字拼音'
        })
        return
      }
      if (this.personData.passengerGender === '') {
        this.$vux.alert.show({
          content: '请填写乘机人性别'
        })
        return
      }
      if (this.personData.passengerMobile === '') {
        this.$vux.alert.show({
          content: '请填写乘机人手机'
        })
        return
      }
      if (!this.ifDomestic && this.personData.passengerNationality === '请选择国家') {
        this.$vux.alert.show({
          content: '请填写乘机人国籍'
        })
        return
      }
      if (this.personData.passengerBirthday === '') {
        this.$vux.alert.show({
          content: '请填写乘机人出生日期'
        })
        return
      }
      if (this.personData.passengerDocumentNumber === '') {
        this.$vux.alert.show({
          content: '请填写乘机人证件号码'
        })
        return
      }
      if (this.personData.passengerDocumentType === '') {
        this.$vux.alert.show({
          content: '请填写乘机人证件类型'
        })
        return
      }
      if (!this.ifDomestic && this.personData.passengerCardExpired === '') {
        this.$vux.alert.show({
          content: '请填写乘机人证件有效期'
        })
        return
      }
      if (!phoneReg.test(this.personData.passengerMobile)) {
        this.$vux.alert.show({
          content: '请正确填写乘机人手机'
        })
        return
      }
      this.countryList.forEach(item => {
        if (item.countrycn === this.personData.passengerNationality) {
          this.personData.passengerNationality = item._id
        }
      })

      const saveData = {
        passengerName: this.personData.passengerName,
        passengerPinyinFamilyName: this.personData.passengerPinyinFamilyName,
        passengerPinyinName: this.personData.passengerPinyinName,
        passengerGender: this.personData.passengerGender,
        passengerDocument: [
          {
            passengerDocumentType: this.personData.passengerDocumentType,
            passengerDocumentNumber: this.personData.passengerDocumentNumber,
            passengerCardExpired: this.personData.passengerCardExpired,
            passengerCardIssuePlace: this.personData.passengerNationality
          }
        ],
        passengerBirthday: this.personData.passengerBirthday,
        passengerMobile: this.personData.passengerMobile,
        passengerNationality: this.personData.passengerNationality,
        passengerEmail: this.personData.passengerEmail,
        isDefault: this.personData.isDefault,
        selected: true,
        ageType: 0
      }

      if (this.addNew) {
        if (moment(this.personData.passengerBirthday).add(12, 'y').isBefore(moment().format('YYYY-MM-DD'))) {
          saveData.ageType = 0
        } else {
          saveData.ageType = 1
        }
        this.personList.push(saveData)
        this.addNew = false
      } else {
        this.personList.forEach((item, index) => {
          if (item.passengerDocument[0].passengerDocumentNumber === id) {
            if (moment(item.passengerBirthday).add(12, 'y').isBefore(moment().format('YYYY-MM-DD'))) {
              saveData.ageType = 0
              Object.assign(this.personList[index], saveData)
            } else {
              saveData.ageType = 1
              Object.assign(this.personList[index], saveData)
            }
          }
        })
        this.selectedPerson.forEach((item, index) => {
          if (item.passengerDocument[0].passengerDocumentNumber === id) {
            if (moment(item.passengerBirthday).add(12, 'y').isBefore(moment().format('YYYY-MM-DD'))) {
              saveData.ageType = 0
              Object.assign(this.selectedPerson[index], saveData)
            } else {
              saveData.ageType = 1
              Object.assign(this.selectedPerson[index], saveData)
            }
          }
        })
      }
      this.showEditPerson = false
    },
    quit () {
      const _this = this
      this.$vux.confirm.show({
        content: '确定退出当前机票购买？',
        onConfirm () {
          _this.$router.go(-1)
        }
      })
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

<style lang="sass">
  .del-icon:before,.edit-icon:before
    font-size: 18px
</style>
