const handleSubmitTemplate = function handleSubmit(submitValue) {
    //点击提交按钮时的处理函数, 入参为当前输入框的值
    console.log("handleSubmit", submitValue)
};

module.exports = {
  componentName: "CommentFooter",
  category: "展示类",
  title: "评论底部",
  icon: "",
  docUrl: "",
  docLink: "",
  screenshot: "",
  snippets: [
    {
      title: "评论底部",
      schema: {
        componentName: "CommentFooter",
        props: {
          placeholder: "发表评论...",
        },
      },
    },
  ],
  props: [
    {
      name: "v-model",
      title: {
        label: "绑定值",
        tip: "输入框的绑定值",
      },
      propType: "string",
      setter: "StringSetter",
      supportVariable: true,
    },
    {
      name: "placeholder",
      title: {
        label: "占位符",
        tip: "占位符",
      },
      defaultValue: "发表评论...",
      propType: "string",
      setter: "StringSetter",
      supportVariable: true,
    },
  ],
  configure: {
    supports: {
      className: true,
      events: [
        {
          name: "handleSubmit",
          template: `\n ${handleSubmitTemplate.toString()} \n`,
        },
      ],
      style: true,
    },
  },
};
