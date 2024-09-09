<template>
  <div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <CommentList :commentList="commentList" :rows="rows"></CommentList>
  </div>
</template>

<script>
import { CommentList } from "@/components";
export default {
  components: {
    CommentList,
  },
  data() {
    return {
      rows: 4,
      commentList: [
        {
          creator: "admin",
          create_date_time: 20240709192903,
          obj_id: "107",
          receiver_id: null,
          receiver_name: null,
          creator_name: "系统管理员",
          obj_type: "1",
          content: "评论123啦啦啦啦啦l绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿啦啦啦啦啦l绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿绿",
          remark_id: "18",
          auth_flag: '1',
        },
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
          auth_flag: '1',
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
          auth_flag: '0',
        },
        {
          creator: "admin",
          create_date_time: 20240709192907,
          obj_id: "107",
          receiver_id: null,
          receiver_name: null,
          creator_name: "系统管理员",
          obj_type: "1",
          content: "评论123",
          remark_id: "22",
          auth_flag: '0',
        },
        {
          creator: "admin",
          create_date_time: 20240709192908,
          obj_id: "107",
          receiver_id: null,
          receiver_name: null,
          creator_name: "系统管理员",
          obj_type: "1",
          content: "评论123",
          remark_id: "23",
          auth_flag: '0',
        },
        {
          creator: "admin",
          create_date_time: 20240709192912,
          obj_id: "107",
          receiver_id: "hujie",
          receiver_name: "胡杰",
          creator_name: "系统管理员",
          obj_type: "1",
          content: "评论123",
          remark_id: "24",
          auth_flag: '0',
        },
        {
          creator: "admin",
          create_date_time: 20240709192913,
          obj_id: "107",
          receiver_id: "hujie",
          receiver_name: "胡杰",
          creator_name: "系统管理员",
          obj_type: "1",
          content: "评论123",
          remark_id: "25",
          auth_flag: '1',
        },
        {
          creator: "admin",
          create_date_time: 20240709192939,
          obj_id: "107",
          receiver_id: "hujie",
          receiver_name: "胡杰",
          creator_name: "系统管理员",
          obj_type: "1",
          content: "评论123",
          remark_id: "26",
          auth_flag: '1',
        },
        {
          creator: "admin",
          create_date_time: 20240709192945,
          obj_id: "107",
          receiver_id: "hujie",
          receiver_name: "胡杰",
          creator_name: "系统管理员",
          obj_type: "1",
          content: "评论123",
          remark_id: "27",
          auth_flag: '1',
        },
        {
          creator: "admin",
          create_date_time: 20240709192945,
          obj_id: "107",
          receiver_id: "hujie",
          receiver_name: "胡杰",
          creator_name: "系统管理员",
          obj_type: "1",
          content: "评论123评论123评论123评论123评论123评论123评论123评论123评论123评论123评论123评论123评论123评论123评论123评论123评论123评论123评论123评论123评论123评论123评论123评论123评论123",
          remark_id: "27",
          auth_flag: '1',
        },
      ],
    //   commentList: [
    //     {
    //       id: 1,
    //       time: Date.now(),
    //       name: "张三",
    //       content: "上半年有激励费用,如果6月30号前落地,可以申请该费用",
    //     },
    //     {
    //       id: 2,
    //       time: Date.now(),
    //       name: "李四",
    //       content: "第二个时间",
    //     },
    //     {
    //       id: 3,
    //       time: Date.now(),
    //       name: "孙少安",
    //       content: "第三个时间",
    //     },
    //     {
    //       id: 4,
    //       time: Date.now(),
    //       name: "孙少安1",
    //       content: "第4个时间",
    //     },
    //     {
    //       id: 5,
    //       time: Date.now(),
    //       name: "孙少安2",
    //       content: "第5个时间",
    //     },
    //   ],
    };
  },
  methods: {},
};
</script>

<style scoped></style>
