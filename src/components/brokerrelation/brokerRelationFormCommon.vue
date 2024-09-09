<template>
  <div class="modify-brokerrelation">
    <crm-selectCombinationItem
      :columns="columns"
      :dataSourceMap="dataSourceMap"
      :needAdd="needAdd"
      :showHeader="showHeader"
      :isCheckRatio="isCheckRatio"
      :startDateMoreOrEqualToday="startDateMoreOrEqualToday"
      :data="data"
      class="mg-t-10"
      :opType="'edit'"
      ref="selectCombinationItem"
      :addText="'新增时间段'"
      :startDateText="'生效日期'"
      :endDateText="'失效日期'"
      :deleteTip="deleteTip"
      :deleteTip1="'确认删除该时间段吗？'"
      :intData="intData"
      :userTitle="userTitle"
      :radioTitle="radioTitle"
    ></crm-selectCombinationItem>
    <h-form>
      <h-form-item label :label-width="0" style="margin-top: 10px">
        <h-input
          v-model="alterReason"
          type="textarea"
          placeholder="调整原因..."
        ></h-input>
        <!-- <h-checkbox v-model="applyChangeWithRelation" v-if="showApplyChange"
          >按照客户的主要财富顾问调整客户在途的预约、合同申请</h-checkbox
        > -->
      </h-form-item>
    </h-form>
    <div class="bottom-btn">
      <h-button-group>
        <h-button type="ghost" @click="cancel">取消</h-button>
        <!-- v-if="opType !== 'view'" -->
        <h-button type="primary" :loading="loading" @click="validate"
          >提交</h-button
        >
      </h-button-group>
    </div>
  </div>
</template>
<script>
import crmSelectCombinationItem from './crmSelectCombinationItem.vue' // 基本信息
import {
  formatDate,
  accMulti,
  // getCustomerCode,
  // getIndustryCode,
} from '../../common/utils/bizUtil'
import customerUtil from '../../common/utils/customerUtil'

