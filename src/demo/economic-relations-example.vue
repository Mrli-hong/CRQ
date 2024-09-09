<template>
  <div class="outer-container">
    <h-button @click="lessCol">减少relationColumns</h-button>

    <economicRelationsForm
      :relationQueryCondition="relationQueryCondition"
      :relationColumns="relationColumns2"
    ></economicRelationsForm>

    <!-- ========= -->

    <!-- <LotAllocationRelationship
      :accountColumns="accountColumns"
      :relationColumns="relationColumns"
      :isCheckRatio="true"
    ></LotAllocationRelationship> -->

    <!-- <div>多个的-------------</div>
    <div v-for="(obj, i) in sesData" :key="obj.user_id">
      obj========={{ obj }} =========i==={{ i }}
      <hddml-select-table
        v-model="obj.user_id"
        :dataSource="hddmlTableData"
        :format="['user_id', ' ']"
        :formatValue="['user_name', ' ']"
        :displayValue="obj.user_name"
        :remote="true"
        :queryHandler="selectTableQueryHandler"
        :transformBefore="selectTableTransformBefore"
        :transformAfter="selectTableTransformAfter"
        :columns="hddmlColumns"
        :key="'aa_'+i"
        @onChange="handleChange"
        @onSelectSelected="handleSelectChange"
      >
      </hddml-select-table>
    </div> -->
  </div>
</template>
<script>
import economicRelationsForm from '../components/economic-relations-form/index.vue'
import LotAllocationRelationship from '../components/lot-allocation-relationship/index.vue'
import HddmlComponents from 'hddml-components'

