const cancelCallbackTemplate = function cancelCallback() {
  //点击取消按钮后的回调事件，比如关闭页签
  console.log('cancelCallbackTemplate')
}

const submitSuccessCallbackTemplate = function submitSuccessCallback() {
  //点击提交按钮成功后的回调事件，比如关闭页签并打开指定页签，刷新新页面
  console.log('submitSuccessCallbackTemplate')
}

module.exports = {
  componentName: 'economicRelationsForm',
  category: '展示类',
  title: '分配关系',
  icon: '',
  docUrl: '',
  docLink: '',
  screenshot: '',
  snippets: [
    {
      title: '分配关系',
      schema: {
        componentName: 'economicRelationsForm',
        props: {
          dataSourceMap: {
            type: 'JSExpression',
            value: 'this.dataSourceMap',
          },
          relationQueryName: 'csm.getBrokerrelationJour',
          relationQueryCondition: { client_id: '', relation_type: 0 },
          relationName: '账户经纪关系',
          relationColumns: [
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
          submitInterface: 'csm.putFundBrokerrelationInner',
          submitParameters: {},
          isCheckRatio: true,
          isNeedMain: true,
        },
      },
    },
  ],
  props: [
    // 引入引擎的dataSourceMap
    {
      name: 'dataSourceMap',
      title: {
        label: 'dataSourceMap',
        tip: 'dataSourceMap引入',
      },
      defaultValue: {
        type: 'JSExpression',
        value: 'this.dataSourceMap',
      },
      propType: 'object',
      setter: 'JsonSetter',
      supportVariable: true,
      condition: {
        type: 'JSFunction',
        value: '() => false',
      },
    },
    {
      title: '查询配置',
      display: 'block',
      type: 'group',
      items: [
        {
          name: 'relationQueryName',
          title: {
            label: '关系查询接口',
            tip: '关系查询接口',
          },
          defaultValue: 'csm.getBrokerrelationJour',
          propType: 'string',
          setter: 'StringSetter',
          supportVariable: true,
        },
        {
          name: 'relationQueryCondition',
          title: {
            label: '查询条件',
            tip: '查询条件',
          },
          propType: 'object',
          setter: 'JsonSetter',
          supportVariable: true,
        },
      ],
    },
    {
      title: '关系配置',
      display: 'block',
      type: 'group',
      items: [
        {
          name: 'relationName',
          title: {
            label: '关系名称',
            tip: '关系名称',
          },
          defaultValue: '账户经纪关系',
          propType: 'string',
          setter: 'StringSetter',
          supportVariable: true,
        },
        {
          name: 'relationColumns',
          title: {
            label: '列：',
            tip: '表格列的配置描述，具体项见下表',
          },
          setter: {
            componentName: 'ArraySetter',
            props: {
              itemSetter: {
                componentName: 'ObjectSetter',
                initialValue: {
                  type: 'JSFunction',
                  value:
                    "() => ({ 'id': Math.random().toString(36).substring(6),'key': '', 'title': '选项', 'align': 'left', 'ellipsis': true, })",
                },
                props: {
                  config: {
                    items: [
                      {
                        name: 'id',
                        propType: 'string',
                        title: '唯一键',
                        setter: 'StringSetter',
                        defaultValue: '',
                        condition: {
                          type: 'JSFunction',
                          value: '() => false',
                        },
                      },
                      {
                        name: 'title',
                        title: {
                          label: '列名称',
                          tip: 'title | 列名称',
                        },
                        propType: {
                          type: 'oneOfType',
                          value: ['string', 'func'],
                        },
                        setter: 'StringSetter',
                        isRequired: true,
                      },
                      {
                        name: 'key',
                        title: {
                          label: '值字段',
                          tip: 'key | 值字段',
                        },
                        propType: 'string',
                        setter: 'StringSetter',
                        isRequired: true,
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      ],
    },
    {
      title: '提交配置',
      display: 'block',
      type: 'group',
      items: [
        {
          name: 'submitInterface',
          title: {
            label: '提交接口',
            tip: '提交接口',
          },
          defaultValue: 'csm.putFundBrokerrelationInner',
          propType: 'string',
          setter: 'StringSetter',
          supportVariable: true,
        },
        {
          name: 'submitParameters',
          title: '提交额外参数',
          propType: 'object',
          setter: 'JsonSetter',
          supportVariable: true,
        },
        {
          name: 'isCheckRatio',
          title: '单时间段业绩比例必须100%',
          setter: 'BoolSetter',
          defaultValue: true,
        },
        {
          name: 'isNeedMain',
          title: '单时间段内，必须要有一个主要',
          setter: 'BoolSetter',
          defaultValue: true,
        },
      ],
    },
    {
      title: '按钮配置',
      display: 'block',
      type: 'group',
      items: [
        {
          name: 'cancelCallback',
          title: {
            label: '取消回调',
            tip: '点击取消按钮后的回调事件，比如关闭页签',
          },
          propType: 'func',
          setter: {
            componentName: 'FunctionSetter',
            props: {
              template: `\n ${cancelCallbackTemplate.toString()} \n`,
            },
          },
          supportVariable: true,
        },
        {
          name: 'submitSuccessCallback',
          title: {
            label: '提交成功后回调',
            tip: '点击提交按钮成功后的回调事件，比如关闭页签并打开指定页签，刷新新页面',
          },
          propType: 'func',
          setter: {
            componentName: 'FunctionSetter',
            props: {
              template: `\n ${submitSuccessCallbackTemplate.toString()} \n`,
            },
          },
          supportVariable: true,
        },
      ],
    },
  ],
  configure: {
    supports: {
      className: true,
      events: [],
      style: true,
    },
  },
}