export default {
  name: 'mainBrokerRelation',
  // inject: ['indexBrokerData'],
  components: {
    crmSelectCombinationItem,
  },
  props: {
    // 引入引擎的dataSourceMap
    dataSourceMap: {
      type: Object,
      default: () => {},
    },
    // 入参
    clientId: {
      type: String,
      default() {
        return ''
      },
    },
    client_ids: {
      type: String,
      default() {
        return ''
      },
    },
    actionCode: {
      type: String,
      default() {
        return ''
      },
    },
    brList: {
      type: Array,
      default() {
        return []
      },
    },
    startDateMoreOrEqualToday: {
      type: Boolean,
      default() {
        return false
      },
    },
    intData: {
      type: Object,
      default() {
        return ''
      },
    },
    // 配置是否显示 column
    relationColumns: {
      type: Array,
      default() {
        return []
      },
    },
    userTitle: {
      type: String,
      default: '账户经理',
    },
    radioTitle: {
      type: String,
      default: '业绩比例',
    },
    relationName: {
      type: String,
      default: '账户经纪关系',
    },
    // 提交接口
    submitInterface: {
      type: String,
      default: 'csm.putFundBrokerrelationInner',
    },
    submitParameters: {
      type: Object,
      default: () => {},
    },
    // 单时间段业绩比例必须100%
    isCheckRatio: {
      type: Boolean,
      default: true,
    },
    // 单时间段内，必须要有一个主要
    isNeedMain: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    relationColumns: {
      handler(newData, oldData) {
        // console.log('relationColumns', newData)
        if (newData) {
          this.iniShowColumns()
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      opTye: 'edit',
      // gsv: window.HSWEALTH_CSM_CONFIG.GSV,
      gsv: '/g/hswealth.csm/v',
      loading: false,
      needAdd: true,
      showHeader: true,
      // showApplyChange: false,
      deleteTip:`确认删除该${this.userTitle}吗？`,
      columns: [
        {
          title: '账户经理',
          key: 'custmgId',
          type: 'selectTableSimple', // 单选data中custmgId为对象，多选data中custmgId为数组
          layoutcode: 'CSM_L0000020',
          multiple: false,
          valueKey: 'user_id',
          labelKey: 'user_name',
          dropWidth: 700,
          // gsv: window.HSWEALTH_CSM_CONFIG.GSV,
          gsv: '/g/hswealth.csm/v',
          defaultParams: { user_id: '', need_page: '1', data_right_type: '0' },
          linkage: 'custmgId',
        },
        {
          title: '手机号码',
          key: 'mobile',
          type: 'text',
          linkage: 'custmgId',
          linkValue: 'mobile',
        },
        {
          title: '部门',
          key: 'orgName',
          type: 'text',
          linkage: 'custmgId',
          linkValue: 'org_name',
        },
        {
          title: '是否主要',
          key: 'brMainFlag',
          type: 'checkbox',
        },
        {
          title: '业绩比例',
          key: 'radio',
          type: 'typefield',
          unit: '%',
          suffixNum: 2,
        },
      ],
      data: [],
      alterReason: '',
    }
  },
  created() {
    this.getData()
    this.iniShowColumns()
  },
  beforeMount() {},
  methods: {
    // 获取数据
    getData() {
      let _this = this
      let data = JSON.parse(JSON.stringify(_this.brList))
      let dataArray = []
      if (data && data.length > 0) {
        data.forEach((item) => {
          item.forEach((obj) => {
            obj.profitRate = accMulti(obj.profitRate, 100)
            obj.brMainFlag = obj.brMainFlag === '1'
            obj.custmgId = { user_id: obj.custmgId, user_name: obj.custmgName }
          })
          let obj = {
            startDate: item[0]['effectiveDate'],
            endDate: item[0]['invalidDate'],
            data: item,
          }
          dataArray.push(obj)
        })
      }
      let arr2 = JSON.stringify(dataArray)
        .replace(/effectiveDate/g, 'startDate')
        .replace(/invalidDate/g, 'endDate')
        .replace(/profitRate/g, 'radio')
      _this.data = JSON.parse(arr2)
    },
    // 下划线转换驼峰
    toHump(name) {
      return name.replace(/_(\w)/g, function (all, letter) {
        return letter.toUpperCase()
      })
    },
    // 设置是否显示列里面的数据，以及title配置
    iniShowColumns() {
      // 配置是否显示 column，只有在 this.relationColumns 数组中有的才显示，否则配置 isShow 为 false

      // 创建一个映射来存储 relationColumns 中的 key
      const keyMap = new Map()
      this.relationColumns.forEach((item) => {
        let transKey = this.toHump(item.key)
        let newItem = { ...item, key: transKey }
        keyMap.set(transKey, newItem)
      })

      // console.log('this.relationColumns---------', this.relationColumns, 'keyMap---------', keyMap)

      // 遍历 this.columns 并根据 keyMap 设置 isShow
      this.columns.forEach((item) => {
        item.isShow = keyMap.has(item.key)
        if (keyMap.has(item.key)) {
          item.title = keyMap.get(item.key).title
        }
        if(item.key==='radio'){
          item.title += '(%)'
        }
      })
      // 过滤掉isShow为false的列
      this.columns = this.columns.filter((item) => item.isShow)
      // console.log('this.columns---------', this.columns)
    },
    // 取消
    cancel() {
      this.$emit('canceled', false)
    },
    // 校验表单是否合法
    checkparamsData(data) {
      data = JSON.parse(JSON.stringify(data))
      for (let i = 0; i < data.length; i++) {
        let tableData = data[i].data || []
        // 一组中选择主要客户经理的个数
        let majorCustmgCount = 0
        // 客户经理列表
        let custmgIds = []
        for (let j = 0; j < tableData.length; j++) {
          if (tableData[j].brMainFlag == true) {
            majorCustmgCount++
          }
          custmgIds.push(tableData[j].custmgId)
        }

        // 根据配置项决定是否需要校验主要客户经理
        if (this.isNeedMain) {
          if (majorCustmgCount > 1 || majorCustmgCount == 0) {
            this.sendMessage(`一组中有且只有一个主要${this.userTitle}!`)
            return false
          }
        }

        // 是否有重复客户经理
        if (customerUtil.isRepeat(custmgIds)) {
          this.sendMessage(`一组中${this.userTitle}不能重复选择!`)
          return false
        }
      }
      return true
    },
    sendMessage(msg) {
      this.$hMsgBox.confirm({
        title: '提示',
        content: msg,
      })
    },
    // v5.0.0.2    20231024    cjb     T202310114882-11     CRM5.0V202301.07.000     经纪关系审批流优化  beg
    // 排序
    compare(property) {
      return function (a, b) {
        var value1 = a[property]
        var value2 = b[property]
        return value1 - value2
      }
    },
    // v5.0.0.2    20231024    cjb     T202310114882-11     CRM5.0V202301.07.000     经纪关系审批流优化  end
    // 提交校验
    validate() {
      const data = this.$refs.selectCombinationItem.getFormData()
      let paramsData = data ? JSON.parse(JSON.stringify(data)) : []
      if (paramsData.length === 0) {
        this.submit(paramsData)
        return
      }
      this.$refs.selectCombinationItem.$refs.form.validate((valid) => {
        if (valid) {
          paramsData.forEach((item) => {
            item['startDate'] = item['startDate']
              ? formatDate(new Date(item['startDate']))
              : ''
            item['endDate'] = item['endDate']
              ? formatDate(new Date(item['endDate']))
              : ''
          })
          // 校验时间段区间
          this.$refs.selectCombinationItem
            .validateTimeLine(paramsData)
            .then((status) => {
              // 校验时间段内业绩比例,时间段内比例值已转化为实际数
              if (status) {
                this.$refs.selectCombinationItem
                  .validateProfitsum(paramsData)
                  .then((data) => {
                    let flag = this.checkparamsData(data)
                    if (flag) {
                      if (data.length) {
                        data.forEach((itm) => {
                          itm.belong_type = 0 // 用于判断「资产与费用同步设置」
                        })
                      }
                      this.submit(data)
                    }
                  })
                  .catch((value) => {
                    this.sendMessage(value)
                  })
              }
            })
            .catch((value) => {
              this.sendMessage(value)
            })
        }
      })
    },
    handleSubmitData(data) {
      data = JSON.parse(JSON.stringify(data))
      let param = {
        // source_system_code: '3',
        action_code: this.actionCode,
        alter_reason: this.alterReason,
        brokerrelations: [],
      }
      if (this.client_ids) {
        param.client_ids = this.client_ids.split(',')
      } else {
        param.client_id = this.clientId
      }
      // if (this.relationType) {
      //   param['relationType'] = this.relationType
      // }
      // if (this.businessScene) {
      //   param['business_scene'] = this.businessScene
      // }
      param = Object.assign(param, this.submitParameters)
      let relations = []
      if (!data || data.length == 0) {
        return param
      }
      data.forEach((ele, index) => {
        let table = ele.data
        for (let i = 0; i < table.length; i++) {
          let obj = {
            effective_date: ele.effectiveDate
              ? formatDate(ele.effectiveDate)
              : '19700101',
            invalid_date: ele.invalidDate
              ? formatDate(ele.invalidDate)
              : '20991231',
            client_id: this.clientId,
            belong_type: ele.belong_type, // 用于判断「资产与费用同步设置」
            custmg_id: table[i].custmgId,
            profit_rate: table[i].profitRate,
            br_main_flag: table[i].brMainFlag ? '1' : '0',
            adjust_type: '0', // 调整原因:分配
            alter_reason: this.alterReason,
          }
          // if (this.customerCode === '13281') obj.duty_flag =  table[i].duty_flag || ''
          relations.push(obj)
        }
      })
      if (relations && relations.length != 0) {
        param['brokerrelations'] = relations
      }
      return param
    },
    // 提交
    submit(data) {
      let arr2 = JSON.stringify(data)
        .replace(/startDate/g, 'effectiveDate')
        .replace(/endDate/g, 'invalidDate')
        .replace(/radio/g, 'profitRate')
      let param = this.handleSubmitData(JSON.parse(arr2))
      this.loading = true

      console.log('提交接口参数 param----', param)

      // 数据查询方法, 默认接口
      this.dataSourceMap &&
        this.dataSourceMap[this.submitInterface]
          // 查询条件的配置项
          .load(param)
          .then((res) => {
            if (res.error_no == 0) {
              this.$emit('refreshPage', true)
              this.$hMsgBox.success({
                title: '调整成功',
                content: `${this.relationName}调整成功`,
              })
              // 不知道干嘛用的，先注释
              // if (this.client_ids === '') {
              //   this.indexBrokerData.changetype = Math.random()
              // }
            } else {
              this.$hMsgBox.warning({
                title: '调整不成功',
                content: res?.error_info,
              })
              this.loading = false
            }
          })
          .catch((e) => {
            this.$hMessage.error(e?.error_info || '系统异常，请联系管理员！')
            this.loading = false
          })
    },
  },
}
</script>
<style scoped lang="scss">
.modify-brokerrelation {
  // overflow: auto;
  height: 100%;
  margin-bottom: 130px;
  position: relative;
  ::v-deep .economic-relations-item {
    .add {
      margin: 5px 0 10px !important;
    }
  }
  .bottom-btn {
    position: fixed;
    bottom: 0;
    height: 48px;
    line-height: 48px;
    width: calc(100% + 240px);
    left: 0;
    background-color: #fff;
    text-align: center;
    box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.08);
  }
  ::v-deep .h-btn {
    margin: 0 8px;
  }
}
</style>
