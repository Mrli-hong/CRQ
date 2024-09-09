const transformAfterTemplate = function transformAfter(res) {
  console.log("后置处理函数", res);
  //数据后置处理的方法
  if (res.error_no === 0) {
    return {
      data: res?.rows,
    };
  }
  return {
    data: [],
  };
};
const queryHandlerTemplate = function queryHandler() {
  //数据查询方法, 默认接口
  return this.dataSourceMap["查询评论列表getVisitrecordCommentAtomInner"]
    .load({
      page_size: 500,
      // obj_id: this.state.obj_id || '',
      // obj_type: this.state.obj_type || ''
    })
    .then((res) => {
      if (res.error_no === 0) {
        return res;
      }
      throw Error(res);
    });
};
const replyHandlerTemplate = function replyHandler(item, index) {
  //单条评论进行新增回复的方法，默认接口
  return this.dataSourceMap["回复单条评论postVisitrecordCommentAtomInner"]
    .load({
      remark: {
        // obj_id: this.state.obj_id || "",
        // obj_type: this.state.obj_type || "",
        content: item.newReply,
        receiver_id: item.creator,
      },
    })
    .then((res) => {
      if (res.error_no === 0) {
        return res;
      }
      throw Error(res);
    });
};
const deleteHandlerTemplate = function deleteHandler(item) {
  //新增单条评论时的方法，默认接口
  return this.dataSourceMap["删除评论deleteVisitrecordCommentAtomInner"]
    .load({
      remark_id: item.remark_id,
    })
    .then((res) => {
      if (res.error_no === 0) {
        return res;
      }
      throw Error(res);
    });
};

module.exports = {
  componentName: "CommentList",
  category: "展示类",
  title: "评论列表",
  icon: "",
  docUrl: "",
  docLink: "",
  screenshot:"",
  snippets: [
    {
      title: "评论列表",
      schema: {
        componentName: "CommentList",
        props: {
          rows: 4,
          commentList: [
            {
              creator: "admin",
              create_date_time: 20240709192905,
              obj_id: "107",
              receiver_id: null,
              receiver_name: null,
              creator_name: "系统管理员",
              obj_type: "1",
              content: "评论123",
              remark_id: "20",
              auth_flag: "1"
            },
            {
              creator: "admin",
              create_date_time: 20240709192906,
              obj_id: "107",
              receiver_id: null,
              receiver_name: null,
              creator_name: "系统管理员",
              obj_type: "1",
              content: "评论123",
              remark_id: "21",
              auth_flag: "0",
            },
          ],
        },
      },
    },
  ],
  props: [
    {
      title: "基础属性",
      display: "block",
      type: "group",
      items: [
        {
          name: "commentList",
          title: {
            label: "评论列表数据",
            tip: "默认数据",
          },
          propType: "string",
          setter: "JsonSetter",
          supportVariable: true,
          defaultValue: [
            {
              creator: "admin",
              create_date_time: 20240709192905,
              obj_id: "107",
              receiver_id: null,
              receiver_name: null,
              creator_name: "系统管理员",
              obj_type: "1",
              content: "评论123",
              remark_id: "20",
              auth_flag: "1",
            },
            {
              creator: "admin",
              create_date_time: 20240709192906,
              obj_id: "107",
              receiver_id: null,
              receiver_name: null,
              creator_name: "系统管理员",
              obj_type: "1",
              content: "评论123",
              remark_id: "21",
              auth_flag: "0",
            },
          ],
          condition: {
            type: 'JSFunction',
            value: "() => false"
          }
        },
        {
          name: "queryHandler",
          title: {
            label: "数据查询",
            tip: "数据查询",
          },
          propType: "func",
          setter: {
            componentName: "FunctionSetter",
            props: {
              template: `\n ${queryHandlerTemplate.toString()} \n`,
            },
          },
          supportVariable: true,
        },
        {
          name: "transformAfter",
          title: {
            label: "后置处理",
            tip: "数据后置处理,绑定该函数后,接口返回后会触发此回调函数",
          },
          propType: "func",
          setter: {
            componentName: "FunctionSetter",
            props: {
              template: `\n ${transformAfterTemplate.toString()} \n`,
            },
          },
          supportVariable: true,
        },
        {
          name: "replyHandler",
          title: {
            label: "新增回复",
            tip: "点击某条评论进行回复并且提交时的处理函数",
          },
          propType: "func",
          setter: {
            componentName: "FunctionSetter",
            props: {
              template: `\n ${replyHandlerTemplate.toString()} \n`,
            },
          },
          supportVariable: true,
        },
        {
          name: "deleteHandler",
          title: {
            label: "删除评论",
            tip: "删除某条评论时的处理函数",
          },
          propType: "func",
          setter: {
            componentName: "FunctionSetter",
            props: {
              template: `\n ${deleteHandlerTemplate.toString()} \n`,
            },
          },
          supportVariable: true,
        },
        {
          name: "rows",
          title: {
            label: "默认行数",
            tip: "回复区文本域的默认行数",
          },
          propType: "number",
          setter: "NumberSetter",
          defaultValue: 4,
        },
      ],
    },
  ],
  configure: {
    supports: {
      className: true,
      events: [],
      methods: [
        {
          name: 'getQueryData',
          description: '查询评论列表的方法',
          examples: ['this.$refs[{refId}].getQueryData();']
        }
      ],
      style: true,
    },
  },
};
