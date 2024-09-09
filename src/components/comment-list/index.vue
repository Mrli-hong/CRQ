<template>
  <div class="comment-list-wrapper">
    <div class="comment-list-up">
      <h-timeline>
        <h-timeline-item
          v-show="currentCommentList?.length > 0"
          v-for="(item, index) in currentCommentList"
          color="rgb(44, 104, 255)"
          :key="item.id"
        >
          <p class="comment-list-time">
            {{ convertTime(item.create_date_time) }}
          </p>
          <div class="comment-list-row">
            <span
              class="comment-list-row-name"
              style="margin-right: 8px"
              v-html="
                !item.receiver_name
                  ? `<b>${item.creator_name}</b>:`
                  : `<b>${item.creator_name}</b>回复<b>${item.receiver_name}</b>:`
              "
            >
            </span>
            <span class="comment-list-row-content">{{ item.content }}</span>
            <h-icon
              name="android-textsms"
              color="#2C68FF"
              :size="13"
              style="margin: 0 10px"
              @on-click="addIconComment(item, index)"
            >
            </h-icon>
            <h-icon
              v-show="item.auth_flag === '1'"
              name="trash_fill"
              color="#2C68FF"
              :size="14"
              style="line-height: 1.3"
              @on-click="removeComment(item)"
            >
            </h-icon>
          </div>
          <div class="comment-list-up-reply" v-show="item.isShowReply">
            <h-input
              v-model="item.newReply"
              type="textarea"
              :rows="rows"
              :canResize="false"
              :placeholder="`回复 ${item.creator_name}`"
            ></h-input>
            <h-button
              type="primary"
              style="margin: 10px 10px 10px 0"
              @on-click="addReplay(item, index)"
              >提交</h-button
            >
            <h-button
              type="ghost"
              style="margin: 10px 0"
              @on-click="cancelReplay(index)"
              >取消</h-button
            >
          </div>
        </h-timeline-item>
      </h-timeline>
      <span v-show="currentCommentList?.length === 0">暂无评论</span>
    </div>
  </div>
</template>

<script>
import { Timeline, TimelineItem, Button, Icon, Input } from "h_ui";
import dayjs from "dayjs";
export default {
  name: "CommentList",
  components: {
    HTimeline: Timeline,
    HTimelineItem: TimelineItem,
    HButton: Button,
    HIcon: Icon,
    HInput: Input,
  },
  props: {
    commentList: {
      type: Array,
      default: () => [],
    },
    rows: {
      type: Number,
      default: 4,
    },
    queryHandler: {
      type: Function,
      default: (key, params) => {
        console.log("comment action", key, params);
      },
    },
    transformAfter: {
      type: Function,
    },
    replyHandler: {
      type: Function,
      default: (key, params) => {
        console.log("replay action", key, params);
      },
    },
    deleteHandler: {
      type: Function,
      default: (key, params) => {
        console.log("delete action", key, params);
      },
    },
  },
  watch: {
  },
  computed: {
  },
  data() {
    return {
      currentValue: "",
      replyValue: "",
      currentCommentList: this.isDev() ? this.commentList : null,
    };
  },
  mounted() {
    if(!this.isDev()) {
      this.getQueryData();
    }
    console.log('currentCommentList', this.currentCommentList)
  },
  methods: {
    // 是否为设计态
    isDev(){
      return window.__is_simulator_env__;
    },
    getQueryData() {
      try {
        this.queryHandler()
          ?.then((res) => {
            return this.transformAfter(res);
          })
          .then((res) => {
            this.currentCommentList = res.data || [];
          })
          .finally(() => {
          });
      } catch (e) {
        console.log(e);
      }
    },
    //点击评论图标，对当前条进行回复
    addIconComment(item, index) {
      if (this.currentCommentList[index]?.newReply) {
        this.$set(this.currentCommentList[index], "newReply", "");
      }
      this.$set(
        this.currentCommentList[index],
        "isShowReply",
        !this.currentCommentList[index].isShowReply
      );
      //确保只有1个评论下显示回复区
      this.currentCommentList.forEach((comment, i) => {
        if (i !== index) {
          this.$set(comment, "isShowReply", false);
        }
      });
    },
    //回复区的提交
    addReplay(item, index) {
      this.currentCommentList[index].isShowReply = false;
      //提交逻辑开始 item.newReplay
      try {
        this.replyHandler(item, index)?.then((res) => {
          if (res.error_no === 0) {
            this.getQueryData();
            this.$hMessage.success("提交成功");
          } else {
            this.$hMessage.error("提交失败");
          }
        });
      } catch (e) {
        console.log(e);
      }
    },
    //回复区的取消
    cancelReplay(index) {
      this.currentCommentList[index].isShowReply = false;
    },
    //删除回复
    removeComment(item) {
      try {
        this.deleteHandler(item)?.then((res) => {
          if (res.error_no === 0) {
            this.getQueryData();
            this.$hMessage.success("删除成功");
          } else {
            this.$hMessage.error("删除失败");
          }
        });
      } catch (e) {
        console.log(e);
      }
    },
    convertTime(time) {
      //14位时间戳的转化
      return dayjs(time.toString()).format("YYYY-MM-DD HH:mm:ss");
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .h-timeline-item-content {
  padding: 1px 1px 0px 18px;
}
::v-deep .h-timeline-item {
  padding: 0px;
}

.comment-list-up {
  padding: 10px;
}
.comment-list-wrapper {
  padding-bottom: 50px;
}

.comment-list-time {
  color: #999;
}
.comment-list-row {
  display: flex;
  // align-items: center;
  padding: 8px 0;
  &-name {
    white-space: nowrap;
  }
}
</style>
