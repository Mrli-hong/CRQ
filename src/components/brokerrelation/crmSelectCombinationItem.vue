<template>
  <div class="economic-relations-item" :class="{ view: showView }">
    <h-button
      v-if="needAdd && !showView"
      type="primary"
      class="add"
      @click.native="addData"
      >{{ addText }}</h-button
    >
    <h-form
      ref="form"
      :model="form"
      :label-width="70"
      errorFocus
      v-if="form.data && form.data.length > 0"
    >
      <div
        class="item-wrap mg-b-15"
        v-for="(dataItem, m) in form.data"
        :key="dataItem[rowKey]"
      >
        <h-row class="head" v-if="showHeader">
          <h-col span="7">
            <h-form-item
              :prop="'data.' + m + '.startDate'"
              required
              :label="startDateText"
            >
              <p v-if="showView">{{ getDateViewStr(dataItem.startDate) }}</p>
              <h-date-picker
                v-else
                type="date"
                placement="bottom-end"
                :placeholder="startDateText"
                v-model="dataItem.startDate"
                :options="dataItem.startDateOptions"
                @on-change="onChangeStartDate(m)"
              ></h-date-picker>
            </h-form-item>
          </h-col>
          <h-col span="9">
            <h-form-item :label="endDateText">
              <h-row>
                <h-col span="7" v-if="!showView">
                  <h-checkbox
                    v-model="dataItem.longTerm"
                    @on-change="changeTerm(dataItem.longTerm, m)"
                    :disabled="showView"
                    >长期</h-checkbox
                  >
                </h-col>
                <h-col span="17" v-if="!dataItem.longTerm || showView">
                  <h-form-item
                    :prop="'data.' + m + '.endDate'"
                    required
                    class="no-lable"
                  >
                    <p v-if="showView">
                      {{ getDateViewStr(dataItem.endDate) }}
                    </p>
                    <h-date-picker
                      v-else
                      type="date"
                      placement="bottom-end"
                      :placeholder="endDateText"
                      v-model="dataItem.endDate"
                      :options="dataItem.options"
                      @on-open-change="onOpenChangeEndDate(m)"
                      :readonly="dataItem.longTerm"
                    ></h-date-picker>
                  </h-form-item>
                </h-col>
              </h-row>
            </h-form-item>
          </h-col>
          <h-col span="7" v-if="needDoubleCount">
            <h-form-item
              :prop="'data.' + m + '.chnDoubleCalFlag'"
              :label-width="140"
              :label="'是否与归属渠道双算'"
            >
              <p v-if="showView">
                {{ dataItem.chnDoubleCalFlag ? '是' : '否' }}
              </p>
              <h-checkbox v-else v-model="dataItem.chnDoubleCalFlag"
                >是</h-checkbox
              >
            </h-form-item>
          </h-col>
          <h-col span="7" v-if="needRadio">
            <h-form-item
              :prop="'data.' + m + '.drawRadio'"
              required
              :label="radioText"
            >
              <p v-if="showView">{{ dataItem.drawRadio }}%</p>
              <h-typefield
                v-else
                v-model.trim="dataItem.drawRadio"
                placeholder="请输入"
                style="width: 100%"
                isround
                :min="0"
                :max="100"
              >
                <span slot="append">%</span>
              </h-typefield>
            </h-form-item>
          </h-col>
          <div class="trash">
            <h-icon
              name="trash"
              @click.native="deleteData(m)"
              v-if="!showView && trashShow"
            ></h-icon>
          </div>
        </h-row>
        <div class="table-wrap" v-if="tableShow">
          <table
            width="100%"
            border="0"
            bordercolor="#dce1e7"
            cellpadding="0"
            cellspacing="0"
            class="no-lable"
            style="table-layout: fixed"
          >
            <tr>
              <th
                v-for="(item, i) in columns"
                :key="i + item.key"
                :width="item.width"
              >
                {{ item.title }}
              </th>
              <th width="85px" v-if="!showView && operationBtn">操作</th>
            </tr>
            <tr v-for="(obj, j) in dataItem.data" :key="obj.relationSortKeyId">
              <td
                v-for="(item, i) in obj.columns"
                :key="item.relationSortKeyId"
                :width="item.width"
              >
                <div
                  v-if="item.type === 'selectTableSimple'"
                  style="height: 26px"
                >
                  <h-form-item
                    :validRules="selectTableSimpleRule"
                    required
                    :prop="'data.' + m + '.data.' + j + '.' + item.key"
                  >
                    <p v-if="showView || obj.editDisabled">
                      {{
                        getSelectSimpleName(
                          obj[item.key],
                          item.labelKey,
                          item.multiple
                        )
                      }}
                    </p>
                    <hddml-select-table
                      v-else
                      v-model="obj[item.key]"
                      :filterable="true"
                      :matchable="true"
                      :queryHandler="
                        (...args) =>
                          getQueryHandler(args, `${dataItem[rowKey]}-${j}`)
                      "
                      :transformBefore="selectTableTransformBefore"
                      :transformAfter="selectTableTransformAfter"
                      showHeader
                      :columns="hddmlColumns"
                      :key="item.relationSortKeyId"
                      :displayValue="obj.user_name"
                      :remote="true"
                      :remoteMethod="
                        (filterKey, target) =>
                          selectTableRemoteMethod(
                            filterKey,
                            target,
                            `${dataItem[rowKey]}-${j}`
                          )
                      "
                      :dropWidth="item.dropWidth || ''"
                      :disabled="item.disabledLinkkey"
                      :ref="'customSelect' + m + '-' + j + '-' + i"
                      :format="['user_name', ' ']"
                      :formatValue="['user_id', ' ']"
                      @onChange="onClear($event, item, m, j, i, obj)"
                      @onSelectSelected="
                        (selection, selected) =>
                          handleSelectChange(
                            selection,
                            selected,
                            item,
                            m,
                            j,
                            i,
                            obj
                          )
                      "
                      :pagination="{
                        pageSize: 5,
                        current: 1,
                        simple: true,
                        showTotal: true,
                      }"
                      :placement="
                        (m === form.data.length - 1 && m >= 1) ||
                        (m === 0 && j >= 4)
                          ? 'top' +
                            '-' +
                            (item.placement ? item.placement : 'start')
                          : 'bottom' +
                            '-' +
                            (item.placement ? item.placement : 'start')
                      "
                    >
                    </hddml-select-table>
                    <!-- <hws-select-table-simple
                      v-else
                      :multiple="item.multiple || false"
                      :filterable="true"
                      :isClearQueryInfo="true"
                      :layout-code="item.layoutcode"
                      :labelKey="item.labelKey"
                      :gsv="item.gsv"
                      :isStrig="true"
                      :layout-output-business-name="
                        item.layoutOutputBusinessName
                      "
                      :key="
                        item.key +
                        m +
                        '' +
                        j +
                        JSON.stringify(item.defaultParams)
                      "
                      :dropWidth="item.dropWidth || ''"
                      :valueKey="item.valueKey"
                      :disabled="item.disabledLinkkey"
                      :backCompleteInfo="true"
                      v-model="obj[item.key]"
                      :ref="'customSelect' + m + '-' + j + '-' + i"
                      :pageSize="5"
                      @onClear="onClear($event, item, m, j, i, obj)"
                      @onSelect="handleSelectChange($event, item, m, j, i, obj)"
                      :placement="
                        (m === form.data.length - 1 && m >= 1) ||
                        (m === 0 && j >= 4)
                          ? 'top' +
                            '-' +
                            (item.placement ? item.placement : 'start')
                          : 'bottom' +
                            '-' +
                            (item.placement ? item.placement : 'start')
                      "
                      :defaultParams="item.defaultParams"
                    /> -->
                  </h-form-item>
                </div>
                <div v-else-if="item.type === 'typefield'" style="height: 26px">
                  <h-form-item
                    required
                    :prop="'data.' + m + '.data.' + j + '.' + item.key"
                  >
                    <p v-if="showView || obj.editDisabled">
                      {{ obj[item.key]
                      }}<span v-if="item.unit">{{ item.unit }}</span>
                    </p>
                    <h-typefield
                      v-else
                      class="custom-input"
                      v-model.trim="obj[item.key]"
                      @on-change="changeTypeField"
                      isround
                      :suffixNum="item.suffixNum"
                      :ref="item.key + m + j"
                      :min="0"
                      :max="100"
                      :readonly="item.disabled"
                    >
                      <span slot="append" v-if="item.unit">{{
                        item.unit
                      }}</span></h-typefield
                    >
                  </h-form-item>
                </div>
                <div v-else-if="item.type === 'checkbox'" style="height: 26px">
                  <h-form-item :label="showView ? '' : item.title">
                    <p v-if="showView || obj.editDisabled">
                      {{ getParsedName(m, j, item.key) }}
                    </p>
                    <h-checkbox
                      v-else
                      v-model="obj[item.key]"
                      :disabled="item.disabled"
                    ></h-checkbox>
                  </h-form-item>
                </div>

                <div v-else style="word-break: break-all">
                  {{ obj[item.key] }}
                </div>
              </td>
              <td width="85px" v-if="!showView && operationBtn">
                <div style="width: 60px" v-if="!obj.editDisabled">
                  <h-icon
                    name="offline"
                    class="mg-l-5 offline"
                    @click.native="deleteRangeEvent(m, j)"
                    v-if="
                      !showView &&
                      dataItem.data.filter((filterObj) => {
                        return !filterObj.editDisabled
                      }).length &&
                      ((!delLastLineOne &&
                        dataItem.data.filter((filterObj) => {
                          return !filterObj.editDisabled
                        }).length !== 1) ||
                        delLastLineOne)
                    "
                  ></h-icon>
                  <h-icon
                    name="addition"
                    class="mg-l-5 addition"
                    @click.native="addRangeEvent(m, j)"
                    v-if="!showView"
                  ></h-icon>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </h-form>
    <status-content
      v-if="(!form.data || form.data.length === 0) && showView"
      :StatusText="StatusText"
    >
    </status-content>
  </div>
