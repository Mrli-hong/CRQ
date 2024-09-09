const cancelCallbackTemplate = function cancelCallback () {
  //点击取消按钮后的回调事件，比如关闭页签
  console.log("cancelCallbackTemplate")
}

const submitSuccessCallbackTemplate = function submitSuccessCallback () {
  //点击提交按钮成功后的回调事件，比如关闭页签并打开指定页签，刷新新页面
  console.log("submitSuccessCallbackTemplate")
}

module.exports = {
  componentName: 'LotAllocationRelationship',
  category: '展示类',
  title: '批量分配关系',
  icon: '',
  docUrl: '',
  docLink: '',
  screenshot: '',
  snippets: [
    {
      title: '批量分配关系',
      schema: {
        componentName: 'LotAllocationRelationship',
        props: {
          dataSourceMap: {
            type: 'JSExpression',
            value: 'this.dataSourceMap',
          },
          objectName: '账户',
          objectNumber: 0,
          accountQueryName: 'csm.getCustomerinfoListInner',
          accountQueryCondition: { client_ids: '' },
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
          relationName: '账户经纪关系',
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
      title: '已选对象列表配置',
      display: 'block',
      type: 'group',
      items: [
        {
          name: 'objectName',
          title: {
            label: '对象名称',
            tip: '对象名称',
          },
          defaultValue: '账户',
          propType: 'string',
          setter: 'StringSetter',
          supportVariable: true,
        },
        {
          name: 'objectNumber',
          title: {
            label: '对象个数',
            tip: '表示已选择的对象个数',
          },
          propType: 'number',
          setter: 'NumberSetter',
          defaultValue: 0,
        },
        {
          name: 'accountQueryName',
          title: {
            label: '查询接口',
            tip: '查询接口',
          },
          defaultValue: 'csm.getCustomerinfoListInner',
          propType: 'string',
          setter: 'StringSetter',
          supportVariable: true,
        },
        {
          name: 'accountQueryCondition',
          title: {
            label: '查询条件',
            tip: '查询条件',
          },
          propType: 'object',
          setter: 'JsonSetter',
          supportVariable: true,
        },
        {
          name: 'accountColumns',
          title: {
            label: '展示列：',
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
                      {
                        name: 'align',
                        title: {
                          label: '对齐方式',
                          tip: 'align | 对齐方式',
                        },
                        propType: {
                          type: 'oneOf',
                          value: ['left', 'right', 'center'],
                        },
                        defaultValue: 'left',
                        setter: [
                          {
                            componentName: 'SelectSetter',
                            props: {
                              options: [
                                {
                                  title: 'left',
                                  value: 'left',
                                },
                                {
                                  title: 'right',
                                  value: 'right',
                                },
                                {
                                  title: 'center',
                                  value: 'center',
                                },
                              ],
                            },
                          },
                          'VariableSetter',
                        ],
                      },
                      {
                        name: 'fixed',
                        title: {
                          label: '固定列',
                          tip: 'fixed | 列是否固定',
                        },
                        description: '列是否固定，可选不固定和固定在左侧',
                        defaultValue: '',
                        propType: {
                          type: 'oneOf',
                          value: ['', 'left'],
                        },
                        setter: [
                          {
                            componentName: 'SelectSetter',
                            props: {
                              options: [
                                {
                                  title: '不固定',
                                  value: '',
                                },
                                {
                                  title: '固定在左侧',
                                  value: 'left',
                                },
                              ],
                            },
                          },
                          'VariableSetter',
                        ],
                      },
                      {
                        name: 'className',
                        title: {
                          label: '列样式类名',
                          tip: 'className | 列样式类名',
                        },
                        propType: 'string',
                        setter: 'StringSetter',
                      },
                      {
                        name: 'width',
                        title: {
                          label: '列宽度',
                          tip: '列宽度;当值为0时,表示该列未设置宽度属性，未设置宽度的列将等比例自适应剩余宽度',
                        },
                        propType: 'number',
                        setter: {
                          componentName: 'NumberSetter',
                          props: {
                            min: 0,
                          },
                        },
                      },
                      {
                        name: 'hiddenCol',
                        title: {
                          label: '隐藏',
                          tip: 'hiddenCol | 是否隐藏当前列',
                        },
                        propType: 'bool',
                        setter: 'BoolSetter',
                      },
                      {
                        name: 'cusRender',
                        title: {
                          label: '自定义渲染',
                          tip: 'cusRender | 插槽内的物料表达式可通过this.record获取当前行数据',
                        },
                        propType: 'func',
                        setter: [
                          {
                            componentName: 'SlotSetter',
                            title: '单元格插槽',
                            initialValue: {
                              type: 'JSSlot',
                              params: ['record'],
                              value: [],
                            },
                          },
                          'VariableSetter',
                        ],
                      },
                      {
                        name: 'sortable',
                        title: {
                          label: '列排序',
                          tip: '列排序',
                        },
                        propType: 'bool',
                        setter: 'BoolSetter',
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
                      // {
                      //   name: 'align',
                      //   title: {
                      //     label: '对齐方式',
                      //     tip: 'align | 对齐方式',
                      //   },
                      //   propType: {
                      //     type: 'oneOf',
                      //     value: ['left', 'right', 'center'],
                      //   },
                      //   defaultValue: 'left',
                      //   setter: [
                      //     {
                      //       componentName: 'SelectSetter',
                      //       props: {
                      //         options: [
                      //           {
                      //             title: 'left',
                      //             value: 'left',
                      //           },
                      //           {
                      //             title: 'right',
                      //             value: 'right',
                      //           },
                      //           {
                      //             title: 'center',
                      //             value: 'center',
                      //           },
                      //         ],
                      //       },
                      //     },
                      //     'VariableSetter',
                      //   ],
                      // },
                      // {
                      //   name: 'fixed',
                      //   title: {
                      //     label: '固定列',
                      //     tip: 'fixed | 列是否固定',
                      //   },
                      //   description: '列是否固定，可选不固定和固定在左侧',
                      //   defaultValue: '',
                      //   propType: {
                      //     type: 'oneOf',
                      //     value: ['', 'left'],
                      //   },
                      //   setter: [
                      //     {
                      //       componentName: 'SelectSetter',
                      //       props: {
                      //         options: [
                      //           {
                      //             title: '不固定',
                      //             value: '',
                      //           },
                      //           {
                      //             title: '固定在左侧',
                      //             value: 'left',
                      //           },
                      //         ],
                      //       },
                      //     },
                      //     'VariableSetter',
                      //   ],
                      // },
                      // {
                      //   name: 'className',
                      //   title: {
                      //     label: '列样式类名',
                      //     tip: 'className | 列样式类名',
                      //   },
                      //   propType: 'string',
                      //   setter: 'StringSetter',
                      // },
                      // {
                      //   name: 'width',
                      //   title: {
                      //     label: '列宽度',
                      //     tip: '列宽度;当值为0时,表示该列未设置宽度属性，未设置宽度的列将等比例自适应剩余宽度',
                      //   },
                      //   propType: 'number',
                      //   setter: {
                      //     componentName: 'NumberSetter',
                      //     props: {
                      //       min: 0,
                      //     },
                      //   },
                      // },
                      // {
                      //   name: 'hiddenCol',
                      //   title: {
                      //     label: '隐藏',
                      //     tip: 'hiddenCol | 是否隐藏当前列',
                      //   },
                      //   propType: 'bool',
                      //   setter: 'BoolSetter',
                      // },
                      // {
                      //   name: 'cusRender',
                      //   title: {
                      //     label: '自定义渲染',
                      //     tip: 'cusRender | 插槽内的物料表达式可通过this.record获取当前行数据',
                      //   },
                      //   propType: 'func',
                      //   setter: [
                      //     {
                      //       componentName: 'SlotSetter',
                      //       title: '单元格插槽',
                      //       initialValue: {
                      //         type: 'JSSlot',
                      //         params: ['record'],
                      //         value: [],
                      //       },
                      //     },
                      //     'VariableSetter',
                      //   ],
                      // },
                      // {
                      //   name: 'sortable',
                      //   title: {
                      //     label: '列排序',
                      //     tip: '列排序',
                      //   },
                      //   propType: 'bool',
                      //   setter: 'BoolSetter',
                      // },
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
