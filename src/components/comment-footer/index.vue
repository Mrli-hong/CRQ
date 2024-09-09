<template>
  <div class="comment-list-footer" :style="{ width: footerWidth + 'px' }">
      <div class="comment-list-footer-container">
        <h-input
          class="comment-list-footer-input"
          :value="currentValue"
          @input="handleInput"
          :placeholder="placeholder"
        ></h-input>
        <h-button
          class="comment-list-footer-button"
          type="primary"
          @on-click="handleSubmit"
          >提交</h-button
        >
      </div>
    </div>
</template>
<script>
import { Button, Input } from "h_ui";
export default {
  name: "CommentFooter",
  components: {
    HButton: Button,
    HInput: Input,
  },
  props: {
    value: {
      type: String,
      default: () => "",
    },
    placeholder: {
      type: String,
      default: "发表评论...",
    },
  },
  watch: {
    value: {
      handler(newVal) {
        this.currentValue = newVal;
      },
      immediate: true,
    },
  },
  computed: {},
  data() {
    return {
      currentValue: this.value,
      footerWidth: 0,
    };
  },
  mounted() {
    //组件挂载后调整宽度
    this.getFooterWrapperWidth();
    // 监听窗口 resize ，动态更新footerWidth
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    // 组件销毁前移除resize
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    getFooterWrapperWidth() {
      const lcPageElement = document.querySelector('.lc-page');
      const wrapperWidth = lcPageElement.getBoundingClientRect().width + 8;
      this.footerWidth = wrapperWidth;
    },
    handleResize() {
      this.getFooterWrapperWidth();
    },
    handleInput(v) {
      this.currentValue = v;
      this.$emit("input", v);
    },
    handleSubmit() {
      this.$emit("handleSubmit", this.currentValue);
    },
  },
};
</script>

<style lang="scss" scoped>

.comment-list-footer {
  position: fixed;
  bottom: 0;
  height: 48px;
  width: 100%;
  padding: 8px;
  background-color: white;
  box-shadow: 4px 0px 12px 0px rgba(0, 0, 0, 0.2);
  border-radius: 0px 0px 8px 8px;
  &-container {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  &-input {
    flex: 1;
  }
  &-button {
    flex-shrink: 0;
  }
}
</style>