</template>
<script>
import StatusContent from './StatusContent.vue'
// 批量引用，现在低码只能批量引用
import HddmlComponents from 'hddml-components'
const { HddmlSelectTable } = HddmlComponents
import api from '../../common/api/index'

import {
  numberToDateStr,
  strToDate,
  accAdd,
  accDiv,
  formatDate,
  isRepeat,
} from '../../common/utils/bizUtil'

export default {
  name: 'economicRelationsItem',
  components: {
    StatusContent,
    HddmlSelectTable,
  },
  props: {
    // 引入引擎的dataSourceMap
    dataSourceMap: {
      type: Object,
      default: () => {},
    },
    // btnSize: {
    //   type: String,
    //   default: 'normal', // 新增经纪关系按钮大小
    // },
    needAdd: {
      type: Boolean,
      default: false,
    },
    needClearEditDisabled: {
      type: Boolean,
      default: false, // 联动是否清除不可以编辑数据（目前只针对,selectTableSimple,typefield）
    },
    needColumns: {
      type: Boolean,
      default: false, // 获取值是否需要columns
    },
    intLoadOne: {
      type: Boolean,
      default: true, // 初始是否加载一条空数据
    },
    delLastLineOne: {
      type: Boolean,
      default: false, // 是否允许删除单行最后一条数据
    },
    operationBtn: {
      type: Boolean,
      default: true,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    needDeleteTip: {
      type: Boolean,
      default: true,
    },
    StatusTextTitle: {
      type: String,
      default() {
        return '该客户未设置经纪关系'
      },
    },
    userTitle: {
      type: String,
      default() {
        return '账户经理'
      },
    },
    radioTitle: {
      type: String,
      default() {
        return '业绩比例'
      },
    },
    addText: {
      type: String,
      default() {
        return '新增经纪关系'
      },
    },
    deleteTip: {
      type: String,
      default() {
        return '确认删除经纪关系吗？'
      },
    },
    deleteTip1: {
      type: String,
      default() {
        return ''
      },
    },
    startDateText: {
      type: String,
      default() {
        return '开始时间'
      },
    },
    endDateText: {
      type: String,
      default() {
        return '结束时间'
      },
    },
    needRadio: {
      type: Boolean,
      default() {
        return false
      },
    }, // 是否需要计提比例
    needDoubleCount: {
      type: Boolean,
      default() {
        return false
      },
    }, // 是否需要双算归属
    radioText: {
      type: String,
      default() {
        return '计提比例'
      },
    },
    // 表格主体是否显示
    tableShow: {
      type: Boolean,
      default() {
        return true
      },
    },
    opType: {
      type: String,
      default() {
        return 'add'
      },
    },
    data: {
      type: Array,
      default() {
        return []
      },
    },
    intData: {
      type: Object,
      default() {
        return ''
      },
    },
    columns: {
      type: Array,
      default() {
        return []
      },
    },
    startDateMoreOrEqualToday: {
      type: Boolean,
      default() {
        // 是否限制开始时间只可以输入大于或等于当天
        return false
      },
    },
    trashShow: {
      // 每个区间段是否可删除
      type: Boolean,
      default() {
        return true
      },
    },
    isLimtNums: {
      // 是否限制每个区间内的经纪关系数
      type: Boolean,
      default() {
        return false
      },
    },
    limtNums: {
      // 每个区间内限制的经纪关系条数
      type: Number,
      default() {
        return 0
      },
    },
    // 单时间段业绩比例必须100%
    isCheckRatio: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    data: {
      handler(newData, oldData) {
        if ((newData && this.opType === 'view') || this.opType === 'edit') {
          this.form.data = this.getShowData()
        }
      },
      deep: true,
      immediate: true,
    },
    opType: {
      handler(newData, oldData) {
        if (newData) {
          this.intPage()
        }
      },
      deep: true,
      immediate: true,
    },
    columns: {
      handler(newData, oldData) {
        if (newData) {
          // let dataItem = this.getDataItem()
          // this.form.data = [...[dataItem]]
          this.intPage()
        }
      },
      deep: true,
      immediate: true,
    },
    'form.data': {
      handler(data) {
        console.log('form.data', data)

        data?.forEach((row) => {
          if (!row[this.rowKey]) {
            // row[this.rowKey] = `${Date.now()}`
            row[this.rowKey] = Math.floor(Math.random() * 1000000)
          }
        })
      },
      deep: false,
    },
  },
  data() {
    const selectTableSimpleRuleFunc = (rule, value, callback) => {
      if (!value) {
        callback(new Error('输入不能为空'))
      }
      let isArrayFlag = Array.isArray(value)
      if (isArrayFlag && JSON.stringify(value) == '[]') {
        callback(new Error('输入不能为空'))
      } else if (!isArrayFlag && JSON.stringify(value) == '{}') {
        callback(new Error('输入不能为空'))
      } else {
        callback()
      }
    }
    return {
      value1: '',
      showView: false,
      dictList: {}, // 查字典的select数据列表
      selectTableSimpleRule: [
        { required: true, test: selectTableSimpleRuleFunc, trigger: 'blur' },
      ],
      userFilterRule: [
        {
          required: true,
          test: selectTableSimpleRuleFunc,
          trigger: ['blur', 'change'],
        },
      ],
      form: {
        data: [],
      },
      StatusText: {
        title: '该客户未设置经纪关系',
        imgurl: require('../../common/styles/images/empty.png'),
        paddingTop: '80px',
        textWidth: '80%',
      },
      gsv: '/g/hswealth.csm/v',
      hddmlColumns: [
        {
          title: '用户名',
          key: 'user_name',
        },
        {
          title: '机构名',
          key: 'org_name',
        },
        {
          title: '手机号',
          key: 'mobile',
        },
      ],
      // hddmlTableData: [],
      filterKeyMap: {},
      rowKey: Symbol('rowKey'),
    }
  },
  created() {
    this.StatusText.title = this.StatusTextTitle
  },
  mounted() {
    this.intPage()
  },
  methods: {
    intPage() {
      if (this.opType === 'view') {
        this.showView = true
      } else {
        this.showView = false
      }
      if (this.opType === 'view' || this.opType === 'edit') {
        this.form.data = this.getShowData()
      }
      if (
        this.opType === 'add' ||
        (this.opType === 'edit' && this.form.data.length === 0)
      ) {
        if (this.intLoadOne) {
          let dataItem = this.getDataItem()
          this.form.data = [...[dataItem]]
        }
      }
    },
    getQueryHandler(args, key) {
      const queryParams = this.filterKeyMap[key] || ''
      const [data, extData] = args
      return this.selectTableQueryHandler(data, extData, queryParams)
    },
    // 低码下拉表格接口数据查询
    async selectTableQueryHandler(data, extData, queryParams = '') {
      console.log(
        '低码下拉表格接口数据查询 -- selectTableQueryHandler',
        data,
        extData
      )
      if (!(this.dataSourceMap && this.dataSourceMap['getToolUserInner'])) {
        return api
          .post(this.gsv + '/getToolUserInner', {
            user_name: queryParams,
            data_right_type: 0,
            page_no: extData.pageSpec.pageNo || 1,
            page_size: extData.pageSpec.pageSize || 5,
          })
          .then((res) => {
            // console.log(
            //   '低码下拉表格接口数据查询 -- selectTableQueryHandler',
            //   res
            // )
            return res.data
          })
      }
      // 数据查询方法, 默认接口
      return (
        this.dataSourceMap &&
        this.dataSourceMap['getToolUserInner']
          .load({
            user_name: queryParams,
            data_right_type: 0,
            page_no: extData.pageSpec.pageNo || 1,
            page_size: extData.pageSpec.pageSize || 5,
          })
          .then((res) => {
            if (res.error_no === 0) {
              // this.hddmlTableData = res?.rows
              return res
            } else {
              this.$hMessage.error(
                res?.error_info || '系统异常，请联系管理员！'
              )
            }
          })
          .catch((e) => {
            this.$hMessage.error(e?.error_info || '系统异常，请联系管理员！')
          })
      )
    },
    // 远程搜索的方法，初始和值变更调用. value 为搜索的值, target 为当前组件实例
    selectTableRemoteMethod(value, target, key) {
      this.filterKeyMap[key] = value
      target.queryData({
        page: {
          current: 1,
        },
      })
    },
    // 数据前置处理的方法。params为分页等基本参数信息， searchExpr为配置的查询表达式
    selectTableTransformBefore(params, searchExpr) {
      console.log(
        '数据前置处理的方法 -- selectTableTransformBefore',
        params,
        searchExpr
      )
      const extData = {
        pageSpec: {
          pageNo: params.page.current,
          pageSize: params.page.size,
        },
      }
      return [params.data, extData]
    },
    // 数据后置处理的方法。res为接口返回的数据
    selectTableTransformAfter(res) {
      console.log('数据后置处理的方法 -- selectTableTransformAfter', res)
      if (res && res.error_no === 0) {
        const selectTableData = res
        return {
          data: selectTableData.rows,
          // 当前页数
          pageNum: selectTableData.current_page || 1,
          // 总页数
          // pageSize: Math.ceil(selectTableData.total / 5),
          pageSize: 5,
          total: selectTableData.total,
        }
      } else {
        this.$hMessage.error((res && res?.error_info) || '数据获取失败')
      }
    },
    validInputMax(value) {
      if (value && value > 100) {
        value = 100
      }
    },
    getDataItem() {
      // 获取初始化的赋值信息
      let intData = {}
      if (this.intData) {
        intData = this.intData || {}
      }
      let subItem = this.getDataSubItem(intData.data || {})
      let todayTime = new Date().getTime()
      let dataItem = {
        startDate: intData.startDate
          ? strToDate(numberToDateStr(intData.startDate))
          : '',
        endDate: intData.endDate
          ? strToDate(numberToDateStr(intData.endDate))
          : '',
        drawRadio: '',
        longTerm: intData.endDate === '20991231',
        startDateOptions: this.startDateMoreOrEqualToday
          ? {
              disabledDate(date) {
                return date && date.valueOf() > todayTime
              },
            }
          : {}, // 开始日期不可选设置规则
        options: {}, // 结束日期不可选设置规则
        data: [subItem],
      }
      if (this.needDoubleCount) {
        dataItem.chnDoubleCalFlag = intData.chnDoubleCalFlag || false
      }
      return dataItem
    },
    getDataSubItem(data) {
      let subItem = {}
      // 写一个id作为循环的key值
      // 生成一个0到99999之间的随机整数
      const randomInt = Math.floor(Math.random() * 100000)
      const formattedInt = String(randomInt).padStart(5, '0')
      // 将字符串转换回数字
      let relationSortKeyId = parseInt(formattedInt, 10)
      subItem.relationSortKeyId = relationSortKeyId
      for (let item of this.columns) {
        subItem[item['key']] =
          data[item['key']] || data[item['key']] === 0 ? data[item['key']] : ''
        // 写一个id作为循环的key值
        item.relationSortKeyId = Math.floor(Math.random() * 1000000)
        if (item['key'] === 'belongPropType' && subItem[item['key']] === '') {
          subItem[item['key']] = '0'
        }
      }
      subItem['columns'] = JSON.parse(JSON.stringify(this.columns))
      if (JSON.stringify(data) == '{}') {
        if (
          this.columns &&
          this.columns.findIndex((x) => x.key === 'org_id') > -1
        ) {
          subItem['columns'].forEach((i) => {
            if (i.key === 'user_id') i.disabledLinkkey = true
          })
        }
      }
      return {
        ...data,
        ...subItem,
      }
    },
    getShowData() {
      let data = JSON.parse(JSON.stringify(this.data))
      for (let item of data) {
        item['longTerm'] = item['endDate'] == '20991231'
        item['startDate'] = item['startDate']
          ? strToDate(numberToDateStr(item['startDate']))
          : ''
        item['endDate'] = item['endDate']
          ? strToDate(numberToDateStr(item['endDate']))
          : ''
        item['drawRadio'] = item['drawRadio']
        item['options'] = {}
        let todayTime = new Date().getTime()
        item['startDateOptions'] = this.startDateMoreOrEqualToday
          ? {
              disabledDate(date) {
                return date && date.valueOf() > todayTime
              },
            }
          : {}
        for (let obj of item.data) {
          let columns = JSON.parse(JSON.stringify(this.columns))
          for (let objColumn of columns) {
            if (objColumn.linkageObjId && objColumn.linkageObjId.length > 0) {
              for (let linkageObj of objColumn.linkageObjId) {
                let index = this.getLinkClearIndex(linkageObj.key)
                if (index || index === 0) {
                  if (
                    objColumn.type === 'selectTableSimple' &&
                    !objColumn.multiple
                  ) {
                    columns[index]['defaultParams'][linkageObj.valueKey] =
                      obj[objColumn.key][objColumn.valueKey] || '-'
                  }
                }
              }
            }
          }
          obj['columns'] = columns
        }
      }
      return data
    },
    handlCustomSelectData(data) {
      this.columns.forEach((item) => {
        if (item.type === 'customSelect') {
          for (let obj of data) {
            let subObj = {}
            subObj[item['valueKey']] = obj[item['key']]
            subObj[item['labelKey']] = obj['custmgName']
            obj[item['key']] = subObj
          }
        }
      })
      return data
    },
    // 新增经纪关系
    addData() {
      let dataItem = this.getDataItem()
      if (this.form.data.length > 0) {
        // this.form.data = this.form.data.concat([dataItem])
        this.form.data = [dataItem].concat(this.form.data)
      } else {
        this.form.data = [...[dataItem]]
      }
    },
    // 删除经纪关系
    deleteData(m) {
      if (!m && m !== 0) {
        return
      }
      let _this = this
      let sureCallBack = function () {
        _this.form.data.splice(m, 1)
      }
      if (this.needDeleteTip) {
        _this.deleteTipEvent(_this.deleteTip1 || _this.deleteTip, sureCallBack)
      } else {
        sureCallBack()
      }
    },
    deleteTipEvent(desc, sureCallBack) {
      desc = desc || '确认删除吗？'
      this.$hMsgBox.confirm({
        title: '提示',
        content: '<p>' + desc + '</p>',
        onOk: () => {
          // this.$emit('delAdjustReason')
          sureCallBack && sureCallBack()
        },
        onCancel: () => {},
      })
    },
    changeTerm(value, m) {
      if (value) {
        this.longTermInt(m)
      } else {
        this.form.data[m].endDate = ''
      }
    },
    longTermInt(m) {
      let data = [...this.form.data]
      data[m].endDate = strToDate('2099-12-31')
      if (data.startDate) {
        let time = data.startDate.getTime()
        if (time > data.endDate.getTime()) {
          data.startDate = ''
        }
      }
      this.form.data = [...data]
      let enddateTime = new Date('2099/12/31').getTime() - 86400000
      if (!this.startDateMoreOrEqualToday) {
        data[m].startDateOptions = {
          disabledDate(date) {
            return date && date.valueOf() > enddateTime
          },
        }
      }
    },
    onChangeStartDate(m) {
      let data = [...this.form.data]
      if (data[m].endDate && data[m].startDate) {
        data[m].endDate =
          data[m].endDate.getTime() >= data[m].startDate.getTime()
            ? data[m].endDate
            : ''
      }
      this.form.data = [...data]
    },
    onOpenChangeEndDate(m) {
      let data = [...this.form.data]
      if (data[m].startDate) {
        let time = data[m].startDate.getTime()
        data[m].options = {
          disabledDate(date) {
            return date && date.valueOf() < time
          },
        }
      }
      this.form.data = [...data]
    },
    // 下划线转换驼峰
    toHump(name) {
      return name.replace(/_(\w)/g, function (all, letter) {
        return letter.toUpperCase()
      })
    },
    getLinkClearIndex(key) {
      if (this.columns === 0 || !key) {
        return false
      }
      for (let i = 0; i < this.columns.length; i++) {
        if (key === this.columns[i].key) {
          return i
        }
      }
      return false
    },
    // 清除编辑状态
    onClear(row, obj, m, j, i, obj2) {
      if (row) return
      if (this.needClearEditDisabled) {
        this.clearClearEditDisabled()
      }
      if (obj.linkageClear && obj.linkageClear.length > 0) {
        for (let objClear of obj.linkageClear) {
          this.form.data[m].data[j][objClear] = ''
        }
      }
      // if (obj.linkageObjId && obj.linkageObjId.length > 0) {
      //   for (let linkageObj of obj.linkageObjId) {
      //     let index = this.getLinkClearIndex(linkageObj.key)
      //     if (index || index === 0) {
      //       this.form.data[m].data[j]['columns'][index]['defaultParams'][
      //         linkageObj.valueKey
      //       ] = '-'
      //     }
      //     if (JSON.stringify(row) == '{}') {
      //       this.form.data[m].data[j]['columns'][index].disabledLinkkey = true
      //     }
      //   }
      // }
    },
    changeTypeField(value, oldValue) {
      if (this.needClearEditDisabled && oldValue) {
        this.clearClearEditDisabled()
      }
    },
    clearClearEditDisabled() {
      for (let item of this.form.data) {
        for (let i = 0; i < item.data.length; i++) {
          if (item.data[i].editDisabled) {
            item.data.splice(i, 1)
            i = i - 1
          }
        }
      }
    },
    handleSelectChange(row, selected, obj, m, j, i, obj2) {
      if (this.needClearEditDisabled) {
        this.clearClearEditDisabled()
      }
      for (let item of this.columns) {
        if (item.type === 'text' && item.linkage === obj.key) {
          this.form.data[m].data[j][item.key] =
            row[item.linkValue] || row[item.key]
        }
      }
      if (obj.linkageClear && obj.linkageClear.length > 0) {
        for (let objClear of obj.linkageClear) {
          this.form.data[m].data[j][objClear] = ''
        }
      }
      // if (obj.linkageObjId && obj.linkageObjId.length > 0) {
      //   for (let linkageObj of obj.linkageObjId) {
      //     let index = this.getLinkClearIndex(linkageObj.key)
      //     if (index || index === 0) {
      //       this.form.data[m].data[j]['columns'][index]['defaultParams'][
      //         linkageObj.valueKey
      //       ] = row[obj.key] || '-'
      //     }
      //     if (obj2.belongPropType && obj2.belongPropType === '1') {
      //       this.form.data[m].data[j]['columns'][index].disabledLinkkey = true
      //     } else {
      //       if (!row.org_id || JSON.stringify(row.org_id) == '{}') {
      //         this.form.data[m].data[j]['columns'][index].disabledLinkkey = true
      //       } else {
      //         this.form.data[m].data[j]['columns'][
      //           index
      //         ].disabledLinkkey = false
      //       }
      //     }
      //   }
      // }
    },
    getFormData() {
      let data = JSON.parse(JSON.stringify(this.form.data))
      let selectTableSimple = []
      for (let item of this.columns) {
        if (item.type === 'selectTableSimple') {
          selectTableSimple.push({
            key: item.key,
            valueKey: item.valueKey,
            multiple: item.multiple,
          })
        }
      }
      if (selectTableSimple.length === 0) {
        if (!this.needColumns) {
          for (let item of data) {
            for (let obj of item.data) {
              if (obj.columns) {
                delete obj.columns
              }
            }
          }
        }
        return data
      }
      for (let item of data) {
        for (let obj of item.data) {
          obj['org_name'] = obj.org_id ? obj.org_id.org_name || '' : ''

          if (!this.needColumns) {
            if (obj.columns) {
              delete obj.columns
            }
          }
          selectTableSimple.forEach((el) => {
            let keyName = el['key']
            let valueName = el['valueKey']
            let objKeyValue = obj[keyName]
            let objKey = ''
            if (el.multiple) {
              objKeyValue.forEach((m) => {
                objKey = objKey + m[valueName] + ','
              })
              obj[keyName] = objKey && objKey.substring(0, objKey.length - 1)
            } else {
              // obj[keyName] = objKeyValue[valueName]
              // obj['user_name'] = objKeyValue['user_name']
              obj[keyName] = objKeyValue
              obj['user_name'] = objKeyValue
            }
          })
        }
      }
      return data
    },
    addRangeEvent(m, j) {
      let intData = {}
      if (this.intData) {
        intData = this.intData || {}
      }
      if (this.isLimtNums) {
        if (
          this.form.data[m].data &&
          this.form.data[m].data.length >= this.limtNums
        )
          return this.$hMessage.warning(
            '最多只能设置' + this.limtNums + '条数据！'
          )
      }
      let subItem = this.getDataSubItem(intData.data || {})
      this.form.data[m].data.splice(j + 1, 0, subItem)
      if (this.needClearEditDisabled) {
        this.clearClearEditDisabled()
      }
    },
    deleteRangeEvent(m, j) {
      let _this = this
      let sureCallBack = function () {
        _this.form.data[m].data.splice(j, 1)
        if (_this.form.data[m].data.length === 0) {
          _this.form.data.splice(m, 1)
        }
        if (_this.needClearEditDisabled) {
          _this.clearClearEditDisabled()
        }
      }
      if (this.needDeleteTip) {
        _this.deleteTipEvent(_this.deleteTip, sureCallBack)
      } else {
        sureCallBack()
      }
    },
    // 比较函数
    compare(property) {
      return function (a, b) {
        var value1 = a[property]
        var value2 = b[property]
        return value1 - value2
      }
    },
    // 校验时间段
    validateTimeLine(data) {
      return new Promise((resolve, reject) => {
        if (data && data.length > 0) {
          data.sort(this.compare('startDate'))
          let minList = []
          let maxList = []
          for (let item of data) {
            minList.push(item.startDate)
            maxList.push(item.endDate)
          }
          for (let j = 1; j < minList.length; j++) {
            if (minList[j] <= maxList[j - 1]) {
              reject('时间区间存在重叠')
              return
            }
          }
          // 校验时间合理性
          data.forEach((x) => {
            if (parseInt(x.endDate) < parseInt(x.startDate)) {
              reject('开始时间应不大于结束时间,请修改~')
            }
          })
        } else {
          reject('数据不能为空~')
          return
        }
        resolve(true)
      })
    },
    // 校验时间段内业绩比例
    validateProfitsum(data) {
      return new Promise((resolve, reject) => {
        // 根据配置项来判断是否校验，单时间段业绩比例必须100%
        if (this.isCheckRatio) {
          if (data && data.length > 0) {
            // 校验业绩比例
            data.forEach((item) => {
              // 将业绩比例百分数换成小数
              let profitsum = 0
              let itemArray = item.data
              itemArray.forEach((element) => {
                profitsum = accAdd(
                  profitsum,
                  accDiv(parseFloat(element.radio), 100)
                )
              })
              if (profitsum != 1) {
                reject(`${this.radioTitle}之和需为100%,请修改~`)
                // this.$hMessage.error(`${this.radioTitle}之和需为100%,请修改`)
              } else {
                item.data.forEach((element) => {
                  element.radio = element.radio || 0
                  element.radio = accDiv(element.radio, 100)
                })
              }
            })
          } else {
            reject('数据不能为空~')
            return
          }
        }
        resolve(data)
      })
    },
    // 校验区间段内人员是否重复
    validatePeopleRepeat() {
      return new Promise((resolve, reject) => {
        const data = this.getFormData()
        if (data && data.length > 0) {
          let custmgIds = []
          for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].data.length; j++) {
              custmgIds.push(data[i].data[j].user_id.user_id)
            }
          }
          if (isRepeat(custmgIds)) {
            resolve(false)
            return this.$hMessage.warning('同一区间人员不能重复！')
          } else {
            resolve(true)
          }
        }
      })
    },
    getDateViewStr(date) {
      if (!date) {
        return ''
      }
      return numberToDateStr(formatDate(date))
    },
    getSelectSimpleName(data, labelKey, multiple) {
      if (!data || !labelKey) {
        return ''
      }
      if (!multiple) {
        return data[labelKey] || ''
      }
      if (Array.isArray(data) && data.length > 0) {
        let name = ''
        for (let item of data) {
          name = item[labelKey] + (name ? ',' : '') + name
        }
        return name
      }
    },
    // 详情取传递的翻译值,针对,select,customSelect,checkBox
    getParsedName(m, j, key) {
      return this.form.data[m].data[j]['parsed_' + key] || ''
    },
    getParsedSelectName(dict, m, j, key) {
      let curvalue = this.form.data[m].data[j][key]
      if (this.dictList[dict] && this.dictList[dict].length > 0) {
        for (let item of this.dictList[dict]) {
          if (item.value == curvalue) {
            return item.lable || curvalue
          }
        }
      }
      return curvalue
    },
  },
}
</script>
<style scoped lang="scss">
.mg-b-15 {
  margin-bottom: 15px;
}

