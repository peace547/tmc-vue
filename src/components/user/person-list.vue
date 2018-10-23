<template lang="pug">
view-box(
  :body-padding-top="$store.state.showHeader ? '46px' : '0'"
  body-padding-bottom="0px")
  x-header(
    v-if="$store.state.showHeader"
    slot="header"
    title="人员列表"
    style="position:absolute;top:0;width:100%;z-index:100"
    :leftOptions="leftOptions")
  group(
    gutter="0"
    class="padding-block")
    x-button(
      type="primary"
      @click.native="addNewPerson") 添加新乘机成员
  swipeout
    swipeout-item(
      v-for="(person,index) in personList"
      :key="person.id"
      style="margin-top:5px"
      @click.native="editPerson(person.id)")
      div(slot="right-menu")
        swipeout-button(
          type="warn"
          @click.native.stop="deletePerson(person.id)") 删除
      div(
        slot="content"
        class="padding-block middle-font")
        flexbox
            flexbox-item(:span="8/10")
              div
                div(class="h3")
                  span {{person.passengerName}}
                  span(
                    class="text-success small-font"
                    style="border: 1px solid #19be6b;border-radius: 5px;margin-left: 10px;display: inline-block;line-height: 12px;padding: 0 2px;"
                    v-if="person.isDefault") 默认
                div(class="text-muted") 证件号：{{person.passengerDocument[0].passengerDocumentNumber | formatId}}
                div(class="text-muted") 手机号：{{person.passengerMobile | formatPhone}}
  popup(
    v-model="showEditPerson"
    height="100%"
    :show-mask="false")
    view-box(
      body-padding-top="46px"
      body-padding-bottom="0")
      x-header(
        slot="header"
        :left-options="{backText: '',preventGoBack:true}"
        @on-click-back="showEditPerson=false"
        :title="addNew?'新增人员':'修改人员'"
        style="position:fixed;top:0;left:0;width:100%;z-index:100")
      div(
        class="middle-font text-muted padding-block"
        style="padding-bottom:5px") 乘客信息
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
          placeholder="姓，拼音或英文，如(FEI)")
        x-input(
          title="英文名"
          label-width="35"
          v-model="personData.passengerPinyinName"
          placeholder="名，拼音或英文，如(YANG)")
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
          placeholder="请输入邮箱")
        cell(
          title="国籍"
          is-link
          @click.native="showCountries=true"
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
          placeholder="请选择日期")
      group
        x-switch(
          title="设置为默认乘机人"
          v-model="personData.isDefault")
      div(class="padding-block")
        flexbox
          flexbox-item
            x-button(
              type="default"
              @click.native="showEditPerson=false") 取消
          flexbox-item(v-if="!addNew")
            x-button(
              type="primary"
              @click.native="savePerson(personData.id)") 保存
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
      body-padding-top="46px"
      body-padding-bottom="0px")
      x-header(
        :left-options="{backText: '',preventGoBack:true}"
        title="选择国籍"
        style="position:fixed;top:0;left:0;width:100%;z-index:100"
        @on-click-back="showCountries=false")
      div(style="position:relative;height:44px;")
        search(
          placeholder="请输入要搜索的城市"
          position="absolute"
          v-model="searchVal"
          auto-scroll-to-top)
      scroller(lock-x ref="scrollers" height="-90")
        div
          list-group(
            :gutter="0"
            :data="filteredCountry"
            cell-title="countrycn"
            cell-key="id"
            @click="selectCountry")
</template>

<script>
import moment from 'moment'

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
  name: 'person',
  components: { ListGroup },
  data () {
    return {
      leftOptions: {
        backText: ''
      },
      showEditPerson: false,
      addNew: false,
      personData: {},
      certificateList: [],
      showCountries: false,
      searchVal: '',
      sexList: [{key: 'F', value: '女'}, {key: 'M', value: '男'}],
      countryList: [],
      personList: [],
      curDate: moment().format('YYYY-MM-DD'),
      maxDate: moment().add(100, 'years').format('YYYY-MM-DD')
    }
  },
  created () {
    this.getCustomerPassenngers()

    this.$http
      .post('order/getCardType')
      .then(data => {
        this.certificateList = data
        this.certificateList.forEach(item => {
          item.key = item.value
          item.value = item.name
        })
      })

    this.$http
      .post('order/getAllCountry')
      .then(data => {
        this.countryList = data
      })
  },
  computed: {
    filteredCountry () {
      return this.countryList.filter(country => {
        return country.countrycn.indexOf(this.searchVal) !== -1
      })
    }
  },
  methods: {
    getCustomerPassenngers () {
      this.$store.commit('loading', true)

      return this.$http
        .get('http://localhost:8080/static/data.json')
        .then(data => {
          this.$store.commit('loading', false)
          this.personList = data.personData.map(item => {
            item.passengerBirthday = moment(item.passengerBirthday.sec * 1000).format('YYYY-MM-DD')
            item.isDefault = !!item.isDefault
            return item
          })
        })
        .catch(e => {
          this.$store.commit('loading', false)
        })
    },
    selectCountry (country) {
      this.personData.passengerNationality = country.countrycn
      this.personData.passengerCardIssuePlace = country.countrycn
      this.showCountries = false
    },
    deletePerson (id) {
      const _this = this
      this.$vux.confirm.show({
        content: '确定删除该人员？',
        onConfirm: function () {
          _this.personList.forEach((item, index) => {
            if (item.id === id) {
              _this.personList.splice(index, 1)
            }
          })
        }
      })
    },
    editPerson (id) {
      this.addNew = false
      this.showEditPerson = true
      this.personList.forEach(item => {
        if (item.id === id) {
          this.personData = Object.assign({}, item)
          // this.personData.isDefault = item.isDefault
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
        passengerDocumentType: '',
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
      if (this.personData.passengerPinyinFamilyName === '') {
        this.$vux.alert.show({
          content: '请填写乘机人姓氏拼音'
        })
        return
      }
      if (this.personData.passengerPinyinName === '') {
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
      if (this.personData.passengerNationality === '请选择国家') {
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
      if (this.personData.passengerCardExpired === '') {
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
        id: this.personData.id,
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
        isDefault: this.personData.isDefault
      }

      this.$store.commit('loading', true)
      if (this.addNew) {
        saveData.id = this.personList.length + 1
        if (this.personData.isDefault) {
          this.personList.forEach((item, index) => {
            item.isDefault = false
          })
        }
        this.personList.push(saveData)
        this.addNew = false
      } else {
        if (this.personData.isDefault) {
          this.personList.forEach((item, index) => {
            if (item.id !== id) {
              item.isDefault = false
            }
          })
        }
        this.personList.forEach((item, index) => {
          if (item.id === id) {
            item = {...saveData}
            this.personList.splice(index, 1, item)
          }
        })
      }
      this.$store.commit('loading', false)
      this.showEditPerson = false
    }
  },
  filters: {
    formatPhone (value) {
      return value.replace(value.substr(3, 4), '****')
    },
    formatId (value) {
      return value.replace(/^(.{6})(?:\d+)(.{4})$/, '$1********$2')
    }
  }
}
</script>
