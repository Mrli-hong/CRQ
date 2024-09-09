<template>
  <div class="economicRelations-edit">
    <!-- <h-spin size="large" fix v-if="loading"></h-spin> -->
    <div class="client">
      <div class="flex mg-b-10">
        <div class="tong-title clearf flex align-center">
          <div class="fn-left">
            <em></em>
            <span>{{ relationName }}</span>
          </div>
        </div>
      </div>
      <crm-selectCombinationItem
        v-if="combinationItemShow"
        :columns="columns"
        :dataSourceMap="dataSourceMap"
        :startDateMoreOrEqualToday="false"
        :needAdd="true"
        :data="data"
        class="mg-t-10"
        :opType="opType"
        :isCheckRatio="isCheckRatio"
        ref="economicRelationsItem"
        :addText="'新增时间段'"
        :startDateText="'生效日期'"
        :endDateText="'失效日期'"
        :needDeleteTip="false"
        :intData="intData"
      ></crm-selectCombinationItem>
    </div>
    <div class="mg-t-15">
      <div class="tong-title clearf flex align-center mg-b-15">
        <div class="fn-left">
          <em></em>
          <span>转移原因</span>
        </div>
      </div>
      <h-input
        v-model="adjustReason"
        type="textarea"
        placeholder="调整原因..."
        :rows="3"
        :autosize="{ minRows: 3, maxRows: 6 }"
      ></h-input>
    </div>
    <div class="bottom-btn">
      <h-button @click="cancel">取消</h-button>
      <h-button
        type="primary"
        :loading="loading"
        @click="submit"
        v-if="opType !== 'view'"
        >提交
      </h-button>
    </div>
  </div>
</template>
<script>
import crmSelectCombinationItem from '../brokerrelation/crmSelectCombinationItem.vue'
import {
  listEmpty,
  formatDate,
  isRepeat,
  accDiv,
  accAdd,
  accMulti,
} from '../../common/utils/bizUtil'
import { deepClone } from '../../common/utils/tools'
import api from '../../common/api/index'
import { covertObj } from '../../common/utils/commonUtil'