export default {
  components: {
    economicRelationsForm,
    LotAllocationRelationship,
    ...HddmlComponents,
  },
  name: 'economicRelationsExample',
  data() {
    return {
      relationQueryCondition: {
        client_id: 'G00000000021',
        relation_type: 0,
      },
      sesData: [
        {
          user_id: '181',
          user_name: '王小明',
        },
        {
          user_id: '252',
          user_name: '张小刚',
        },
      ],
      accountColumns: [
        {
          title: '账户名称',
          key: 'client_name',
        },
        {
          title: '证件类型',
          key: 'id_kind_name',
        },
        {
          title: '证件号码',
          key: 'id_no',
        },
        {
          title: '手机号码',
          key: 'mobile_phone',
        },
        {
          title: '账户经理',
          key: 'custmg_name',
        },
      ],
      relationColumns2: [
        {
          title: '账户经理',
          key: 'custmg_id',
        },
        // {
        //   title: '手机号码',
        //   key: 'mobile',
        // },
        // {
        //   title: '部门',
        //   key: 'org_name',
        // },
        {
          title: '是否主要',
          key: 'br_main_flag',
        },
        {
          title: '业绩比例(合计需为100%)',
          key: 'profit_rate',
        },
      ],
      relationColumns: [
        {
          title: '账户经理',
          key: 'custmg_id',
        },
        {
          title: '手机号码',
          key: 'mobile',
        },
        {
          title: '部门',
          key: 'org_name',
        },
        {
          title: '是否主要',
          key: 'br_main_flag',
        },
        {
          title: '业绩比例(合计需为100%)',
          key: 'radio',
        },
      ],
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
        {
          title: '用户状态',
          key: 'user_status',
        },
      ],
      hddmlTableData: [
        {
          user_name: '王小明',
          user_id: '181',
          address: '北京市朝阳区芍药居',
        },
        {
          user_name: '张小刚',
          user_id: '252',
          address: '北京市海淀区西二旗',
        },
        {
          user_name: '李小红',
          user_id: '302',
          address: '上海市浦东新区世纪大道',
        },
        {
          user_name: '周小伟',
          user_id: '264',
          address: '深圳市南山区深南大道',
        },
        {
          user_name: '王小明1',
          user_id: '185',
          address: '北京市朝阳区芍药居',
        },
        {
          user_name: '张小刚1',
          user_id: '256',
          address: '北京市海淀区西二旗',
        },
        {
          user_name: '李小红2',
          user_id: '307',
          address: '上海市浦东新区世纪大道',
        },
        {
          user_name: '周小伟2',
          user_id: '268',
          address: '深圳市南山区深南大道',
        },
      ],
    }
  },
  methods: {
    lessCol() {
      this.relationColumns2.pop()
      console.log('this.relationColumns2----', this.relationColumns2)
    },
    // 低码下拉表格接口数据查询
    async selectTableQueryHandler(data, extData) {
      let aaa = {
        rows: [
          {
            user_id: 'aiivr_user',
            user_name: '智能IVR',
            mobile: null,
            org_name: '组织根',
            org_id: '0_000000',
            company_id: '0_000000',
            company_name: '组织根',
            phone: null,
            user_status: '0',
          },
          {
            user_id: 'chenggy',
            user_name: '陈高阳',
            mobile: null,
            org_name: '基金销售部',
            org_id: '0_dept_sale',
            company_id: '0_000000',
            company_name: '组织根',
            phone: null,
            user_status: '0',
          },
          {
            user_id: 'chengjb',
            user_name: '程界斌',
            mobile: '13322213123',
            org_name: '代销一部',
            org_id: '0_dept_channel_1',
            company_id: '0_000000',
            company_name: '组织根',
            phone: null,
            user_status: '0',
          },
          {
            user_id: 'fangj',
            user_name: '方君',
            mobile: null,
            org_name: '机构二部',
            org_id: '0_dept_org_2',
            company_id: '0_000000',
            company_name: '组织根',
            phone: null,
            user_status: '0',
          },
          {
            user_id: 'fengj',
            user_name: '冯杰',
            mobile: null,
            org_name: '机构一部',
            org_id: '0_dept_org_1',
            company_id: '0_000000',
            company_name: '组织根',
            phone: null,
            user_status: '0',
          },
          {
            user_id: 'hfzx01',
            user_name: '回访座席01',
            mobile: null,
            org_name: '基线测试组',
            org_id: '001',
            company_id: '0_000000',
            company_name: '组织根',
            phone: null,
            user_status: '0',
          },
          {
            user_id: 'hfzx02',
            user_name: '回访座席02',
            mobile: null,
            org_name: '基线测试组',
            org_id: '001',
            company_id: '0_000000',
            company_name: '组织根',
            phone: null,
            user_status: '0',
          },
          {
            user_id: 'hfzz01',
            user_name: '回访组长01',
            mobile: null,
            org_name: '基线测试组',
            org_id: '001',
            company_id: '0_000000',
            company_name: '组织根',
            phone: null,
            user_status: '0',
          },
          {
            user_id: 'jianghl',
            user_name: '江浩立',
            mobile: null,
            org_name: '代销一部',
            org_id: '0_dept_channel_1',
            company_id: '0_000000',
            company_name: '组织根',
            phone: null,
            user_status: '0',
          },
          {
            user_id: 'kf01',
            user_name: '客服专员1号',
            mobile: null,
            org_name: '组织根',
            org_id: '0_000000',
            company_id: '0_000000',
            company_name: '组织根',
            phone: null,
            user_status: '0',
          },
        ],
        total: 47,
        current_page: null,
        error_no: 0,
        error_info: '成功',
      }
      if (!(this.dataSourceMap && this.dataSourceMap['getToolUserInner'])) {
        return aaa
      }
      // 数据查询方法, 默认接口
      return (
        this.dataSourceMap &&
        this.dataSourceMap['getToolUserInner']
          .load({
            data_right_type: 0,
            page_no: extData.pageSpec.pageNo || 1,
            page_size: extData.pageSpec.pageSize || 5,
          })
          .then((res) => {
            if (res.error_no === 0) {
              return res
            }
            throw Error(res)
          })
      )
    },
    // 数据前置处理的方法。params为分页等基本参数信息， searchExpr为配置的查询表达式
    selectTableTransformBefore(params, searchExpr) {
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
      if (res && res.error_no === 0) {
        const selectTableData = res
        return {
          data: selectTableData.rows,
          // 当前页数
          pageNum: selectTableData.current_page || 1,
          // 总页数
          pageSize: Math.ceil(selectTableData.total / 5),
          total: selectTableData.total,
        }
      } else {
        this.$hMessage.error(res?.error_info)
      }
    },
    handleSelectChange(a, b) {
      console.log('handleSelectChange---', a, b)
    },
    handleChange(a) {
      console.log('handleChange-----', a)
    },
  },
  created() {},
}
</script>

<style lang="scss" scoped>
// .outer-container {
//   height: 600px;
// }
</style>
