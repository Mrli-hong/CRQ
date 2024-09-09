<template>
  <div style="padding: 16px; overflow-y: auto; height: 100%">
    <div class="notice">
      <div class="fn-top">提示:</div>
      <div class="fn-bottom">如原{{userTitle}}已设量，此处批量设置{{userTitle}}，时间轴将与原{{userTitle}}时间轴结合，重合时间以新调整为准，非重合时间，原时间轴关系仍存在，做截断处理</div>
    </div>
      
    <div style="height: 300px">
      <div class="tong-title clearf mg-b-10 mg-t-16" style="margin-top: 3px">
        <div class="fn-left">
          <em></em>
          <span>已选择{{ objectNumber }}个{{ objectName }}</span>
        </div>
      </div>
      <h-table
        height="250"
        :columns="accountColumns"
        :data="relationData"
      ></h-table>
    </div>

    <div>
      <div class="relation-wrap">
        <div class="tong-title clearf mg-b-10 mg-t-16" style="margin-top: 3px">
          <div class="fn-left">
            <em></em>
            <span>调整后的{{ relationName }}设置</span>
          </div>
        </div>
        <brokerRelationFormCommon
          :client_ids="client_ids"
          :dataSourceMap="dataSourceMap"
          :relationColumns="relationColumns"
          :userTitle="userTitle"
          :radioTitle="radioTitle"
          :relationName="relationName"
          :actionCode="'append'"
          :submitInterface="submitInterface"
          :submitParameters="submitParameters"
          :isCheckRatio="isCheckRatio"
          :isNeedMain="isNeedMain"
          :startDateMoreOrEqualToday="false"
          @canceled="cancel"
          @refreshPage="close"
          :intData="intData"
        ></brokerRelationFormCommon>
      </div>
    </div>
  </div>
</template>
<script>
import brokerRelationFormCommon from '../brokerrelation/brokerRelationFormCommon.vue' // 修改经纪关系(通用版本)

export default {
  name: 'LotAllocationRelationship',
  components: {
    brokerRelationFormCommon,
  },
  props: {
    // 引入引擎的dataSourceMap
    dataSourceMap: {
      type: Object,
      default: () => {},
    },
    objectName: {
      type: String,
      default: '账户',
    },
    objectNumber: {
      type: Number,
      default: 0,
    },
    accountQueryName: {
      type: String,
      default: 'csm.getCustomerinfoListInner',
    },
    accountQueryCondition: {
      type: Object,
      default: () => {},
    },
    accountColumns: {
      type: Array,
      default: () => [],
    },
    relationName: {
      type: String,
      default: '账户经纪关系',
    },
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
  data() {
    return {
      // gsv: '/g/hswealth.csm/v',
      requestParams: {},
      client_ids: '',
      intData: {
        startDate: '',
        endDate: '20991231',
        data: {
          profit_rate: 0,
        },
      },
      relationData: [],
      userTitle:'账户经理',
      radioTitle:'业绩比例'
    }
  },
  methods: {
    // 使用模板字符串和标签函数来构建最终的配置字符串
    // interpolate(template, data) {
    //   return template.replace(/\$\{url\.(\w+)\}/g, (match, key) => {
    //     return data[key] || match // 如果数据中存在该键，则替换；否则保留原始占位符
    //   })
    // },
    // 获取账户表格数据
    getRelationTableData() {
      console.log('this.dataSourceMap----', this.dataSourceMap)
      // 数据查询方法, 默认接口
      this.dataSourceMap &&
        this.dataSourceMap[this.accountQueryName]
          // 查询条件的配置项
          .load(this.accountQueryCondition)
          .then((res) => {
            if (res.error_no === 0) {
              // console.log('getRelationTableData----', res)
              this.relationData = res.rows
            } else {
              this.$hMessage.error(res?.error_info || '系统异常，请联系管理员！')
            }
          })
          .catch((e) => {
            this.$hMessage.error(e?.error_info || '系统异常，请联系管理员！')
          })
    },
    // 取当年开始时间
    getStartDate() {
      let date = new Date()
      let year = date.getFullYear()
      this.intData.startDate = year + '0101'
    },
    close() {
      this.submitSuccessCallback()
    },
    cancel() {
      this.cancelCallback()
    },
    getRationTitle(){
      this.userTitle = this.relationColumns.find((item) => item.key == 'custmg_id')?.title
      this.radioTitle = this.relationColumns.find((item) => item.key == 'radio')?.title
    }
  },
  created() {
    this.client_ids = this.accountQueryCondition?.client_ids || ''

    this.getStartDate()
    this.getRelationTableData()
    this.getRationTitle()
  },
}
</script>

<style lang="scss" scoped>
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

.notice {
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-wrap: wrap;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 5px;
  line-height: 20px;
  background: #f7f7f7;
}
</style>