export default {
  name: 'economicRelationsForm', // 集团查客户服务关系设置
  components: {
    crmSelectCombinationItem,
  },
  props: {
    // 引入引擎的dataSourceMap
    dataSourceMap: {
      type: Object,
      default: () => {},
    },
    // 关系查询接口
    relationQueryName: {
      type: String,
      default: 'csm.getBrokerrelationJour',
    },
    // 查询条件
    relationQueryCondition: {
      type: Object,
      default: () => {},
    },
    // 关系名称
    relationName: {
      type: String,
      default: '账户经纪关系',
    },
    // 关系列
    relationColumns: {
      type: Array,
      default: () => [],
    },
    // 提交接口
    submitInterface: {
      type: String,
      default: 'csm.putFundBrokerrelationInner',
    },
    // 提交额外参数
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
    // 取消回调
    cancelCallback: {
      type: Function,
    },
    // 提交成功后回调
    submitSuccessCallback: {
      type: Function,
    },
  },
  watch: {
    relationColumns: {
      handler(newData, oldData) {
        console.log('relationColumns', newData)
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
      opType: 'edit',
      gsv: '/g/hswealth.csm/v',
      loading: false,
      combinationItemShow: false,
      clientId: '',
      columns: [
        {
          title: '人员',
          key: 'custmg_id',
          type: 'selectTableSimple',
          multiple: false,
          layoutcode: 'CSM_L0000020',
          defaultParams: { data_right_type: '0' },
          valueKey: 'user_id',
          labelKey: 'user_name',
          dropWidth: 700,
          // gsv: window.HSWEALTH_CSM_CONFIG.GSV,
          gsv: '/g/hswealth.csm/v',
        },
        {
          title: '是否主要',
          key: 'br_main_flag',
          type: 'checkbox',
        },
        {
          title: '业绩比例(合计需为100%)',
          key: 'profit_rate',
          type: 'typefield',
          unit: '%',
          suffixNum: 2,
        },
      ],
      data: [],
      intData: {
        startDate: '',
        endDate: '20991231',
        data: {
          profit_rate: 0,
        },
      },
      arr: {
        data: [{}],
      },
      adjustReason: '',
    }
  },
  created() {
    this.getStartDate()
    this.getData()
    this.clientId = this.relationQueryCondition?.client_id || ''
  },
  methods: {
    // 设置是否显示列里面的数据，以及title配置
    iniShowColumns() {
      // 配置是否显示 column，只有在 this.relationColumns 数组中有的才显示，否则配置 isShow 为 false

      // 创建一个映射来存储 relationColumns 中的 key
      const keyMap = new Map()
      this.relationColumns.forEach((item) => {
        // let transKey = this.toHump(item.key)
        let newItem = { ...item, key: item.key }
        keyMap.set(item.key, newItem)
      })

      console.log(
        'this.relationColumns---------',
        this.relationColumns,
        'keyMap---------',
        keyMap
      )

      // 遍历 this.columns 并根据 keyMap 设置 isShow
      this.columns.forEach((item) => {
        item.isShow = keyMap.has(item.key)
        if (keyMap.has(item.key)) {
          item.title = keyMap.get(item.key).title
        }
      })
      // 过滤掉isShow为false的列
      this.columns = this.columns.filter((item) => item.isShow)
      console.log('this.columns---------', this.columns)
    },
    // 取当年开始时间
    getStartDate() {
      let date = new Date()
      let year = date.getFullYear()
      this.intData.startDate = year + '0101'
    },
    getDateTimeString() {
      let date = new Date(),
        year = date.getFullYear(), // 获取完整的年份(4位)
        month = date.getMonth() + 1, // 获取当前月份(0-11,0代表1月)
        strDate = date.getDate() // 获取当前日(1-31)
      if (month < 10) month = `0${month}` // 如果月份是个位数，在前面补0
      if (strDate < 10) strDate = `0${strDate}` // 如果日是个位数，在前面补0
      return `${year}${month}${strDate}`
    },
    // 获取数据
    getData() {
      console.log('this.dataSourceMap----', this.dataSourceMap)
      if (!(this.dataSourceMap && this.dataSourceMap[this.relationQueryName])) {
        api
          .post(
            this.gsv + '/getBrokerrelationJour',
            this.relationQueryCondition
          )
          .then((ores) => {
            let resData = ores.data
            let response = {}
            covertObj(resData, response, false, false)
            let res = response
            // console.log('resData----', resData)
            console.log('res----', res)
            if (res.errorNo === 0) {
              console.log('getRelationTableData----', res)
              if (res.rows && res.rows.length > 0) {
                this.convertBrokerrelations(this.sortFun(res.rows), this.arr)
              }
            } else {
              this.$hMessage.error(res?.errorInfo || '系统异常，请联系管理员！')
            }
            this.combinationItemShow = true
          })
          .catch((e) => {
            this.combinationItemShow = true
            this.$hMessage.error(e?.error_info || '系统异常，请联系管理员！')
          })
      }
      // 数据查询方法, 默认接口
      this.dataSourceMap &&
        this.dataSourceMap[this.relationQueryName]
          // 查询条件的配置项
          .load(this.relationQueryCondition)
          .then((resData) => {
            let response = {}
            covertObj(resData, response, false, false)
            let res = response
            console.log('res----', res)
            if (res.errorNo === 0) {
              console.log('getRelationTableData----', res)
              if (res.rows && res.rows.length > 0) {
                this.convertBrokerrelations(this.sortFun(res.rows), this.arr)
              }
            } else {
              this.$hMessage.error(res?.errorInfo || '系统异常，请联系管理员！')
            }
            this.combinationItemShow = true
          })
          .catch((e) => {
            this.combinationItemShow = true
            this.$hMessage.error(e?.error_info || '系统异常，请联系管理员！')
          })
    },
    // 取消
    cancel() {
      this.cancelCallback()
    },
    // 比较函数
    compare(property) {
      return function (a, b) {
        var value1 = a[property]
        var value2 = b[property]
        return value1 - value2
      }
    },
    // 校验表单是否合法
    checkparamsData(data) {
      // console.log(data)
      return new Promise((resolve, reject) => {
        if (data && data.length > 0) {
          data.sort(this.compare('startDate'))
          let minList = []
          let maxList = []
          // 校验业绩比例
          data.forEach((item) => {
            // 获取时间
            minList.push(item.startDate)
            maxList.push(item.endDate)
            let custmgIds = []
            // 将业绩比例百分数换成小数
            let profitsum = 0
            let profitCount = 0
            item.data.forEach((element) => {
              element.profit_rate = element.profit_rate || 0
              profitsum = accAdd(profitsum, accDiv(element.profit_rate, 100))
              if (element.br_main_flag) {
                profitCount++
              }
              custmgIds.push(element.custmg_id)
            })
            // 是否有重复人员
            if (isRepeat(custmgIds)) {
              reject('一组中人员不能重复选择!')
            }

            // 根据配置项决定是否需要校验主要客户经理
            if (this.isNeedMain) {
              if (profitCount !== 1) {
                reject('一组中有且只有一个主要客户经理！')
              }
            }

            if (profitsum != 1) {
              reject('业绩比例之和需为100%,请修改~')
            } else {
              item.data.forEach((element) => {
                element.profit_rate = element.profit_rate || 0
                element.profit_rate = accDiv(element.profit_rate, 100)
              })
            }
          })
          for (let j = 1; j < minList.length; j++) {
            if (minList[j] <= maxList[j - 1]) {
              reject('时间区间存在重叠,请修改~')
              return
            }
          }

          // 校验时间合理性
          data.forEach((x) => {
            if (parseInt(x.endDate) < parseInt(x.startDate)) {
              reject('开始时间应不大于结束时间,请修改~')
            }
          })
        }
        resolve(JSON.parse(JSON.stringify(data)))
      })
    },
    handleSubmitSucdess() {
      this.loading = false
      this.submitSuccessCallback()
    },
    // 提交
    submit() {
      const data = this.$refs.economicRelationsItem.getFormData()
      let paramsData = data ? JSON.parse(JSON.stringify(data)) : []
      // 判断是否是清空数据
      if (paramsData.length === 0) {
        let params = {
          client_ids: [this.clientId],
          brokerrelations: [],
          // relation_type: '0',
          // group_cust_flag: 1,
          // business_scene: '101',
          alter_reason: this.adjustReason,
        }
        params = Object.assign(params, this.submitParameters)
        console.log('提交接口参数 param----', params)

        this.loading = true
        // 数据查询方法, 默认接口
        this.dataSourceMap &&
          this.dataSourceMap[this.submitInterface]
            // 查询条件的配置项
            .load(params)
            .then((res) => {
              if (res.error_no == 0) {
                this.$hMessage.success('提交成功！')
                this.handleSubmitSucdess()
              } else {
                this.$hMsgBox.warning({
                  title: '提示',
                  content: res?.error_info,
                  onOk: () => {
                    this.handleSubmitSucdess()
                  },
                })
                this.loading = false
              }
            })
            .catch((e) => {
              this.$hMessage.error(e?.error_info || '系统异常，请联系管理员！')
              this.loading = false
            })
      } else {
        this.$refs.economicRelationsItem.$refs.form.validate((valid) => {
          if (valid) {
            paramsData.forEach((item) => {
              item['startDate'] = item['startDate']
                ? formatDate(new Date(item['startDate']))
                : ''
              item['endDate'] = item['endDate']
                ? formatDate(new Date(item['endDate']))
                : ''
            })
            this.checkparamsData(paramsData).then(
              (data) => {
                if (data) {
                  let arr1 = []
                  for (let i = 0; i < data.length; i++) {
                    for (let j = 0; j < data[i].data.length; j++) {
                      data[i].data[j].br_main_flag = data[i].data[j]
                        .br_main_flag
                        ? 1
                        : 0
                      let obj = { ...data[i], ...data[i].data[j] }
                      arr1.push(obj)
                    }
                  }
                  // 适配数据
                  let arr = JSON.parse(
                    JSON.stringify(arr1)
                      .replace(/accountNo/g, 'account_no')
                      .replace(/startDate/g, 'effective_date')
                      .replace(/endDate/g, 'invalid_date')
                  )
                  let params = {
                    client_ids: [this.clientId],
                    brokerrelations: arr,
                    // relation_type: '0',
                    // group_cust_flag: 1,
                    // business_scene: '101',
                    alter_reason: this.adjustReason,
                  }
                  params = Object.assign(params, this.submitParameters)
                  console.log('提交接口参数 param----', params)

                  this.loading = true
                  // 数据查询方法, 默认接口
                  this.dataSourceMap &&
                    this.dataSourceMap[this.submitInterface]
                      // 查询条件的配置项
                      .load(params)
                      .then((res) => {
                        if (res.error_no == 0) {
                          this.$hMessage.success('提交成功！')
                          this.handleSubmitSucdess()
                        } else {
                          this.$hMsgBox.warning({
                            title: '提示',
                            content: res?.error_info,
                            onOk: () => {
                              this.handleSubmitSucdess()
                            },
                          })
                          this.loading = false
                        }
                      })
                      .catch((e) => {
                        this.$hMessage.error(
                          e?.error_info || '系统异常，请联系管理员！'
                        )
                        this.loading = false
                      })
                }
              },
              (err) => {
                this.$hMsgBox.confirm({
                  title: '提示',
                  content: err,
                })
              }
            )
          }
        })
      }
    },
    // 查询数据后转换数据
    convertBrokerrelations(brGroups, baseBrData) {
      let brDataList = []
      brDataList.push(deepClone(baseBrData))
      if (brGroups.length > 0) {
        brGroups.forEach((arr, i) => {
          let timeRow = deepClone(baseBrData)
          timeRow.accountNo = arr[0].accountNo
          timeRow.startDate = arr[0].effectiveDate
          timeRow.endDate = arr[0].invalidDate
          arr.forEach((ele, j) => {
            let lineData = deepClone(timeRow.data[0])
            // lineData.custmg_id = {
            //   user_id: ele.custmgId,
            //   user_name: ele.custmgName,
            // }
            // 原来需要对象，现在只需要id值
            lineData.custmg_id = ele.custmgId
            // 作为显示值
            lineData.user_name = ele.custmgName
            lineData.br_main_flag = Boolean(Number(ele.brMainFlag))
            lineData.profit_rate = ele.profitRate || 0
            lineData.profit_rate = accMulti(lineData.profit_rate, 100)
            timeRow.data.push(lineData)
          })
          // 删除第一行
          timeRow.data.splice(0, 1)
          brDataList.push(timeRow)
        })
        // 删除第一行
        brDataList.splice(0, 1)
      }
      if (listEmpty(brDataList)) {
        brDataList.push(deepClone(baseBrData))
      }
      this.data = brDataList
    },
    sortFun(item) {
      let list = item,
        flag = 0,
        data = [],
        wdy = []
      for (let i = 0; i < list.length; i++) {
        let az = ''
        for (let j = 0; j < data.length; j++) {
          if (
            data[j][0].effectiveDate == list[i].effectiveDate &&
            data[j][0].invalidDate == list[i].invalidDate &&
            data[j][0].accountNo == list[i].accountNo
          ) {
            flag = 1
            az = j
            break
          }
        }
        if (flag == 1) {
          data[az].push(list[i])
          flag = 0
        } else if (flag == 0) {
          wdy = []
          wdy.push(list[i])
          data.push(wdy)
        }
      }
      console.log('sortFun--', data)
      return data
    },
  },
}
</script>
<style scoped lang="scss">
.tong-title .fn-left em {
  width: 4px;
  height: 14px;
  background-color: #037df3;
  display: inline-block;
  vertical-align: middle;
  font-style: normal;
  margin-right: 6px;
}

.tong-title .fn-left span {
  font-size: 14px;
  font-weight: 700;
  color: #333;
  display: inline-block;
  vertical-align: middle;
}

.mg-b-10 {
  margin-top: 3px;
  margin-bottom: 10px;
}

.economicRelations-edit {
  padding: 16px;
  overflow-y: scroll;
  height: 100%;
  padding-bottom: 60px;
  .notice {
    margin-left: 80px;
    color: #333;
  }
  ::v-deep .client {
    position: relative;
  }
  ::v-deep.client .add {
    position: absolute;
    margin-top: -40px;
    margin-left: 110px;
  }
  .bottom-btn {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 15px;
    box-shadow: 2px 0 6px 0 rgba(0, 0, 0, 0.2);
    z-index: 5;
    background: #fff;

    .h-btn {
      margin-right: 5px;
    }
  }
}
</style>