.economic-relations-item {
  ::v-deep .icon-close.h-icon-close {
    z-index: 11;
  }

  .add {
    margin: 5px 0 10px;
  }

  td,
  th {
    padding: 0 8px;
  }

  table {
    border: solid #dce1e7 1px;
  }

  td {
    height: 44px;
    padding-bottom: 5px;
    color: #666;
    border-top: solid #dce1e7 1px;
    border-right: solid #dce1e7 1px;

    &:nth-last-child(1) {
      border-right: 0;
    }
  }

  th {
    height: 30px;
    background: #f7f7f7;
    font-size: 12px;
    color: #333333;
    font-weight: 400;
    border-right: solid #dce1e7 1px;

    &:nth-last-child(1) {
      border-right: 0;
    }
  }

  .offline.h-icon {
    color: #bb291e;
    font-size: 20px;
    cursor: pointer;
  }

  .addition.h-icon {
    color: #0270da;
    font-size: 20px;
    cursor: pointer;
  }

  .item-wrap {
    ::v-deep .iconfont.icon-trash {
      font-size: 20px;
    }

    .no-lable {
      ::v-deep .h-form-item-content {
        margin-left: 0 !important;
      }

      ::v-deep .h-form-item-requiredIcon {
        display: none !important;
      }
    }

    .head {
      background: #f7f7f7;
      border: 1px solid #dce1e7;
      border-bottom: none;
      padding: 4px 0;
      position: relative;

      ::v-deep .h-form-item {
        margin-bottom: 0;
      }

      ::v-deep .h-form-item-label {
        background: transparent;
      }
    }

    ::v-deep .trash {
      position: absolute;
      right: 10px;
      color: #ee4747;
    }
  }

  &.view {
    .head {
      background-color: #fff;
    }
  }
}
</style>
