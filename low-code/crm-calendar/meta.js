const cancelCallbackTemplate = function cancelCallback() {
    //点击取消按钮后的回调事件，比如关闭页签
    console.log('cancelCallbackTemplate')
}

const submitSuccessCallbackTemplate = function submitSuccessCallback() {
    //点击提交按钮成功后的回调事件，比如关闭页签并打开指定页签，刷新新页面
    console.log('submitSuccessCallbackTemplate')
}

module.exports = {
    componentName: 'CrmCalendar',
    category: '业务组件',
    title: '日历',
    icon: '/static/icons/table.svg',
    docUrl: '',
    docLink: '',
    screenshot: '/static/icons/table.svg',
    snippets: [
        {
            title: '状态日历组件',
            schema: {
                componentName: 'CrmCalendar',
                props: {
                    dataSourceMap: {
                        type: 'JSExpression',
                        value: 'this.dataSourceMap',
                    },
                    nextIsChoosed: false,
                    isContainExtendInfo: true,
                    extendSearchInterface: '',
                    extendInfoParams: {},
                    dateDotName: '',
                    dateDotField: '',
                    dateStatus: []
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
            title: '基础属性',
            display: 'block',
            type: 'group',
            items: [
                {
                    name: "v-model",
                    title: {
                        label: "绑定值",
                        tip: "输入框的绑定值",
                    },
                    propType: "Date",
                    setter: "StringSetter",
                    supportVariable: true,
                },
                {
                    name: 'nextIsChoosed',
                    title: '未来日期是否可选',
                    defaultValue: false,
                    propType: 'boolean',
                    setter: 'BoolSetter',
                    supportVariable: true,
                },
                {
                    name: 'changeDateCallBack',
                    title: '切换选中日期回调',
                    propType: 'func',
                    setter: 'FunctionSetter',
                    supportVariable: true,
                },
            ],
        },
        {
            title: '扩展信息配置',
            display: 'block',
            type: 'group',
            items: [
                {
                    name: 'isContainExtendInfo',
                    title: {
                        label: '是否包含扩展信息',
                        tip: '是否包含扩展信息',
                    },
                    defaultValue: false,
                    propType: 'boolean',
                    setter: 'BoolSetter',
                    supportVariable: true,
                },
                {
                    name: 'extendSearchInterface',
                    title: {
                        label: '日期扩展信息查询接口',
                        tip: '日期扩展信息查询接口',
                    },
                    propType: 'string',
                    setter: 'StringSetter',
                    supportVariable: true,
                },
                {
                    name: 'extendInfoParams',
                    title: {
                        label: '日期扩展信息查询接口额外入参',
                        tip: '日期扩展信息查询接口额外入参',
                    },
                    propType: 'object',
                    setter: 'JsonSetter',
                    supportVariable: true,
                },
                {
                    name: 'dateStatusField',
                    title: {
                        label: '日期状态字段',
                        tip: '日期状态字段',
                    },
                    propType: 'string',
                    setter: 'StringSetter',
                    supportVariable: true,
                },
                {
                    name: 'dateStatus',
                    title: {
                        label: '日期状态',
                    },
                    setter: {
                        componentName: 'ArraySetter',
                        props: {
                            itemSetter: {
                                componentName: 'ObjectSetter',
                                // initialValue: {
                                //     type: 'JSFunction',
                                //     value:
                                //         "() => ({ 'id': Math.random().toString(36).substring(6),'key': '', 'title': '选项', 'align': 'left', 'ellipsis': true, })",
                                // },
                                props: {
                                    config: {
                                        items: [
                                            {
                                                name: 'name',
                                                propType: 'string',
                                                title: '名称',
                                                setter: 'StringSetter',
                                                defaultValue: '',
                                                isRequired: true,
                                            },
                                            {
                                                name: 'value',
                                                title: {
                                                    label: '值',
                                                    tip: 'value | 值',
                                                },
                                                setter: 'StringSetter',
                                                isRequired: true,
                                            },
                                            {
                                                name: 'color',
                                                title: {
                                                    label: '颜色',
                                                    tip: 'color | 颜色',
                                                },
                                                propType: 'string',
                                                setter: 'ColorSetter',
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    name: 'dateDotField',
                    title: {
                        label: '日期角标字段',
                        tip: '日期角标字段',
                    },
                    propType: 'string',
                    setter: 'StringSetter',
                    supportVariable: true,
                },
                {
                    name: 'dateDotName',
                    title: {
                        label: '日期角标名称',
                        tip: '日期角标名称',
                    },
                    propType: 'string',
                    setter: 'StringSetter',
                    supportVariable: true,
                },
            ],
        },

    ],
    configure: {
        component: {
            isContainer: true,
        },
        supports: {
            className: true,
            events: [],
            style: true,
        },
    },
}
